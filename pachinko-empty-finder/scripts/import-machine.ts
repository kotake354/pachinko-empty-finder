import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// --- 初期化設定 ---
const serviceAccountPath = path.resolve(process.cwd(), 'firebase-adminsdk.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

// R2共通ベースURL
const R2 = "https://pub-34654406a54c41e7b17e18764789c1a5.r2.dev";
const DMC5_R2 = `${R2}/dmc5_`;
const YOSHIMUNE_R2 = `${R2}/sinnutiyoshimune`;

/**
 * =============================================
 * 📂 機種データ集約エリア
 * =============================================
 */
const MACHINES_DATA: Record<string, any> = {
  // --- 真打 吉宗 ---
  "l-shinuchi-yoshimune": {
    name: "真打 吉宗",
    maker: "Daito（大都技研）",
    releaseDate: "2026年4月6日",
    modelName: "L／真打吉宗／A1",
    category: 'slot',
    type: ["ATタイプ", "スマスロ", "天井"],
    images: {
      main: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou01.webp`,
      reel: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_reel.png`,
      paytable: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_haitou00.png`
    },
    specDataInfo: {
      base: "約31G",
      netIncrease: "約2.7枚 〜 約9.0枚"
    },
    payoutData: [
      { label: "1", rate: "97.8%", val1: "1/313.0", val2: "1/488.9" },
      { label: "2", rate: "98.6%", val1: "1/303.0", val2: "1/471.5" },
      { label: "3", rate: "101.0%", val1: "1/283.5", val2: "1/438.5" },
      { label: "4", rate: "104.5%", val1: "1/267.1", val2: "1/398.1" },
      { label: "5", rate: "108.0%", val1: "1/256.9", val2: "1/377.0" },
      { label: "6", rate: "114.0%", val1: "1/250.6", val2: "1/354.9" }
    ],
    updateHistory: [
      { date: "2026-03-27", text: "設定示唆・終了画面・サブ液晶の詳細を更新" },
      { date: "2026-03-27", text: "打ち方（通常時・AT中）・天井・小役の詳細を網羅" },
      { date: "2026-03-23", text: "機種概要・全解析メニューを公開" }
    ],
    sections: [
      { id: "basic-spec", title: "機種概要・スペック", items: [
        { text: "『吉宗』が今までの常識を一新して再登場！差枚数管理タイプのAT「勧善懲悪RUSH」を軸に、吉宗史上最大BB「真ビッグボーナス（2000枚）」の連打を目指す。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou01.webp` },
        { title: "ゲームフロー", text: "通常時はCZ「悪人成敗チャンス」からATを目指す。AT中はレア役で差枚数を上乗せしつつ、対決CZから「真高確率」を目指そう！", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou01.webp` }
      ]},
      { id: "setting-check", title: "設定判別・推測/立ち回りポイント", items: [
        { title: "AT初当たり・CZ出現率", text: "高設定ほど優遇。AT初当たり1/400、CZ出現率1/255前後が設定4・5の目安。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou10.webp` },
        { title: "獲得枚数表記", text: "666枚突破で設定6濃厚!? 456枚・555枚等のパターンにも注目。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou51.webp` },
        { title: "AT終了画面/トロフィー", text: "リザルト画面でのキャラや、子パンダトロフィー出現で設定を示唆。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou110.webp` }
      ]},
      { id: "ceiling-reset", title: "天井/朝一（リセット）/やめどき", items: [
        { title: "ゲーム数天井", text: "CZ間1000GでCZ当選。AT間1500GでAT当選。ハマり台は狙い目。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou06.webp` },
        { title: "周期天井", text: "通常時はCZモードが全4種類存在し、最大周期到達でCZ/AT当選。天国期待度は約42%。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou02.webp` },
        { title: "朝一の恩恵", text: "設定変更時は天国モード移行率が優遇される可能性あり。早い当たりに期待！", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou03.webp` }
      ]},
      { id: "small-role-prob", title: "小役確率/通常時のベース", items: [
        { text: "通常時のベースは約31G/50枚。レア役高確中（BARを狙え）は全役の出現率がアップし、自力当選のメイン契機となる。" }
      ]},
      { id: "long-freeze", title: "ロングフリーズ/中段チェリー", items: [
        { title: "ロングフリーズ", text: "リプレイ成立時の一部で発生し、恩恵は「真ビッグボーナス」濃厚!?となる激アツ演出。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou100.webp` },
        { title: "中段チェリー", text: "稀にナビなしで停止する「確定中段チェリー」はAT当選濃厚!?" }
      ]},
      { id: "how-to-play", title: "打ち方/レア役の停止形", items: [
        { title: "リール配列", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_reel.png` },
        { title: "通常時の打ち方", text: "左1st押し推奨。左リール枠内にBARまたは青7を狙い、スイカ停止時のみ中・右に青7を目安にスイカフォロー。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_uchikata01.webp` },
        { title: "弱チェリー", text: "右リール中段にベル停止。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_uchikata06.webp` },
        { title: "強チェリー", text: "右リール中段にチェリー停止。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_uchikata07.webp` },
        { title: "スイカ", text: "右上がりスイカ揃い。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_uchikata08.webp` },
        { title: "チャンス目", text: "スイカハズレや中段ベル・ベル・リプレイなど。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_uchikata09.webp` },
        { title: "AT中の打ち方", text: "ナビ発生時は指示に従い、狙え高確中は指定図柄を全リールに。押し順ミスに注意。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_uchikata12.webp` }
      ]},
      { id: "basic-gameplay", title: "基本のゲーム性/通常時のステージ", items: [{ text: "レア役で虎・龍の実体化を狙いつつ、規定ポイントでのCZ当選を目指す。夜回りに移行すれば期待大。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou41.webp` }]},
      { id: "cycle-mode", title: "規定ポイントによる抽選［周期モード］", items: [{ text: "通常A・通常B・通常C・天国の4モード。最大600ptで1周期到達。モードCはAT直撃の期待大。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou43.webp` }]},
      { id: "tiger-dragon", title: "実体化抽選［虎/龍］", items: [{ text: "虎は「ポイント倍増」、龍は「レア役高確」。双方実体化で大量ポイントとCZのCZ重複当選も!?", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou45.webp` }]},
      { id: "battou-chance", title: "抜刀メーター/抜刀チャンス", items: [{ text: "ベル10回引くごとに抜刀チャンス抽選。メーターMAXでCZ以上の大チャンス。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou47.webp` }]},
      { id: "hyakka-jinba", title: "百花繚乱チャンス/人馬一体チャンス", items: [{ text: "BARが揃うたびにポイント大量獲得。人馬一体なら獲得期待度がさらにアップ。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou49.webp` }]},
      { id: "hints-summary", title: "示唆演出まとめ", items: [
        { title: "各終了画面", text: "AT終了時やCZ失敗時にキャラが出現すれば設定やモードを示唆。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou51.webp` },
        { title: "サブ液晶の文字", text: "特定の文字や演出で周期や設定を示唆。常に上部ビジョンも注視しよう。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou115.webp` }
      ]},
      { id: "cz-akunin", title: "悪人成敗チャンス［CZ］", items: [{ text: "期待度約55%。自力で悪人を成敗してATを掴み取れ！強レア役なら撃破濃厚!?", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou53.webp` }]},
      { id: "at-kanzen", title: "勧善懲悪ラッシュ［AT］", items: [{ text: "純増2.7枚。消化中のレア役は差枚数上乗せだけでなく、対決CZの突入も抽選。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou81.webp` }]},
      { id: "oshirasu-chance", title: "御白洲（オシラス）チャンス", items: [{ text: "報酬決定ゾーン。＋50枚〜最大は真BB直行まで！レア役なら特殊上乗せ濃厚!?", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou83.webp` }]},
      { id: "kanzen-battle", title: "勧善懲悪チャンス［対決CZ］", items: [{ text: "3Gの短期決戦。最終ゲームで小役を引ければジャッジへ！勝利で真高確率。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou85.webp` }]},
      { id: "shin-high-prob", title: "真高確率［差枚数上乗せ特化ゾーン］", items: [{ text: "平均150枚上乗せ。この最中に約1/168の青7フラグを引けば真BB！", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou87.webp` }]},
      { id: "shin-bb-gekka", title: "真ビッグボーナス［真BB］/月下ノ花道", items: [{ text: "一撃2000枚の破壊力！純増9.0枚で月下ノ花道を経由してループを狙う。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou89.webp` }]},
      { id: "ultimate-eagle", title: "究極鷹ブレイク［最強特化ゾーン］", items: [{ text: "本機最強トリガー。突入時点で数千枚の期待値を持つ最強の特化ゾーン。", img: `${YOSHIMUNE_R2}/l_shinuchi_yoshimune_ekishou91.webp` }]},
      { id: "jissen-data", title: "実戦データ/スランプグラフ", items: [{ text: "導入後の実戦値を随時更新。設定6は高い安定感を誇るか。" }]}
    ]
  },

  // --- Lアクダマドライブ ---
  "l-akudama-drive": {
    name: 'Lアクダマドライブ',
    maker: 'SanThree（サンスリー）',
    releaseDate: '2026年4月6日',
    modelName: 'LアクダマドライブTP',
    category: 'slot',
    type: ['ATタイプ', 'スマスロ', '天井'],
    images: {
      main: `${R2}/akudama_drive/img_l_akudama_drive.png`,
      reel: `${R2}/akudama_drive/l_akudama_drive_reel.png`,
      paytable: `${R2}/akudama_drive/l_akudama_drive_haitou00.png`
    },
    pvUrl: 'https://www.youtube.com/embed/g0oSLQzaFyk?si=vdNy5Iu9RiwF81aI',
  },

  // --- スマスロ デビル メイ クライ5 スタイリッシュトライブ ---
  "l-dmc5-st": {
    name: "スマスロ デビル メイ クライ5 スタイリッシュトライブ",
    maker: "Adelion（アデリオン）",
    releaseDate: "2025年6月2日",
    modelName: "Lデビルメイクライ5ST XA",
    category: 'slot',
    type: ["ATタイプ", "スマスロ", "天井"],
    images: {
      main: `${DMC5_R2}/img_l_dmc5_st.webp`,
      reel: `${DMC5_R2}/l_dmc5_st_reel.png`,
      paytable: `${DMC5_R2}/l_dmc5_st_haitou00.webp`
    },
    specDataInfo: {
      base: "約33.7G",
      netIncrease: "約3.8枚/G or 約5.8枚/G"
    },
    payoutData: [
      { label: "1", rate: "97.5%", val1: "1/257.0", val2: "1/445.4" },
      { label: "2", rate: "98.2%", val1: "1/254.1", val2: "1/436.5" },
      { label: "3", rate: "100.2%", val1: "1/251.5", val2: "1/411.2" },
      { label: "4", rate: "105.2%", val1: "1/222.6", val2: "1/359.6" },
      { label: "5", rate: "109.2%", val1: "1/217.3", val2: "1/329.5" },
      { label: "6", rate: "114.9%", val1: "1/204.1", val2: "1/303.9" }
    ],
    // 通常時・ゲームフロー
    "basic-game-title": "通常時・ゲームフロー",
    "basic-game": [
      { title: "ゲームフロー", text: "通常時からCZ、ボーナス、そしてST「STYLISH TIME」を目指す王道フロー。", img: `${DMC5_R2}/l_dmc5_st_flow.webp` },
      { title: "通常時の打ち方", text: "左リール枠内にBARを狙い、スイカ停止時は中・右リールに赤7を目安にスイカをフォロー。", img: `${DMC5_R2}/l_dmc5_st_ekishou01.webp` },
      { title: "トランプ演出", text: "液晶に出現するカードでモードや期待度を示唆。CZ終了画面等にも注目。", img: `${DMC5_R2}/l_dmc5_st_ekishou02.webp` }
    ],
    // 通常/高確ステージ
    "stages-title": "通常/高確ステージ",
    "stages": [
      { title: "図書館", text: "基本ステージ。夕方に移行すれば高確のチャンス。", img: `${DMC5_R2}/l_dmc5_st_ekishou03.webp` },
      { title: "マーケット", text: "基本ステージ。前兆示唆等も行う。", img: `${DMC5_R2}/l_dmc5_st_ekishou04.webp` },
      { title: "ダンテ事務所", text: "高確示唆ステージ。滞在中のレア役はCZ当選に期待。", img: `${DMC5_R2}/l_dmc5_st_ekishou05.webp` }
    ],
    // 前兆ステージ
    "pre-cz-title": "前兆ステージ",
    "pre-cz": [
      { title: "ストリート", text: "【NERO】CZの前兆ステージ。", img: `${DMC5_R2}/l_dmc5_st_ekishou06.webp` },
      { title: "カタコンベ", text: "【V】CZの前兆ステージ。", img: `${DMC5_R2}/l_dmc5_st_ekishou07.webp` },
      { title: "生家", text: "【DANTE】CZの前兆ステージ。期待度高！", img: `${DMC5_R2}/l_dmc5_st_ekishou08.webp` },
      { title: "Devils Midnight Chase", text: "ボーナスの前兆ステージ。消化中の役で昇格抽選。", img: `${DMC5_R2}/l_dmc5_st_ekishou09.webp` }
    ],
    // CZ抽選システム
    "cz-system-title": "CZ抽選システム",
    "cz-system": [
      { title: "ポイント減算", text: "通常時はコンボポイント等を減算しCZを目指す。", img: `${DMC5_R2}/l_dmc5_st_ekishou10.webp` },
      { title: "チャンス目", text: "押し順ナビ発生時はチャンス目成立の好機。ポイント大幅減算に期待。", img: `${DMC5_R2}/l_dmc5_st_ekishou11.webp` },
      { title: "インターフェース", text: "液晶左右のゲージや周期数に注目。赤文字ならチャンス。", img: `${DMC5_R2}/l_dmc5_st_ekishou12.webp` },
      { title: "周期抽選", text: "規定周期到達でCZ発展。倍率表示が出ればチャンス。", img: `${DMC5_R2}/l_dmc5_st_ekishou14.webp` }
    ],
    // CZ① NERO
    "cz-1-title": "NERO（ネロ）[CZ①]",
    "cz-1": [
      { title: "ネロCZ", text: "期待度約40%。カットインからデビル目を狙え！", img: `${DMC5_R2}/l_dmc5_st_ekishou16.webp` },
      { title: "デビル目狙い", text: "中リールに赤7・DMC・赤7停止で成功！", img: `${DMC5_R2}/l_dmc5_st_ekishou17.webp` }
    ],
    // CZ② V
    "cz-2-title": "V（ブイ）[CZ②]",
    "cz-2": [
      { title: "V CZ", text: "期待度約41%。小役成立でダメージ＆STリセットの自力型。", img: `${DMC5_R2}/l_dmc5_st_ekishou18.webp` },
      { title: "ダメージ蓄積", text: "ボスを撃破すればボーナス確定！", img: `${DMC5_R2}/l_dmc5_st_ekishou19.webp` }
    ],
    // CZ③ DANTE
    "cz-3-title": "DANTE（ダンテ）[CZ③]",
    "cz-3": [
      { title: "ダンテCZ", text: "期待度約70%。最強の上位CZ。覚醒すれば成功！", img: `${DMC5_R2}/l_dmc5_st_ekishou20.webp` },
      { title: "覚醒演出", text: "成功時はボーナス＋ST直行の期待大。", img: `${DMC5_R2}/l_dmc5_st_ekishou21.webp` }
    ],
    // ボーナス
    "bonus-title": "ボーナス解析",
    "bonus": [
      { title: "EPISODE BONUS", text: "当選時点でST濃厚。消化中に継続ストック抽選も。", img: `${DMC5_R2}/l_dmc5_st_ekishou22.webp` },
      { title: "DMC BONUS", text: "ST突入を懸けた初当たりボーナス。バトル勝利でSTへ。", img: `${DMC5_R2}/l_dmc5_st_ekishou24.webp` }
    ],
    // ST
    "st-main-title": "STYLISH TIME[ST]",
    "st-main": [
      { title: "ST概要", text: "継続率約65%〜89%。ボーナス当選でSTリセット。", img: `${DMC5_R2}/l_dmc5_st_ekishou26.webp` },
      { title: "前半パート", text: "小役履歴でボーナスを狙う。中押しカットインに期待。", img: `${DMC5_R2}/l_dmc5_st_ekishou27.webp` },
      { title: "エンブレム", text: "キャラ点灯で対応役がチャンスに。金ならボーナス濃厚？", img: `${DMC5_R2}/l_dmc5_st_ekishou28.webp` },
      { title: "後半パート", text: "ラスト3Gの自力継続ゾーン。Dead or ALIVE発生で好機。", img: `${DMC5_R2}/l_dmc5_st_ekishou31.webp` }
    ],
    // ST中ボーナス・特化
    "stylish-bonus-title": "ST中のボーナス・コンボチャンス",
    "stylish-bonus": [
      { title: "STYLISH BONUS", text: "ST中に当選するメイン出玉。BAR揃い等からコンボを狙う。", img: `${DMC5_R2}/l_dmc5_st_ekishou34.webp` },
      { title: "コンボチャンス", text: "上乗せ枚数を決定するランクアップゾーン。", img: `${DMC5_R2}/l_dmc5_st_ekishou35.webp` },
      { title: "ランクアップ", text: "Sランク到達でさらなる報酬アップのチャンス。", img: `${DMC5_R2}/l_dmc5_st_ekishou40.webp` }
    ],
    // 閻魔刀
    "ep-yamato-title": "EPISODE BONUS-閻魔刀- [上乗せ特化]",
    "ep-yamato": [
      { title: "閻魔刀", text: "高火力の枚数上乗せ特化ボーナス。", img: `${DMC5_R2}/l_dmc5_st_ekishou44.webp` },
      { title: "大量上乗せ", text: "エンブレム3個獲得でさらに期待度アップ。", img: `${DMC5_R2}/l_dmc5_st_ekishou58.webp` }
    ],
    // 上位要素
    "upper-title": "上位ST・バトルの行方",
    "upper": [
      { title: "URIZEN BATTLE", text: "ST強化を懸けた決戦。勝利でST継続率が大幅アップ！", img: `${DMC5_R2}/l_dmc5_st_ekishou48.webp` },
      { title: "Devils Never Cry", text: "継続率约89%を誇る最強の上位ST。期待枚数は約3400枚！", img: `${DMC5_R2}/l_dmc5_st_ekishou50.webp` },
      { title: "DEVIL BONUS", text: "上位ST中に当選。バースト突入で上乗せ性能が2倍に。", img: `${DMC5_R2}/l_dmc5_st_ekishou52.webp` }
    ],
    "freeze-title": "ロングフリーズ",
    "freeze": [
      { title: "フリーズ", text: "通常時の暗転等から発生。上位ST＋大量ストックの大チャンス！", img: `${DMC5_R2}/l_dmc5_st_ekishou56.webp` }
    ]
  }
};

/**
 * =============================================
 * 🚀 実行エンジン
 * =============================================
 */
async function importMachine(slug: string) {
  const data = MACHINES_DATA[slug];
  if (!data) {
    console.error(`❌ エラー: ${slug} のデータが見つかりません。MACHINES_DATA を確認してください。`);
    return;
  }

  try {
    console.log(`🚀 ${data.name} (${slug}) のインポートを開始します...`);
    
    // sections を分離（存在する場合）
    const { sections, ...mainInfo } = data;
    
    const machineMainData = {
      slug,
      ...mainInfo,
      updatedAt: Timestamp.now()
    };

    // 1. 本体データの保存
    const machineRef = db.collection('machines').doc(slug);
    await machineRef.set(machineMainData, { merge: true });

    // 2. sections サブコレクションの保存
    if (sections && Array.isArray(sections)) {
      console.log(`📦 ${sections.length} 個のセクションをインポート中...`);
      const sectionsCol = machineRef.collection('sections');
      
      for (const section of sections) {
        const { id, ...sectionData } = section;
        await sectionsCol.doc(id).set({
          ...sectionData,
          updatedAt: Timestamp.now()
        }, { merge: true });
      }
    }

    console.log(`✅ ${data.name} のインポートが完了しました！`);
  } catch (error) {
    console.error(`❌ ${slug} のインポート中にエラーが発生しました:`, error);
  }
}

// コマンドライン引数からスラグを取得
const targetSlug = process.argv[2];

async function main() {
  if (targetSlug === 'all') {
    console.log("🌀 全機種のインポートを実行します...");
    for (const slug in MACHINES_DATA) {
      await importMachine(slug);
    }
  } else if (targetSlug) {
    await importMachine(targetSlug);
  } else {
    console.log("💡 使い方:");
    console.log("  npx tsx scripts/import-machine.ts [slug]      (特定の機種のみ)");
    console.log("  npx tsx scripts/import-machine.ts all         (全機種一括)");
    console.log("\n現在登録されているスラグ:");
    Object.keys(MACHINES_DATA).forEach(s => console.log(`  - ${s}`));
  }
}

main();
