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
const R2_BASE = "https://pub-34654406a54c41e7b17e18764789c1a5.r2.dev";
const DMC5_R2 = `${R2_BASE}/dmc5_`;
const YOSHIMUNE_R2 = `${R2_BASE}/sinnutiyoshimune`;
const AKUDAMA_R2 = `${R2_BASE}/akudama_drive`;

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
      main: `${AKUDAMA_R2}/img_l_akudama_drive.png`,
      reel: `${AKUDAMA_R2}/l_akudama_drive_reel.png`,
      paytable: `${AKUDAMA_R2}/l_akudama_drive_haitou00.png`
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
    sections: [
      { id: "ceiling", title: "天井・ヤメ時", items: [
        { text: '天井は設定変更後・電源ON/OFFの挙動など詳細調査中。' },
        { text: 'ヤメ時はAT・ST終了後、前兆がないことを確認してからヤメが基本。' },
        { text: '朝一リセット時の挙動については公式発表待ち。' }
      ]},
      { id: "small-role", title: "小役確率・通常時のベース", items: [
        { title: '悪揃い確率', text: '【悪揃い（リプレイ）】約1/8で出現。悪図柄が一直線に停止するリプレイに相当する役で、あらゆるシーンの出玉の起点となる。' },
        { title: '通常時のベース', text: '詳細な小役確率・押し順ベルの確率などは調査中。ベル成立時にシンテツドウポイントを獲得し（上段・右下がりベルで1pt減算、小Vベルで2pt減算）、ポイント0到達でCZ抽選を行う。' },
        { title: 'チャンス目・運命揃い', text: '【チャンス目】チャンス目①（リプレイ）：中段に【悪/悪/ベル】が停止。チャンス目②・③（15枚）：運命図柄が小山または小Vに停止。' },
        { text: '【運命揃い（15枚）】約1/7282、運命図柄が右上がりor右下がり一直線に停止するプレミアフラグ. ' }
      ]},
      { id: "how-to-play", title: "打ち方・レア役", items: [
        { title: '推奨打ち方', text: '左1st（左押し）で消化。通常時に中押しや逆押しで消化した場合はペナルティが発生するため注意。AT中もナビ非発生時は基本的に左1st推奨。' },
        { title: '小役の取りこぼし', text: 'どこを狙っても小役の取りこぼしが存在しないため、左1stさえ守れば全リール適当打ちでOK。' },
        { title: 'アクダマ目（2択チャレンジ）', text: '左/右リールに赤7/青7図柄のサンド目、または中リールに運命図柄（青/赤）のサンド目が停止するとアクダマ目。2択チャレンジ正解で3枚獲得、不正解は0枚。', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou02.webp` },
        { title: '2択正解履歴', text: '2択発生時の第2停止後PUSHボタン押下で「2択正解履歴」を確認可能（過去10回まで）。', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou29.webp` }
      ]},
      { id: "basic-game", title: "通常時・モード", items: [
        { title: '基本ゲーム性', text: 'Lアクダマドライブは、主に3種類のCZからボーナス当選を目指すゲーム性. CZ出現率は設定1で約1/166.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou05.webp` },
        { title: 'フェーズ進行', text: '通常時は、悪揃いやチャンス目成立時に「フェーズアップ」の抽選を行っており、フェーズアップからCZ突入を目指すのがメインルート. フェーズ4まで到達すれば前兆濃厚！？（ガセあり）', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou06.webp` },
        { title: '新筐体エクスギア', text: 'その他にもベル成立でシンテツドウポイントを獲得し、ポイント0到達時にもCZ突入抽選を行う. 新筐体エクスギアは筐体下部にイヤホンジャックを搭載.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou07.webp` }
      ]},
      { id: "cz-summary", title: "CZ抽選システム", items: [
        { title: 'フェーズ管理', text: '通常時のステージはフェーズ1〜4まで管理されており、フェーズごとに対応ステージが存在する. 悪揃いやチャンス目成立時にフェーズが進行.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou09.webp` },
        { title: 'シンテツドウポイント', text: 'ベル成立時にシンテツドウポイントを獲得. ポイントが0に到達すればCZ「アナライズチャレンジ」の突入抽選を行う.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou22.webp` }
      ]},
      { id: "cz-1", title: "CZ① 多脚戦車バトル", items: [
        { text: '前半10G＋ジャッジパートの2部構成で、ジャッジパートでのアクダマ目成立が成功のカギ. 成功期待度は約46%.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou24.webp` },
        { text: '前半パート中にジャッジパートのゲーム数を獲得し、ジャッジパート中のアクダマ目（2択成功）でボーナス当選濃厚！？' }
      ]},
      { id: "cz-2", title: "CZ② 処刑執行", items: [
        { text: '10G継続で処刑課が開眼すれば成功となる高期待度のチャンスゾーン. 成功期待度は約88%.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou30.webp` },
        { text: '消化中は、悪揃いでチャンス、またチャンス目が成立すればボーナス当選濃厚！？となる.' }
      ]},
      { id: "cz-3", title: "CZ③ アナライズチャレンジ", items: [
        { text: '前半15G＋後半5Gの2部構成で、自力でボーナスの当選率を上げていく. 成功期待度は約59%.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou33.webp` },
        { text: '前半パート中にカイセキランクをアップし、後半パートでボーナス抽選.' }
      ]},
      { id: "cz-special", title: "特殊CZ 運命チャンス", items: [
        { text: '通常時の運命揃いから突入するST5Gのチャンスゾーンで、突入時点でアクダマボーナス濃厚！？', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou36.webp` },
        { text: 'アクダマ目停止で報酬を格上げ＋STゲーム数を再セット. 成功回数に応じて報酬が変化.' }
      ]},
      { id: "bonus", title: "ボーナス解析", items: [
        { title: 'アクダマボーナス', text: '平均獲得枚数：約90枚. 消化後は必ずST「デッドオアアライヴ」に突入する.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou37.webp` },
        { title: 'エピソードボーナス', text: '平均獲得枚数：約169枚. 種類に応じて突入先が変化し、消化後はATへ直行する.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou40.webp` }
      ]},
      { id: "st-main", title: "ST（デッドオアアライヴ）", items: [
        { title: 'デッドオアアライヴ', text: '9G継続のAT突入をかけたST. 成功期待度は約50%. 2択成功でAT突入！', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou47.webp` },
        { title: '超S級デッドオアアライヴ', text: '成功期待度は約80%. 成功時は上乗せ特化ゾーン「極悪ドライブ」突入のチャンス.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou48.webp` }
      ]},
      { id: "at-main", title: "アクダマドライブ AT", items: [
        { title: 'アクダマドライブ AT', text: '純増約7.1枚/Gのゲーム数上乗せ＋STループ型AT.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou57.webp` },
        { title: '処刑課バトル', text: '極悪ドライブ＋超S級突入をかけた上位ST. 成功期待度は約67%.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou52.webp` },
        { title: '超S級アクダマドライブ', text: '「超S級アクダマドライブ（上位AT）」継続率は約80%、突入時の獲得期待枚数は約3086枚（設定1）.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou84.webp` }
      ]},
      { id: "special-zone", title: "上乗せ特化ゾーン", items: [
        { title: '極悪ドライブ', text: 'アクダマ目高確率状態の毎ゲーム上乗せ特化ゾーン. 平均上乗せは約115G.', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou80.webp` },
        { title: '超極悪ドライブ', text: '継続ゲーム数20G、平均上乗せゲーム数約333Gの本機最強特化ゾーン.' }
      ]},
      { id: "long-freeze", title: "ロングフリーズ・運命揃い", items: [
        { title: 'ロングフリーズ', text: 'チャンス目成立時の一部で前兆を経由して発生. エピソードボーナス「不老不死の秘密」に当選し、ボーナス消化後に特化ゾーン「極悪ドライブ」＆上位AT「超S級アクダマドライブ」に突入！？', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou03.webp` },
        { title: '運命揃い（プレミアフラグ）', text: '出現率は約1/7282. 通常時：CZ「運命チャンス」に当選. エピソードボーナス中に成立した場合は上乗せの大チャンス！？', img: `${AKUDAMA_R2}/l_akudama_drive_ekishou04.webp` }
      ]},
      { id: "settings", title: "設定判別・推測ポイント", items: [
        {
          title: "AT初当たり確率",
          text: "高設定ほど優遇. 設定5以上を判別するうえでは、概ね1/500を切る数値が1つの基準となりそうだ.",
          table: {
            headers: ["設定", "AT初当たり確率"],
            rows: [
              ["設定1", "1/555.5"],
              ["設定2", "1/550.7"],
              ["設定3", "1/543.6"],
              ["設定4", "1/517.8"],
              ["設定5", "1/487.7"],
              ["設定6", "1/472.0"],
            ]
          }
        },
        {
          title: "ボーナス初当たり確率",
          text: "設定間の差は緩やかだが、高設定ほど出現しやすい. 1/300をコンスタントに切るようであれば期待が持てる.",
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
          text: "微差ではあるが高設定ほどCZに突入しやすい. 特に強レア役なしでのフェーズ進行やシンテツポイント0からの当選に注目.",
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
          text: "エンディング中はアクダマ目停止時にPUSHボタンを押すと、ボイスや画面で設定示唆を行う模様. 詳細は現在調査中.",
          img: `${AKUDAMA_R2}/l_akudama_drive_ekishou86.webp`
        }
      ]}
    ]
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
    sections: [
      { id: "basic-game", title: "通常時・ゲームフロー", items: [
        { title: "ゲームフロー", text: "通常時からCZ、ボーナス、そしてST「STYLISH TIME」を目指す王道フロー。", img: `${DMC5_R2}/l_dmc5_st_flow.webp` },
        { title: "通常時の打ち方", text: "左リール枠内にBARを狙い、スイカ停止時は中・右リールに赤7を目安にスイカをフォロー。", img: `${DMC5_R2}/l_dmc5_st_ekishou01.webp` },
        { title: "トランプ演出", text: "液晶に出現するカードでモードや期待度を示唆。CZ終了画面等にも注目。", img: `${DMC5_R2}/l_dmc5_st_ekishou02.webp` }
      ]},
      { id: "stages", title: "通常/高確ステージ", items: [
        { title: "図書館", text: "基本ステージ。夕方に移行すれば高確のチャンス。", img: `${DMC5_R2}/l_dmc5_st_ekishou03.webp` },
        { title: "マーケット", text: "基本ステージ。前兆示唆等も行う。", img: `${DMC5_R2}/l_dmc5_st_ekishou04.webp` },
        { title: "ダンテ事務所", text: "高確示唆ステージ。滞在中のレア役はCZ当選に期待。", img: `${DMC5_R2}/l_dmc5_st_ekishou05.webp` }
      ]},
      { id: "pre-cz", title: "前兆ステージ", items: [
        { title: "ストリート", text: "【NERO】CZの前兆ステージ。", img: `${DMC5_R2}/l_dmc5_st_ekishou06.webp` },
        { title: "カタコンベ", text: "【V】CZの前兆ステージ。", img: `${DMC5_R2}/l_dmc5_st_ekishou07.webp` },
        { title: "生家", text: "【DANTE】CZの前兆ステージ。期待度高！", img: `${DMC5_R2}/l_dmc5_st_ekishou08.webp` },
        { title: "Devils Midnight Chase", text: "ボーナスの前兆ステージ。消化中の役で昇格抽選。", img: `${DMC5_R2}/l_dmc5_st_ekishou09.webp` }
      ]},
      { id: "cz-system", title: "CZ抽選システム", items: [
        { title: "ポイント減算", text: "通常時はコンボポイント等を減算しCZを目指す。", img: `${DMC5_R2}/l_dmc5_st_ekishou10.webp` },
        { title: "チャンス目", text: "押し順ナビ発生時はチャンス目成立の好機。ポイント大幅減算に期待。", img: `${DMC5_R2}/l_dmc5_st_ekishou11.webp` },
        { title: "インターフェース", text: "液晶左右のゲージや周期数に注目。赤文字ならチャンス。", img: `${DMC5_R2}/l_dmc5_st_ekishou12.webp` },
        { title: "周期抽選", text: "規定周期到達でCZ発展。倍率表示が出ればチャンス。", img: `${DMC5_R2}/l_dmc5_st_ekishou14.webp` }
      ]},
      { id: "cz-1", title: "NERO（ネロ）[CZ①]", items: [
        { title: "ネロCZ", text: "期待度約40%。カットインからデビル目を狙え！", img: `${DMC5_R2}/l_dmc5_st_ekishou16.webp` },
        { title: "デビル目狙い", text: "中リールに赤7・DMC・赤7停止で成功！", img: `${DMC5_R2}/l_dmc5_st_ekishou17.webp` }
      ]},
      { id: "cz-2", title: "V（ブイ）[CZ②]", items: [
        { title: "V CZ", text: "期待度約41%。小役成立でダメージ＆STリセットの自力型。", img: `${DMC5_R2}/l_dmc5_st_ekishou18.webp` },
        { title: "ダメージ蓄積", text: "ボスを撃破すればボーナス確定！", img: `${DMC5_R2}/l_dmc5_st_ekishou19.webp` }
      ]},
      { id: "cz-3", title: "DANTE（ダンテ）[CZ③]", items: [
        { title: "ダンテCZ", text: "期待度約70%。最強の上位CZ。覚醒すれば成功！", img: `${DMC5_R2}/l_dmc5_st_ekishou20.webp` },
        { title: "覚醒演出", text: "成功時はボーナス＋ST直行の期待大。", img: `${DMC5_R2}/l_dmc5_st_ekishou21.webp` }
      ]},
      { id: "bonus", title: "ボーナス解析", items: [
        { title: "EPISODE BONUS", text: "当選時点でST濃厚。消化中に継続ストック抽選も。", img: `${DMC5_R2}/l_dmc5_st_ekishou22.webp` },
        { title: "DMC BONUS", text: "ST突入を懸けた初当たりボーナス。バトル勝利でSTへ。", img: `${DMC5_R2}/l_dmc5_st_ekishou24.webp` }
      ]},
      { id: "st-main", title: "STYLISH TIME[ST]", items: [
        { title: "ST概要", text: "継続率約65%〜89%。ボーナス当選でSTリセット。", img: `${DMC5_R2}/l_dmc5_st_ekishou26.webp` },
        { title: "前半パート", text: "小役履歴でボーナスを狙う。中押しカットインに期待。", img: `${DMC5_R2}/l_dmc5_st_ekishou27.webp` },
        { title: "エンブレム", text: "キャラ点灯で対応役がチャンスに。金ならボーナス濃厚？", img: `${DMC5_R2}/l_dmc5_st_ekishou28.webp` },
        { title: "後半パート", text: "ラスト3Gの自力継続ゾーン。Dead or ALIVE発生で好機。", img: `${DMC5_R2}/l_dmc5_st_ekishou31.webp` }
      ]},
      { id: "stylish-bonus", title: "ST中のボーナス・コンボチャンス", items: [
        { title: "STYLISH BONUS", text: "ST中に当選するメイン出玉。BAR揃い等からコンボを狙う。", img: `${DMC5_R2}/l_dmc5_st_ekishou34.webp` },
        { title: "コンボチャンス", text: "上乗せ枚数を決定するランクアップゾーン。", img: `${DMC5_R2}/l_dmc5_st_ekishou35.webp` },
        { title: "ランクアップ", text: "Sランク到達でさらなる報酬アップのチャンス。", img: `${DMC5_R2}/l_dmc5_st_ekishou40.webp` }
      ]},
      { id: "ep-yamato", title: "EPISODE BONUS-閻魔刀- [上乗せ特化]", items: [
        { title: "閻魔刀", text: "高火力の枚数上乗せ特化ボーナス。", img: `${DMC5_R2}/l_dmc5_st_ekishou44.webp` },
        { title: "大量上乗せ", text: "エンブレム3個獲得でさらに期待度アップ。", img: `${DMC5_R2}/l_dmc5_st_ekishou58.webp` }
      ]},
      { id: "upper", title: "上位ST・バトルの行方", items: [
        { title: "URIZEN BATTLE", text: "ST強化を懸けた決戦. 勝利でST継続率が大幅アップ！", img: `${DMC5_R2}/l_dmc5_st_ekishou48.webp` },
        { title: "Devils Never Cry", text: "継続率约89%を誇る最強の上位ST. 期待枚数は約3400枚！", img: `${DMC5_R2}/l_dmc5_st_ekishou50.webp` },
        { title: "DEVIL BONUS", text: "上位ST中に当選. バースト突入で上乗せ性能が2倍に.", img: `${DMC5_R2}/l_dmc5_st_ekishou52.webp` }
      ]},
      { id: "freeze", title: "ロングフリーズ", items: [
        { title: "フリーズ", text: "通常時の暗転等から発生. 上位ST＋大量ストックの大チャンス！", img: `${DMC5_R2}/l_dmc5_st_ekishou56.webp` }
      ]}
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
    console.error(`❌ エラー: ${slug} のデータが見つかりません. MACHINES_DATA を確認してください.`);
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

    // 3. machinemodels (配当表) の保存
    if (machineMainData.images?.paytable) {
      console.log(`🖼️ machinemodels/${slug} (配当表) を保存中...`);
      await db.collection('machinemodels').doc(slug).set({
        imageUrl: machineMainData.images.paytable,
        updatedAt: Timestamp.now()
      }, { merge: true });
    }

    // 4. lillemodel (リール配列) の保存
    if (machineMainData.images?.reel) {
      console.log(`🎞️ lillemodel/${slug} (リール配列) を保存中...`);
      await db.collection('lillemodel').doc(slug).set({
        imageUrl: machineMainData.images.reel,
        updatedAt: Timestamp.now()
      }, { merge: true });
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
