/**
 * =============================================================
 * R2 上の動画を最適化するバッチスクリプト
 * =============================================================
 *
 * ★1 (faststart): moov atom を先頭へ移動して即再生できるようにする（無劣化・高速）
 * ★2 (compress) : 解像度/ビットレートを落として軽量化（再エンコード）＋faststart
 *
 * モードを MODE 定数（または --mode）で切り替えるだけで ★2 に拡張できる。
 * 将来アップロード時の自動処理に流用する場合は buildFfmpegArgs() を共有すればよい。
 *
 * 実行例:
 *   npx tsx scripts/optimize-videos.ts                 # ★1 faststart を全動画に適用
 *   npx tsx scripts/optimize-videos.ts --dry-run       # 対象を確認するだけ（書き込みなし）
 *   npx tsx scripts/optimize-videos.ts --mode=compress # ★2 圧縮を適用
 */

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { execFileSync } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// ---- 設定 ---------------------------------------------------

type Mode = "faststart" | "compress";

// 既定の処理モード。ここを "compress" にすれば ★2 に切り替わる。
const DEFAULT_MODE: Mode = "faststart";

// 対象とする動画拡張子（moov/mdat を持つMP4系のみ。webm等は対象外）
const VIDEO_EXTS = [".mp4", ".mov", ".m4v"];

// ★2 圧縮時のパラメータ（必要に応じて調整）
const COMPRESS = {
  maxHeight: 720, // 縦の最大解像度
  crf: 28, // 画質（小さいほど高画質・大きいほど軽量）
  preset: "veryfast",
  audioBitrate: "128k",
};

// ---- .env.local を読み込む（standalone 実行のため手動パース）----

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}

// ---- ffmpeg 引数（モードごと） ------------------------------

function buildFfmpegArgs(mode: Mode, input: string, output: string): string[] {
  if (mode === "compress") {
    // ★2: 再エンコードして軽量化 + faststart
    return [
      "-y",
      "-i", input,
      "-vf", `scale=-2:'min(${COMPRESS.maxHeight},ih)'`,
      "-c:v", "libx264",
      "-crf", String(COMPRESS.crf),
      "-preset", COMPRESS.preset,
      "-c:a", "aac",
      "-b:a", COMPRESS.audioBitrate,
      "-movflags", "+faststart",
      output,
    ];
  }
  // ★1: 再エンコードせず moov を先頭へ（無劣化・高速）
  return ["-y", "-i", input, "-c", "copy", "-movflags", "+faststart", output];
}

// ---- moov が既に先頭にあるか（= faststart 済みか）判定 --------

function isAlreadyFaststart(buf: Buffer): boolean {
  const moov = buf.indexOf("moov");
  const mdat = buf.indexOf("mdat");
  if (moov === -1) return false;
  if (mdat === -1) return true;
  return moov < mdat;
}

// ---- メイン -------------------------------------------------

async function main() {
  loadEnv();

  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const modeArg = args.find((a) => a.startsWith("--mode="))?.split("=")[1] as Mode | undefined;
  const mode: Mode = modeArg ?? DEFAULT_MODE;

  const accountId = process.env.R2_ACCOUNT_ID!;
  const bucket = process.env.R2_BUCKET_NAME!;
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  console.log(`\n=== R2 動画最適化 (mode=${mode}${dryRun ? ", dry-run" : ""}) ===\n`);

  // 1. バケット内の全オブジェクトを列挙（ページング対応）
  const keys: string[] = [];
  let token: string | undefined;
  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: token })
    );
    for (const obj of res.Contents ?? []) {
      const key = obj.Key!;
      if (VIDEO_EXTS.includes(path.extname(key).toLowerCase())) keys.push(key);
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);

  console.log(`対象動画: ${keys.length} 件\n`);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vidopt-"));
  let processed = 0;
  let skipped = 0;

  for (const key of keys) {
    try {
      // 2. ダウンロード
      const get = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      const buf = Buffer.from(await get.Body!.transformToByteArray());
      const contentType = get.ContentType || "video/mp4";

      // 3. faststart 済みかつ ★1 ならスキップ（再実行に安全＝冪等）
      if (mode === "faststart" && isAlreadyFaststart(buf)) {
        console.log(`skip (faststart済): ${key}`);
        skipped++;
        continue;
      }

      const ext = path.extname(key);
      const inPath = path.join(tmpDir, `in${ext}`);
      const outPath = path.join(tmpDir, `out${ext}`);
      fs.writeFileSync(inPath, buf);

      if (dryRun) {
        console.log(`would process: ${key} (${(buf.length / 1048576).toFixed(1)}MB)`);
        processed++;
        continue;
      }

      // 4. ffmpeg 実行
      execFileSync("ffmpeg", buildFfmpegArgs(mode, inPath, outPath), { stdio: "ignore" });
      const outBuf = fs.readFileSync(outPath);

      // 5. 同じキーで上書きアップロード
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: outBuf,
          ContentType: contentType,
        })
      );

      const before = (buf.length / 1048576).toFixed(1);
      const after = (outBuf.length / 1048576).toFixed(1);
      console.log(`done: ${key}  ${before}MB -> ${after}MB`);
      processed++;

      fs.rmSync(inPath, { force: true });
      fs.rmSync(outPath, { force: true });
    } catch (e) {
      console.error(`error: ${key}`, e instanceof Error ? e.message : e);
    }
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log(`\n完了: 処理 ${processed} 件 / スキップ ${skipped} 件\n`);
}

main();
