import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Firebase Adminの初期化
const serviceAccountPath = path.resolve(process.cwd(), 'firebase-adminsdk.json');
const serviceAccountFile = fs.readFileSync(serviceAccountPath, 'utf8');
const serviceAccount = JSON.parse(serviceAccountFile);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();
const slug = 'l-akudama-drive';

const newSettings = [
  {
    title: "AT初当たり確率",
    text: "高設定ほど優遇。設定5以上を判別するうえでは、概ね1/500を切る数値が1つの基準となりそうだ。",
    table: {
      headers: ["設定", "AT初当たり確率"],
      // rows: [
      //   "設定1,1/555.5",
      //   "設定2,1/550.7",
      //   "設定3,1/543.6",
      //   "設定4,1/517.8",
      //   "設定5,1/487.7",
      //   "設定6,1/472.0",
      // ]
    }
  },
  {
    title: "ボーナス初当たり確率",
    text: "設定間の差は緩やかだが、高設定ほど出現しやすい。1/300をコンスタントに切るようであれば期待が持てる。",
    table: {
      headers: ["設定", "初当たり確率"],
      rows: [
        ["設定1", "1/321.2"],
        ["設定2", "1/319.3"],
        ["設定3", "1/315.8"],
        ["設定4", "1/307.0"],
        ["設定5", "1/296.9"],
        ["設定6", "1/291.1"],
      ]
    }
  },
  {
    title: "CZ出現率（合算）",
    text: "微差ではあるが高設定ほどCZに突入しやすい。特に強レア役なしでのフェーズ進行やシンテツポイント0からの当選に注目。",
    table: {
      headers: ["設定", "CZ出現率"],
      rows: [
        ["設定1", "1/166.1"],
        ["設定4", "1/159.0"],
        ["設定6", "1/152.1"],
      ]
    }
  },
  {
    title: "エンディング中の示唆",
    text: "エンディング中はアクダマ目停止時にPUSHボタンを押すと、ボイスや画面で設定示唆を行う模様。詳細は現在調査中。",
    img: "https://pub-34654406a54c41e7b17e18764789c1a5.r2.dev/akudama_drive/l_akudama_drive_ekishou86.webp"
  }
];

async function main() {
  try {
    console.log('Project ID:', serviceAccount.project_id);
    
    console.log('--- Test: JSON stringified table ---');
    await db.collection('debug_test').doc('json_doc').set({
      title: "AT初当たり確率",
      text: "short text",
      tableJson: JSON.stringify({
        headers: ["col1", "col2"],
        rows: [
          ["設定1", "1/555.5"],
          ["設定2", "1/550.7"]
        ]
      })
    });
    console.log('✅ JSON stringified table successful');
  } catch (e: any) {
    console.error('❌ Error details:');
    console.dir(e, { depth: null });
  }
}

main();
