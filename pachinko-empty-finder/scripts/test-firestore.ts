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

  // 天井・ヤメ時
  ceiling:
    '天井は設定変更後・電源ON/OFFの挙動など詳細調査中。ヤメ時はAT・ST終了後、前兆がないことを確認してからヤメが基本。朝一リセット時の挙動については公式発表待ち。',

  // 打ち方・レア役
  'how-to-play':
    '【推奨打ち方】左1st（左押し）で消化。通常時に中押しや逆押しで消化した場合はペナルティが発生するため注意。AT中もナビ非発生時は基本的に左1st推奨。\n\n' +
    '【小役の取りこぼし】どこを狙っても小役の取りこぼしが存在しないため、左1stさえ守れば全リール適当打ちでOK。\n\n' +
    '【アクダマ目】左/右リールに赤7/青7図柄のサンド目、または中リールに運命図柄（青/赤）のサンド目が停止するとアクダマ目。2択チャレンジ正解で3枚獲得、不正解は0枚。2択発生時の第2停止後PUSHボタン押下で「2択正解履歴」を確認可能（過去10回まで）。',
  'how-to-play-img': `${R2}/l_akudama_drive_ekishou02.webp`,

  // 通常時・モード
  'basic-game':
    'Lアクダマドライブは、主に3種類のCZからボーナス当選を目指すゲーム性。CZ出現率は設定1で約1/166。\n\n' +
    '通常時は、悪揃いやチャンス目成立時に「フェーズアップ」の抽選を行っており、フェーズアップからCZ突入を目指すのがメインルート。フェーズ4まで到達すれば前兆濃厚！？（ガセあり）\n\n' +
    'その他にもベル成立でシンテツドウポイントを獲得し、ポイント0到達時にもCZ突入抽選を行う。新筐体エクスギアは筐体下部にイヤホンジャックを搭載。',
  'basic-game-img': `${R2}/l_akudama_drive_ekishou05.webp`,

  // CZ抽選システム（フェーズ＋シンテツドウポイント）
  'cz-summary':
    '【フェーズ管理】通常時のステージはフェーズ1〜4まで管理されており、フェーズごとに対応ステージが存在する。悪揃いやチャンス目成立時にフェーズが進行。フェーズアップするだけでなく、フェーズ3から1などに戻るパターンも頻繁に出現。\n\n' +
    '【シンテツドウポイント】ベル成立時にシンテツドウポイントを獲得（上段や右下がりベル成立時は1pt減算、小Vベル成立時は2pt減算）。ポイントが0に到達すればCZ「アナライズチャレンジ」の突入抽選を行う。',
  'cz-summary-img': `${R2}/l_akudama_drive_ekishou09.webp`,

  // CZ① 多脚戦車バトル
  'cz-1':
    '前半10G＋ジャッジパートの2部構成で、ジャッジパートでのアクダマ目成立が成功のカギとなるチャンスゾーン。成功期待度は約46%。\n\n' +
    '前半パート中は、成立役に応じてジャッジパートのゲーム数を獲得。ジャッジパート中は約1/5.9のアクダマ目高確率状態となり、2択チャレンジ発生でアクダマ目が停止すれば（2択成功）ボーナス当選濃厚！？',
  'cz-1-img': `${R2}/l_akudama_drive_ekishou24.webp`,

  // CZ② 処刑執行
  'cz-2':
    '10G継続で処刑課が開眼すれば成功となる高期待度のチャンスゾーン。成功期待度は約88%。\n\n' +
    '消化中は、悪揃いでチャンス、またチャンス目が成立すればボーナス当選濃厚！？となる。',
  'cz-2-img': `${R2}/l_akudama_drive_ekishou30.webp`,

  // CZ③ アナライズチャレンジ
  'cz-3':
    '前半15G＋後半5Gの2部構成で、自力でボーナスの当選率を上げていくチャンスゾーン。成功期待度は約59%。\n\n' +
    '前半パート中は、成立役に応じてカイセキランクをアップ。後半パート中はカイセキランクに応じてボーナスの抽選を行う。',
  'cz-3-img': `${R2}/l_akudama_drive_ekishou33.webp`,

  // 特殊CZ 運命チャンス
  'cz-special':
    '通常時の運命揃い（約1/7282）から突入するST5Gのチャンスゾーンで、突入時点でアクダマボーナス濃厚！？\n\n' +
    '消化中は2択チャレンジが発生し、アクダマ目停止で報酬を格上げ＋STゲーム数を再セット。格上げの成功回数に応じて報酬が変化する。',
  'cz-special-img': `${R2}/l_akudama_drive_ekishou36.webp`,

  // ボーナス関連
  bonus:
    '【アクダマボーナス】平均獲得枚数：約90枚（継続：ベル8回）。消化後は必ずST「デッドオアアライブ」に突入する初当たりボーナス。消化中は成立役に応じてATのゲーム数を上乗せするアイテムの獲得抽選を行う。入賞図柄：赤7シングル揃い。\n\n' +
    '【エピソードボーナス】平均獲得枚数：約169枚（継続：ベル15回）。種類に応じて突入先が変化するボーナス。消化後はSTを経由せずにATへ直行する。入賞図柄：赤7 or 青7ダブル揃い。',
  'bonus-img': `${R2}/l_akudama_drive_ekishou37.webp`,

  // ST（デッドオアアライブ）
  'st-main':
    '【デッドオアアライブ】9G継続のAT突入をかけたST。成功期待度は約50%。消化中は全役で成功抽選を行っており、悪揃いでチャンス！最終ゲームはアクダマ目が成立すると2択チャレンジが発生し、2択成功でAT「アクダマドライブ」に突入する。\n\n' +
    '【超S級デッドオアアライブ】上位AT「超S級アクダマドライブ」後などに突入する高継続のST。9G継続、成功期待度は約80%。消化中は悪揃いで成功濃厚！？成功時は上乗せ特化ゾーン「極悪ドライブ」に突入することも。',
  'st-main-img': `${R2}/l_akudama_drive_ekishou47.webp`,

  // AT・上位AT関連
  'at-main':
    '【処刑課バトル（上位ST）】極悪ドライブ＋超S級アクダマドライブ突入をかけた上位ST。10G＋α継続、成功期待度は約67%。ハイモード移行で勝利をかけた高確率状態へ突入。登場キャラに応じて成功期待度が変化する。\n\n' +
    '【アクダマドライブ AT】純増約7.1枚/Gのゲーム数上乗せ＋STループ型AT。ブースト高確中はアクダマ目高確率状態（約1/5.9）となり、2択成功で「ブーストゾーン」に突入。ブーストゾーンはアクダマ目を完全ナビ！\n\n' +
    '【超S級アクダマドライブ（上位AT）】継続率は約80%、突入時の獲得期待枚数は約3086枚（設定1）。超S級デッドオアアライブSTとの高ループで出玉を増やしていく。',
  'at-main-img': `${R2}/l_akudama_drive_ekishou57.webp`,

  // 上乗せ特化ゾーン
  'special-zone':
    '【極悪ドライブ】アクダマ目高確率状態（約1/5.9）の毎ゲーム上乗せタイプの特化ゾーン。7G継続、平均上乗せゲーム数は約115G。消化中は毎ゲーム成立役に応じてゲーム数上乗せの抽選を行い、アクダマ目が停止すれば「アクダマ上乗せ」が発動する。特化ゾーン消化後は必ず上位AT「超S級アクダマドライブ」に突入！\n\n' +
    '【超極悪ドライブ】継続ゲーム数20G、平均上乗せゲーム数約333Gと上乗せ性能が大幅アップした本機最強の上乗せ特化ゾーン。',
  'special-zone-img': `${R2}/l_akudama_drive_ekishou80.webp`,

  // 設定差・判別ポイント
  settings:
    '設定差・終了画面の詳細は調査中。設定差に関する情報は随時更新予定。狙い目設定は4・6となる見込み。',

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
  // リール配列画像はR2未アップロードのためURL未設定
  imageUrl: '',
  updatedAt: Timestamp.now(),
};

// =============================================
// Firestore書き込み処理
// =============================================
async function main() {
  try {
    console.log(`[1/3] machines/${slug} を書き込み中...`);
    await db.collection('machines').doc(slug).set(machineData, { merge: true });
    console.log('✅ machines 書き込み完了');

    console.log(`[2/3] machinemodels/${slug} を書き込み中...`);
    await db.collection('machinemodels').doc(slug).set(machineModelData, { merge: true });
    console.log('✅ machinemodels 書き込み完了');

    console.log(`[3/3] lillemodel/${slug} を書き込み中...`);
    await db.collection('lillemodel').doc(slug).set(lilleModelData, { merge: true });
    console.log('✅ lillemodel 書き込み完了');

    console.log('\n🎉 全データのFirestore書き込みが完了しました！');
  } catch (e) {
    console.error('❌ エラーが発生しました:', e);
  }
}

main();
