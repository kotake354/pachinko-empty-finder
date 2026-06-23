import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

/**
 * =============================================
 * 🔧 Firebase Admin の初期化
 * =============================================
 */
const serviceAccountPath = path.resolve(process.cwd(), 'firebase-adminsdk.json');
const serviceAccountFile = fs.readFileSync(serviceAccountPath, 'utf8');
const serviceAccount = JSON.parse(serviceAccountFile);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

/**
 * =============================================
 * 🔧 設定・定数
 * =============================================
 */
const ISEKAI_R2 = "https://pub-34654406a54c41e7b17e18764789c1a5.r2.dev/isekaikarutetto";

const MACHINES_DATA: Record<string, any> = {
  "l-isekai-quartet": {
    name: "A-SLOT+ 異世界かるてっと BT",
    maker: "GINZA（銀座）",
    releaseDate: "2026年4月6日",
    modelName: "LB 異世界かるてっと KR",
    certificationNumber: "5S1513",
    category: 'slot',
    type: ["スマスロ", "ノーマル(A)タイプ", "ボーナストリガー"],
    images: {
      main: `${ISEKAI_R2}/img_l_isekai_quartet.png`,
      reel: `${ISEKAI_R2}/l_isekai_quartet_reel.png`,
      paytable: `${ISEKAI_R2}/l_isekai_quartet_haitou00.png`
    },
    payoutData: [
      { label: "1", rate: "97.9%（99.0%）", val1: "1/197.6", val2: "1/99.9" },
      { label: "2", rate: "99.9%（101.1%）", val1: "1/193.9", val2: "1/98.1" },
      { label: "5", rate: "104.4%（105.7%）", val1: "1/175.4", val2: "1/89.1" },
      { label: "6", rate: "109.0%（110.6%）", val1: "1/161.1", val2: "1/82.1" }
    ],
    updateHistory: [
      { date: "2026-04-10", text: "複数画像のグリッド表示に対応！すべての停止形画像を追加しました。" },
      { date: "2026-04-10", text: "打ち方・レア役停止形・ボーナス/BT中の手順を詳細化！" }
    ],
    sections: [
      {
        id: "1", title: "スペック・導入日・型式名", items: [
          {
            title: "スペックと特徴",
            table: {
              headers: ["設定", "ボーナス初当たり", "ボーナス合算", "出玉率（完全攻略）"],
              rows: [
                ["1", "1/197.6", "1/99.9", "97.9%（99.0%）"],
                ["2", "1/193.9", "1/98.1", "99.9%（101.1%）"],
                ["5", "1/175.4", "1/89.1", "104.4%（105.7%）"],
                ["6", "1/161.1", "1/82.1", "109.0%（110.6%）"]
              ]
            }
          },
          {
            title: "機種概要",
            table: {
              headers: ["項目", "内容"],
              rows: [
                ["正式名称", "A-SLOT+ 異世界かるてっと BT"],
                ["メーカー", "GINZA（銀座）"],
                ["導入開始日", "2026年4月6日"],
                ["型式名", "LB 異世界かるてっと KR"],
                ["検定番号", "5S1513"],
                ["タイプ", "スマスロ、ノーマル(A)タイプ、ボーナストリガー"]
              ]
            }
          }
        ]
      },
      {
        id: "2", title: "PV（ティザームービー）", items: [
          { title: "公式PV", youtubeId: "GW94LS37_M8", text: "A-SLOT+ 異世界かるてっと BTのPVを掲載！" }
        ]
      },
      {
        id: "3", title: "ゲームフロー", items: [
          {
            title: "ゲームフロー",
            img: `${ISEKAI_R2}/l_isekai_quartet_flow.webp`,
            text: "ボーナスで出玉獲得を目指すゲーム性で、すべてのボーナス当選から必ずBTに突入する。また、通常時からもいせかる目が出現すればBT発動となるのが本機の特徴となる。"
          }
        ]
      },
      {
        id: "10", title: "基本のゲーム性・通常ステージ", items: [
          { title: "通常時の抽選とゲーム性", text: "ボーナスで出玉獲得を目指すゲーム性で、すべてのボーナス当選から必ずBTに突入。また、通常時から「いせかる目」が出現すればBT（いせかるチャンス）が発動するのが本機の特徴です。", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou01.webp` },
          { title: "いせかる目", text: "通常時にいせかる目が出現すればBT発動！ボーナス期待度は50%over！いせかる目は様々な停止形から出現する可能性があります。", img: `${ISEKAI_R2}/l_isekai_quartet_uchikata03.webp` },
          { title: "通常時のステージ構成", text: "通常時のステージは全5種類。学園祭ステージに移行すればBT突入の期待大！？" },
          { title: "ホームルーム", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou02.webp` },
          { title: "廊下", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou03.webp` },
          { title: "公園", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou04.webp` },
          { title: "身体測定", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou05.webp` },
          { title: "学園祭（チャンス！）", text: "移行時点でBT突入の期待大！", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou06.webp` },
          { title: "その他の特徴", text: "通常時のボーナス当選（直撃）はBB濃厚！？（BT非経由）" }
        ]
      },
      {
        id: "12", title: "ボーナス抽選［いせかる目］", items: [
          { title: "ボーナス当選時の演出例", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou07.webp` },
          { title: "概要", text: "通常時は、成立役に応じてボーナスの抽選を行っている。また、いせかる目が出現すればBT「いせかるチャンス」に突入する。（赤色）" },
          { title: "BT合算確率", text: "約1/99" },
          { title: "通常時の抽選", text: "・小役からのボーナス抽選\n・単独当選もあり\n【通常時のボーナス当選はBB濃厚！？（BT非経由）】\n・いせかる目は様々な契機から当選する可能性あり" },
          { title: "いせかる目の当選契機", text: "小役での同時当選：約90%\n【ベルが50%以上を占める】" },
          { text: "いせかる目出現でBTへ突入！", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou08.webp` }
        ]
      },
      {
        id: "13", title: "同時当選期待度", items: [
          {
            title: "小役成立時の期待度（合算）",
            table: {
              headers: ["小役", "同時当選期待度"],
              rows: [
                ["ベル", "3.3%"],
                ["スイカ", "9.1%"],
                ["チェリー", "39.1%"],
                ["特殊15枚役（中段ベル）", "100%"]
              ]
            }
          },
          {
            title: "契機ごとの当選内容振り分け",
            table: {
              headers: ["小役", "BB当選", "いせかる目"],
              rows: [
                ["ベル", "-", "3.3%"],
                ["スイカ", "0.3%", "8.9%"],
                ["チェリー", "10.4%", "28.7%"],
                ["特殊15枚役", "33.3%", "66.7%"]
              ]
            }
          }
        ]
      },
      {
        id: "14", title: "演出［いせかる目期待］", items: [
          { title: "スポットライト演出", text: "4つ点灯すればいせかる目のチャンス！点灯時の期待度は約35.0%（設定1）。", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou09.webp` },
          { title: "アクアの杖演出", text: "リプレイ以外ならチャンス！", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou10.webp` },
          { title: "ラム登場演出", text: "発生タイミングによって期待度が変化！", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou11.webp` },
          { title: "学園祭ステージ", text: "ロゴ出現や移行時点でいせかる目の期待大！", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou06.webp` }
        ]
      },
      {
        id: "15", title: "演出［ボーナス期待］", items: [
          { title: "リールロック", text: "画面が持ち上がるとボーナスの大チャンス！", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou12.webp` },
          { title: "黒鮪攻略戦", text: "ボーナス期待度：約70%！？", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou14.webp` },
          { title: "デストロイヤーバトル", text: "発生した時点でボーナスの期待大！", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou15.webp` }
        ]
      },
      {
        id: "33", title: "打ち方", items: [
          { title: "通常時の打ち方", text: "◆左リール枠内に“BAR”を目安に狙おう。\n◆リール配列の解説：左/中リールを黒バーを狙うと全小役をフォローできるようになっている。", img: `${ISEKAI_R2}/l_isekai_quartet_uchikata01.webp` },
          { title: "スイカ停止時の打ち分け", text: "◆スイカ停止時は中リール“BAR”を目安にスイカ狙い（右リールは適当打ちでOK）", img: `${ISEKAI_R2}/l_isekai_quartet_uchikata06.webp` },
          { title: "その他の停止形", text: "◆上記停止形以外は残り適当打ちでOK。スイカやチェリーは取りこぼしても枚数的な損失はない。", imgs: [`${ISEKAI_R2}/l_isekai_quartet_uchikata02.webp`, `${ISEKAI_R2}/l_isekai_quartet_uchikata04.webp`] },
          { title: "主なレア役の停止形（一例）", text: "ベル：揃うラインで払い出しが変化（3枚〜15枚）" },
          { text: "ベル（上段：3枚 / 右下がり：4枚）", imgs: [`${ISEKAI_R2}/l_isekai_quartet_uchikata19.webp`, `${ISEKAI_R2}/l_isekai_quartet_uchikata20.webp`] },
          { text: "チェリー（3枚）：左リール角停止＆右リール中段リプレイ", img: `${ISEKAI_R2}/l_isekai_quartet_uchikata05.webp` },
          { text: "スイカ（4枚/BT中3枚）：右下がり or 上段一直線", imgs: [`${ISEKAI_R2}/l_isekai_quartet_uchikata07.webp`, `${ISEKAI_R2}/l_isekai_quartet_uchikata08.webp`] },
          { text: "いせかる目（0枚）：リプ・リプ・ベル。BT開始/終了時に払出あり", img: `${ISEKAI_R2}/l_isekai_quartet_uchikata03.webp` },
          { text: "特殊15枚役：ベルの中段一直線揃い。出現すれば設定5以上に期待！", img: `${ISEKAI_R2}/l_isekai_quartet_uchikata25.webp` }
        ]
      },
      {
        id: "35", title: "ボーナス中の打ち方", items: [
          { title: "【重要】押し順の注意点", text: "枚数調整時は必ず【中 ⇒ 左 ⇒ 右】の順で実行してください。\n他の押し順で行うと、左リールの余裕（5コマ）が無くなり、枠上に赤7を正確にビタ押しする必要が出てしまいます。" },
          { title: "枚数調整成功の合図", text: "ボーナスランプが点滅から点灯に変化すれば成功です。", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou16.webp` },
          { title: "BB消化中の手順", text: "①中リール適当打ち後、左リールに「赤7」狙い（5コマ猶予ありアバウトでOK）\n②左リールに2連赤7が停止すれば成功！14枚役を獲得。\n③成功後は、順押し適当打ちで消化。" },
          { text: "BB中の手順：中リール適当打ち ⇒ 左リール赤7狙い", imgs: [`${ISEKAI_R2}/l_isekai_quartet_uchikata17.webp`, `${ISEKAI_R2}/l_isekai_quartet_uchikata18.webp`] },
          { text: "【成功後】順押し適当打ちで消化", img: `${ISEKAI_R2}/l_isekai_quartet_uchikata21.webp` },
          { title: "RB消化中の手順", text: "①中リール適当打ち後、左リールに「赤7」狙い（手順はBBと同様）\n②成功後は、左リールに赤7を避けて「青7」付近を狙って消化。\n※RB中にスイカ・リプ・スイカ（2連赤7の下）をビタ押しすると14枚役を獲得してロスするため、回避手順を推奨。" },
          { text: "RB中の手順：中リール適当打ち ⇒ 左リール赤7狙い", imgs: [`${ISEKAI_R2}/l_isekai_quartet_uchikata17.webp`, `${ISEKAI_R2}/l_isekai_quartet_uchikata18.webp`] },
          { text: "【成功後】青7付近を狙って順押し（赤7を避けて消化）", img: `${ISEKAI_R2}/l_isekai_quartet_uchikata22.webp` }
        ]
      },
      {
        id: "37", title: "BT中の打ち方", items: [
          { title: "順押しの打ち方", text: "左リールに“BAR”を狙います。", img: `${ISEKAI_R2}/l_isekai_quartet_uchikata01.webp` },
          { title: "BT中の停止形", text: "【順押し時の停止形（一例）】\n・ベル：期待度約13%\n・スイカ：期待度約52%\n・チェリー：期待度約75%", imgs: [`${ISEKAI_R2}/l_isekai_quartet_uchikata23.webp`, `${ISEKAI_R2}/l_isekai_quartet_uchikata07.webp`, `${ISEKAI_R2}/l_isekai_quartet_uchikata05.webp`] },
          { title: "中押しの打ち方", text: "中リールに“BAR”を狙います。", img: `${ISEKAI_R2}/l_isekai_quartet_uchikata09.webp` },
          { text: "【中押し時の停止形（一例）】\n・青7/ベル/BAR：チャンス！\n・斜めベル：期待度約13%\n・中段ベル：ベルが中段に揃えば…！？\n・ベルテンパイハズレ：リーチ目", imgs: [`${ISEKAI_R2}/l_isekai_quartet_uchikata24.webp`, `${ISEKAI_R2}/l_isekai_quartet_uchikata10.webp`, `${ISEKAI_R2}/l_isekai_quartet_uchikata11.webp`, `${ISEKAI_R2}/l_isekai_quartet_uchikata12.webp`] },
          { title: "逆押しの打ち方", text: "右リールに“赤7”を狙います。", img: `${ISEKAI_R2}/l_isekai_quartet_uchikata13.webp` },
          { text: "【逆押し時の停止形（一例）】\n・上段ベル停止：ベル以上濃厚目\n・上段リプレイ停止：リプレイ or…！？\n・ゲチェナ停止：リーチ目", imgs: [`${ISEKAI_R2}/l_isekai_quartet_uchikata14.webp`, `${ISEKAI_R2}/l_isekai_quartet_uchikata15.webp`, `${ISEKAI_R2}/l_isekai_quartet_uchikata16.webp`] }
        ]
      },
      {
        id: "0", title: "設定差/小役確率", items: [
          { title: "通常時の小役確率（設定1）", table: { headers: ["小役", "確率"], rows: [["リプレイ", "1/7.3"], ["ベル", "1/7.0"], ["スイカ", "1/45.0"], ["チェリー", "1/179.1"], ["特殊15枚役（中段ベル）", "1/21845.3"], ["いせかる目", "1/107.6"], ["レア役合算（いせかる目含む）", "1/26.9"]] } },
          { title: "設定差のある小役出現率", text: "チェリー、いせかる目、特殊15枚役の出現率に設定差が存在。高設定ほどこれらの役が出現しやすくなっています。", table: { headers: ["設定", "チェリー", "いせかる目", "特殊15枚役"], rows: [["1", "1/179.1", "1/107.6", "1/21845.3"], ["2", "1/179.1", "1/106.2", "1/21845.3"], ["5", "1/176.6", "1/97.1", "1/13107.2"], ["6", "1/174.3（赤色）", "1/89.2（赤色）", "1/8192.0（赤色）"]] } },
          { title: "BT中の小役確率（全設定共通）", text: "※ボーナス成立前の値。内部成立後は確率が変動します。", table: { headers: ["小役", "確率"], rows: [["リプレイ", "1/7.4"], ["ベル", "1/3.4"], ["スイカ", "1/20.9"], ["チェリー", "1/65.5"], ["リーチ目役", "1/150.3"], ["チャンス役合算", "1/2.8"]] } }
        ]
      },
      {
        id: "4", title: "通常時のベース", items: [
          { title: "50枚あたりの消化ゲーム数", text: "A-SLOT+ 異世界かるてっと BTの50枚あたりの消化ゲーム数は、全設定共通で約33.6ゲームとなっています。", table: { headers: ["設定", "消化ゲーム数"], rows: [["設定1", "約33.6ゲーム"]] } }
        ]
      },
      {
        id: "61", title: "びっぐぼーなす［BB］", items: [
          { title: "概要", text: "最大179枚または155枚。全8曲の楽曲選択が可能。", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou13.webp` },
          { title: "楽曲一覧", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou17.webp` }
        ]
      },
      {
        id: "63", title: "いせかるぼーなす［RB］", items: [
          { title: "概要", text: "最大95枚. 終了後は「えくすとらチャンス」へ。", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou18.webp` }
        ]
      },
      {
        id: "65", title: "いせかるチャンス［BT①］", items: [
          { title: "期待度", text: "ボーナス期待度50%over! ベル/スイカ/チェリーがチャンス役。", table: { headers: ["小役", "期待度"], rows: [["ベル", "約13%"], ["スイカ", "約52%"], ["チェリー", "約75%"]] } }
        ]
      },
      {
        id: "83", title: "BT中の演出タイプ", items: [
          { title: "演出タイプ詳細", text: "体育祭、ツイン、愛、パトゆんゆん、盾、クラシックの6種類。", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou21.webp` }
        ]
      },
      {
        id: "67", title: "うわのせチャンス［BT②］", items: [
          { title: "概要", text: "BB後に突入。ループ期待度50%over。", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou35.webp` }
        ]
      },
      {
        id: "69", title: "えくすとらチャンス［BT③］", items: [
          { title: "概要", text: "RB後に突入。", img: `${ISEKAI_R2}/l_isekai_quartet_ekishou38.webp` }
        ]
      },
      {
        id: "20", title: "天井", items: [
          { text: "A-SLOT+ 異世界かるてっと BTは、天井非搭載。" }
        ]
      },
      {
        id: "21", title: "やめどき", items: [
          { title: "最適なやめどき", text: "ボーナス及びBT非当選状態であればいつでもヤメて問題なし。" }
        ]
      }
    ]
  },
  "l-sengoku-otome5": {
    name: "L戦国乙女5 業火を穿つ宿焔の双刃",
    maker: "OLYMPIA（オリンピア）",
    releaseDate: "2026年6月8日",
    modelName: "L戦国乙女5L8",
    category: 'slot',
    type: ["スマスロ", "ATタイプ", "天井"],
    images: {
      main: "https://images.1geki.jp/wp-content/uploads/2026/04/img_l_otome5.png",
      reel: "https://images.1geki.jp/machines/slot/l_otome5/l_otome5_reel.png?f=webp",
      paytable: "https://images.1geki.jp/wp-content/uploads/2026/04/l_otome5_haitou00.png"
    },
    payoutData: [
      { label: "1", val1: "-", val2: "1/359.5", rate: "97.9%" },
      { label: "2", val1: "-", val2: "1/350.8", rate: "98.9%" },
      { label: "3", val1: "-", val2: "1/332.5", rate: "101.0%" },
      { label: "4", val1: "-", val2: "1/302.8", rate: "106.2%" },
      { label: "5", val1: "-", val2: "1/281.0", rate: "111.1%" },
      { label: "6", val1: "-", val2: "1/262.9", rate: "114.9%" }
    ],
    features: [
      "新筐体「DIVE IN」を搭載した戦国乙女4の正統後継機",
      "通常時は直AT方式へ仕様変更。新規自力CZ「本能寺の変」を追加",
      "上位AT「真強カワラッシュ」のループ性能に期待。「剣聖チャンス」成功でループ濃厚",
      "新乙女キャラ「ユウサイ」「マサムネ」「石川ゴエモン」が参戦",
      "全61曲の楽曲を搭載。カスタム機能で演出を自由にカスタマイズ可能"
    ],
    updateHistory: [
      { date: "2026-06-08", text: "機種概要・スペック・注目ポイントを公開しました。" }
    ],
    sections: [
      {
        id: "1", title: "機種概要・スペック", items: [
          { title: "基本スペック（設定別）", table: { headers: ["設定", "AT初当り", "出玉率"], rows: [["1", "1/359.5", "97.9%"], ["2", "1/350.8", "98.9%"], ["3", "1/332.5", "101.0%"], ["4", "1/302.8", "106.2%"], ["5", "1/281.0", "111.1%"], ["6", "1/262.9", "114.9%"]] } },
          { title: "ゲーム性", text: "戦国乙女シリーズ第5弾。新筐体「DIVE IN」を搭載し、通常時は直AT方式へ仕様変更。自力CZ「本能寺の変」やループ型上位AT「真強カワラッシュ」が出玉の核となる。" }
        ]
      }
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
    console.error(`❌ エラー: ${slug} のデータが見つかりません.`);
    return;
  }

  try {
    console.log(`🚀 ${data.name} (${slug}) のインポートを開始します...`);

    let { sections, ...mainInfo } = data;

    if (sections && Array.isArray(sections)) {
      sections = sections.map((s: any) => {
        if (s.items) {
          return {
            ...s,
            items: s.items.map((item: any) => {
              if (item.table && Array.isArray(item.table.rows)) {
                return {
                  ...item,
                  table: {
                    ...item.table,
                    rows: JSON.stringify(item.table.rows)
                  }
                };
              }
              return item;
            })
          };
        }
        return s;
      });
    }

    const machineMainData = {
      slug,
      ...mainInfo,
      updatedAt: Timestamp.now()
    };

    const machineRef = db.collection('machines').doc(slug);
    await machineRef.set(machineMainData, { merge: true });

    if (sections && Array.isArray(sections)) {
      const sectionsCol = machineRef.collection('sections');
      const snapshot = await sectionsCol.get();
      if (!snapshot.empty) {
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
      }

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

const targetSlug = process.argv[2];

async function main() {
  if (targetSlug === 'all') {
    for (const slug in MACHINES_DATA) {
      await importMachine(slug);
    }
  } else if (targetSlug) {
    await importMachine(targetSlug);
  } else {
    console.log("使い方: npx tsx scripts/import-machine.ts [slug]");
  }
}

main();
