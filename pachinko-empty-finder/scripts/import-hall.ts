/**
 * =============================================================
 * 店舗(halls)サンプルデータの一括登録スクリプト
 * =============================================================
 * docId = slug で halls コレクションへ登録する。
 * 位置情報は lat / lng に統一。座標はサンプル（おおよそ）なので、
 * 正式データが用意できたら HALLS を差し替えること。
 *
 * 実行: npx tsx scripts/import-hall.ts   (= npm run import-hall)
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";

const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "firebase-adminsdk.json"), "utf8")
);
if (!getApps().length) initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// サンプル店舗（座標はおおよそ。実データで差し替え可）
const HALLS: {
  slug: string;
  name: string;
  prefecture: string;
  area: string;
  lat: number;
  lng: number;
  address?: string;
}[] = [
  { slug: "maruhan-kashiwa", name: "マルハン柏店", prefecture: "千葉県", area: "柏", lat: 35.8623, lng: 139.9707, address: "末広町1-1" },
  { slug: "dynam-kashiwa", name: "ダイナム柏店", prefecture: "千葉県", area: "柏", lat: 35.8801, lng: 139.9612, address: "豊四季" },
  { slug: "gaia-funabashi", name: "ガイア船橋店", prefecture: "千葉県", area: "船橋", lat: 35.6947, lng: 139.9826, address: "本町7" },
  { slug: "maruhan-shinjuku", name: "マルハン新宿東宝ビル店", prefecture: "東京都", area: "新宿", lat: 35.6955, lng: 139.7005, address: "歌舞伎町1-19-1" },
  { slug: "espace-akihabara", name: "エスパス日拓秋葉原駅前店", prefecture: "東京都", area: "千代田", lat: 35.6983, lng: 139.7731, address: "外神田1-15-5" },
];

(async () => {
  for (const h of HALLS) {
    await db.collection("halls").doc(h.slug).set({
      name: h.name,
      prefecture: h.prefecture,
      area: h.area,
      slug: h.slug,
      lat: h.lat,
      lng: h.lng,
      address: h.address ?? null,
    });
    console.log(`登録: ${h.slug} (${h.name})`);
  }
  console.log(`\n完了: ${HALLS.length} 件の店舗を登録しました。`);
  process.exit(0);
})();
