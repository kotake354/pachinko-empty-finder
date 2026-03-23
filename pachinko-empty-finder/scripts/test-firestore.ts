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

// R2 ベースURL（jackpot-imagesバケット / akudama_driveフォルダ）
const R2 = 'https://pub-34654406a54c41e7b17e18764789c1a5.r2.dev/akudama_drive';

const slug = 'l-akudama-drive';

// =============================================
// machines コレクション用データ
// =============================================
const machineData = {
  slug,
  name: 'Lアクダマドライブ',
  maker: 'SanThree（サンスリー）',
  releaseDate: '2026年4月6日',
  modelName: 'LアクダマドライブTP',
  category: 'slot',
  type: ['ATタイプ', 'スマスロ', '天井'],
  images: {
    main: `${R2}/img_l_akudama_drive.png`,
  },
  pvUrl: 'https://www.youtube.com/embed/g0oSLQzaFyk?si=vdNy5Iu9RiwF81aI',
  features: [
    '近未来サイバーパンクアニメ『アクダマドライブ』がパチスロで登場！',
    '約1/8の「悪揃い」が、通常時やAT中を問わずあらゆるシーンで出玉の起点に！',
    'AT「アクダマドライブ」は純増約7.1枚/G。極限の2択チャレンジ「アクダマ目」等でゲーム数上乗せを目指せ！',
    '消化後はST「デッドオアアライブ」へ移行となりATとSTの強力ループが魅力',
    '19インチ液晶+サブウーファーの新筐体エクスギアが誕生！パチスロ初となるイヤホンジャックも搭載！',
  ],
  payoutData: [
    { label: '設定1', val1: '1/321.2', val2: '1/555.5', rate: '97.4%' },
    { label: '設定2', val1: '1/319.3', val2: '1/550.7', rate: '98.2%' },
    { label: '設定3', val1: '1/315.8', val2: '1/543.6', rate: '100.1%' },
    { label: '設定4', val1: '1/307.0', val2: '1/517.8', rate: '104.1%' },
    { label: '設定5', val1: '1/296.9', val2: '1/487.7', rate: '107.3%' },
    { label: '設定6', val1: '1/291.1', val2: '1/472.0', rate: '112.0%' },
  ],

  // ---- 解析セクション（AnalysisSections.tsx 対応） ----
  // 🌟 Firestoreの制限（配列内のネスト制限）を回避するため、テーブルデータは JSON 文字列として保持します。

  // 天井・ヤメ時
  ceiling: [
    { text: '天井は設定変更後・電源ON/OFFの挙動など詳細調査中。' },
    { text: 'ヤメ時はAT・ST終了後、前兆がないことを確認してからヤメが基本。' },
    { text: '朝一リセット時の挙動については公式発表待ち。' }
  ],

  // 小役確率・通常時のベース
  'small-role': [
    { title: '悪揃い確率', text: '【悪揃い（リプレイ）】約1/8で出現。悪図柄が一直線に停止するリプレイに相当する役で、あらゆるシーンの出玉の起点となる。' },
    { title: '通常時のベース', text: '詳細な小役確率・押し順ベルの確率などは調査中。ベル成立時にシンテツドウポイントを獲得し（上段・右下がりベルで1pt減算、小Vベルで2pt減算）、ポイント0到達でCZ抽選を行う。' },
    { title: 'チャンス目・運命揃い', text: '【チャンス目】チャンス目①（リプレイ）：中段に【悪/悪/ベル】が停止。チャンス目②・③（15枚）：運命図柄が小山または小Vに停止。' },
    { text: '【運命揃い（15枚）】約1/7282、運命図柄が右上がりor右下がり一直線に停止するプレミアフラグ. ' }
  ],

  // 打ち方・レア役
  'how-to-play': [
    { title: '推奨打ち方', text: '左1st（左押し）で消化。通常時に中押しや逆押しで消化した場合はペナルティが発生するため注意。AT中もナビ非発生時は基本的に左1st推奨。' },
    { title: '小役の取りこぼし', text: 'どこを狙っても小役の取りこぼしが存在しないため、左1stさえ守れば全リール適当打ちでOK。' },
    { title: 'アクダマ目（2択チャレンジ）', text: '左/右リールに赤7/青7図柄のサンド目、または中リールに運命図柄（青/赤）のサンド目が停止するとアクダマ目。2択チャレンジ正解で3枚獲得、不正解は0枚。', img: `${R2}/l_akudama_drive_ekishou02.webp` },
    { title: '2択正解履歴', text: '2択発生時の第2停止後PUSHボタン押下で「2択正解履歴」を確認可能（過去10回まで）。', img: `${R2}/l_akudama_drive_ekishou29.webp` }
  ],

  // 通常時・モード
  'basic-game': [
    { title: '基本ゲーム性', text: 'Lアクダマドライブは、主に3種類のCZからボーナス当選を目指すゲーム性。CZ出現率は設定1で約1/166。', img: `${R2}/l_akudama_drive_ekishou05.webp` },
    { title: 'フェーズ進行', text: '通常時は、悪揃いやチャンス目成立時に「フェーズアップ」の抽選を行っており、フェーズアップからCZ突入を目指すのがメインルート。フェーズ4まで到達すれば前兆濃厚！？（ガセあり）', img: `${R2}/l_akudama_drive_ekishou06.webp` },
    { title: '新筐体エクスギア', text: 'その他にもベル成立でシンテツドウポイントを獲得し、ポイント0到達時にもCZ突入抽選を行う。新筐体エクスギアは筐体下部にイヤホンジャックを搭載。', img: `${R2}/l_akudama_drive_ekishou07.webp` }
  ],

  // CZ抽選システム（フェーズ＋シンテツドウポイント）
  'cz-summary': [
    { title: 'フェーズ管理', text: '通常時のステージはフェーズ1〜4まで管理されており、フェーズごとに対応ステージが存在する。悪揃いやチャンス目成立時にフェーズが進行。', img: `${R2}/l_akudama_drive_ekishou09.webp` },
    { title: 'シンテツドウポイント', text: 'ベル成立時にシンテツドウポイントを獲得。ポイントが0に到達すればCZ「アナライズチャレンジ」の突入抽選を行う。', img: `${R2}/l_akudama_drive_ekishou22.webp` }
  ],

  // CZ① 多脚戦車バトル
  'cz-1': [
    { text: '前半10G＋ジャッジパートの2部構成で、ジャッジパートでのアクダマ目成立が成功のカギ。成功期待度は約46%。', img: `${R2}/l_akudama_drive_ekishou24.webp` },
    { text: '前半パート中にジャッジパートのゲーム数を獲得し、ジャッジパート中のアクダマ目（2択成功）でボーナス当選濃厚！？' }
  ],

  // CZ② 処刑執行
  'cz-2': [
    { text: '10G継続で処刑課が開眼すれば成功となる高期待度のチャンスゾーン。成功期待度は約88%。', img: `${R2}/l_akudama_drive_ekishou30.webp` },
    { text: '消化中は、悪揃いでチャンス、またチャンス目が成立すればボーナス当選濃厚！？となる。' }
  ],

  // CZ③ アナライズチャレンジ
  'cz-3': [
    { text: '前半15G＋後半5Gの2部構成で、自力でボーナスの当選率を上げていく。成功期待度は約59%。', img: `${R2}/l_akudama_drive_ekishou33.webp` },
    { text: '前半パート中にカイセキランクをアップし、後半パートでボーナス抽選。' }
  ],

  // 特殊CZ 運命チャンス
  'cz-special': [
    { text: '通常時の運命揃いから突入するST5Gのチャンスゾーンで、突入時点でアクダマボーナス濃厚！？', img: `${R2}/l_akudama_drive_ekishou36.webp` },
    { text: 'アクダマ目停止で報酬を格上げ＋STゲーム数を再セット。成功回数に応じて報酬が変化。' }
  ],

  // ボーナス関連
  bonus: [
    { title: 'アクダマボーナス', text: '平均獲得枚数：約90枚。消化後は必ずST「デッドオアアライブ」に突入する。', img: `${R2}/l_akudama_drive_ekishou37.webp` },
    { title: 'エピソードボーナス', text: '平均獲得枚数：約169枚。種類に応じて突入先が変化し、消化後はATへ直行する。', img: `${R2}/l_akudama_drive_ekishou40.webp` }
  ],

  // ST（デッドオアアライブ）
  'st-main': [
    { title: 'デッドオアアライブ', text: '9G継続のAT突入をかけたST。成功期待度は約50%。2択成功でAT突入！', img: `${R2}/l_akudama_drive_ekishou47.webp` },
    { title: '超S級デッドオアアライブ', text: '成功期待度は約80%。成功時は上乗せ特化ゾーン「極悪ドライブ」突入のチャンス。', img: `${R2}/l_akudama_drive_ekishou48.webp` }
  ],

  // AT・上位AT関連
  'at-main': [
    { title: 'アクダマドライブ AT', text: '純増約7.1枚/Gのゲーム数上乗せ＋STループ型AT。', img: `${R2}/l_akudama_drive_ekishou57.webp` },
    { title: '処刑課バトル', text: '極悪ドライブ＋超S級突入をかけた上位ST。成功期待度は約67%。', img: `${R2}/l_akudama_drive_ekishou52.webp` },
    { title: '超S級アクダマドライブ', text: '「超S級アクダマドライブ（上位AT）」継続率は約80%、突入時の獲得期待枚数は約3086枚（設定1）。', img: `${R2}/l_akudama_drive_ekishou84.webp` }
  ],

  // 上乗せ特化ゾーン
  'special-zone': [
    { title: '極悪ドライブ', text: 'アクダマ目高確率状態の毎ゲーム上乗せ特化ゾーン。平均上乗せは約115G。', img: `${R2}/l_akudama_drive_ekishou80.webp` },
    { title: '超極悪ドライブ', text: '継続ゲーム数20G、平均上乗せゲーム数約333Gの本機最強特化ゾーン。' }
  ],

  // ロングフリーズと運命揃い
  'long-freeze': [
    { title: 'ロングフリーズ', text: 'チャンス目成立時の一部で前兆を経由して発生。エピソードボーナス「不老不死の秘密」に当選し、ボーナス消化後に特化ゾーン「極悪ドライブ」＆上位AT「超S級アクダマドライブ」に突入！？', img: `${R2}/l_akudama_drive_ekishou03.webp` },
    { title: '運命揃い（プレミアフラグ）', text: '出現率は約1/7282。通常時：CZ「運命チャンス」に当選。エピソードボーナス中に成立した場合は上乗せの大チャンス！？', img: `${R2}/l_akudama_drive_ekishou04.webp` }
  ],

  // 🌟 設定差・判別ポイント（一撃クオリティ）
  settings: [
    {
      title: "AT初当たり確率",
      text: "高設定ほど優遇。設定5以上を判別するうえでは、概ね1/500を切る数値が1つの基準となりそうだ。",
      tableJson: JSON.stringify({
        headers: ["設定", "AT初当たり確率"],
        rows: [
          ["設定1", "1/555.5"],
          ["設定2", "1/550.7"],
          ["設定3", "1/543.6"],
          ["設定4", "1/517.8"],
          ["設定5", "1/487.7"],
          ["設定6", "1/472.0"],
        ]
      })
    },
    {
      title: "ボーナス初当たり確率",
      text: "設定間の差は緩やかだが、高設定ほど出現しやすい。1/300をコンスタントに切るようであれば期待が持てる。",
      tableJson: JSON.stringify({
        headers: ["設定", "初当たり確率"],
        rows: [
          ["設定1", "1/321.2"],
          ["設定2", "1/319.3"],
          ["設定3", "1/315.8"],
          ["設定4", "1/307.0"],
          ["設定5", "1/296.9"],
          ["設定6", "1/291.1"],
        ]
      })
    },
    {
      title: "CZ出現率（合算）",
      text: "微差ではあるが高設定ほどCZに突入しやすい。特に強レア役なしでのフェーズ進行やシンテツポイント0からの当選に注目。",
      tableJson: JSON.stringify({
        headers: ["設定", "CZ出現率"],
        rows: [
          ["設定1", "1/166.1"],
          ["設定4", "1/159.0"],
          ["設定6", "1/152.1"],
        ]
      })
    },
    {
      title: "エンディング中の示唆",
      text: "エンディング中はアクダマ目停止時にPUSHボタンを押すと、ボイスや画面で設定示唆を行う模様。詳細は現在調査中。",
      img: `${R2}/l_akudama_drive_ekishou86.webp`
    }
  ],

  updatedAt: Timestamp.now(),
};

// =============================================
// machinemodels コレクション用データ（配当表）
// =============================================
const machineModelData = {
  imageUrl: `${R2}/l_akudama_drive_haitou00.png`,
  updatedAt: Timestamp.now(),
};

// =============================================
// lillemodel コレクション用データ（リール配列）
// =============================================
const lilleModelData = {
  imageUrl: `${R2}/l_akudama_drive_reel.png`,
  updatedAt: Timestamp.now(),
};

// =============================================
// Firestore書き込み処理
// =============================================
async function main() {
  try {
    console.log(`[1/3] machines/${slug} を上書き中...`);
    await db.collection('machines').doc(slug).set(machineData);
    console.log('✅ machines 書き込み完了');

    console.log(`[2/3] machinemodels/${slug} を上書き中...`);
    await db.collection('machinemodels').doc(slug).set(machineModelData);
    console.log('✅ machinemodels 書き込み完了');

    console.log(`[3/3] lillemodel/${slug} を上書き中...`);
    await db.collection('lillemodel').doc(slug).set(lilleModelData);
    console.log('✅ lillemodel 書き込み完了');

    console.log('\n🎉 [一撃クオリティ] 全データのFirestore書き込みが完了しました！');
  } catch (e) {
    console.error('❌ エラーが発生しました:', e);
  }
}

main();
