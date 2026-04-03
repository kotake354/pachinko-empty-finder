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
const YOSHIMUNE_R2 = `${R2_BASE}/sinnutiyoshimune`;
const KYOKOU_R2 = `${R2_BASE}/koukyousuiri`;

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
      main: `${YOSHIMUNE_R2}/img_l_shinuchi_yoshimune.png`,
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
    ]
  },
  // --- L 虚構推理 ---
  "l-kyokou-suiri": {
    name: "L 虚構推理",
    maker: "Idol（アイドル）",
    releaseDate: "2026年4月6日",
    modelName: "L虚構推理ST",
    category: 'slot',
    type: ["ATタイプ", "スマスロ", "天井"],
    pvUrl: "https://www.youtube.com/embed/jti-gyCWOPE",
    images: {
      main: `${KYOKOU_R2}/img_l_kyokousuiri.png`,
      reel: `${KYOKOU_R2}/l_kyokousuiri_reel.webp`,
      paytable: `${KYOKOU_R2}/l_kyokousuiri_haitou00.png`,
    },
    specDataInfo: {
      base: "約32.5G",
      netIncrease: "約2.5枚 〜 約5.0枚"
    },
    payoutData: [
      { label: "1", rate: "97.7%", val1: "1/124.5", val2: "1/349.0" },
      { label: "2", rate: "98.7%", val1: "1/121.9", val2: "1/341.3" },
      { label: "3", rate: "100.8%", val1: "1/118.6", val2: "1/329.3" },
      { label: "4", rate: "105.5%", val1: "1/112.5", val2: "1/300.2" },
      { label: "5", rate: "109.1%", val1: "1/107.1", val2: "1/279.7" },
      { label: "6", rate: "112.0%", val1: "1/103.5", val2: "1/264.8" }
    ],
    updateHistory: [
      { date: "2026-03-27", text: "機種概要・全解析メニューを公開" }
    ],
    sections: [
      { id: "basic-spec", title: "機種概要・スペック", items: [
        {
          title: "スペックと特徴",
          table: {
            headers: ["設定", "CZ確率", "ボーナス初当たり", "出玉率"],
            rows: [
              ["1", "1/124.5", "1/349.0", "97.7%"],
              ["2", "1/121.9", "1/341.3", "98.7%"],
              ["3", "1/118.6", "1/329.3", "100.8%"],
              ["4", "1/112.5", "1/300.2", "105.5%"],
              ["5", "1/107.1", "1/279.7", "109.1%"],
              ["6", "1/103.5", "1/264.8", "112.0%"]
            ]
          }
        },
        {
          title: "特徴（導入日、型式名、検定番号、導入台数）",
          table: {
            headers: ["項目", "内容"],
            rows: [
              ["正式名称", "L虚構推理"],
              ["メーカー", "Idol（アイドル）"],
              ["導入開始日", "2026年4月6日"],
              ["型式名", "L虚構推理ST"],
              ["検定番号", "5S1217"],
              ["タイプ", "ATタイプ、スマスロ、天井"]
            ]
          }
        },
        {
          title: "機種概要",
          text: "ミステリ小説･コミック･アニメと様々なメディアで展開されている業界初コンテンツ。\nボーナスの連鎖がボーナスを呼ぶ”虚構LOOP”が出玉のカギを握る。\n出玉トリガーを多数搭載！ 特に「輪廻転生」は本機最強の出玉トリガーで、発動すれば期待枚数3500枚OVER!?となる。\n※数値等自社調査"
        }
      ]},
      { id: "game-flow", title: "ゲームフロー", items: [
        {
          title: "ゲームフロー全体像",
          text: "通常時はレア役や周期抽選で当選するCZ「鋼人七瀬攻略議会」から初当たりボーナスを目指すのがメインルート。\nボーナス終了後は必ずボーナス高確率状態の「虚構連モード」へ移行。転落する前にボーナス昇格CZ「虚構真偽」当選を目指そう。\nボーナスと虚構連モードのループで出玉を増やしていきつつ、狂構神偽や輪廻転生に突入することでも大きな出玉に期待が持てるゲーム性だ。"
        }
      ]},
      { id: "stages-basic", title: "基本のゲーム性/通常時のステージ", items: [
        {
          title: "基本のゲーム性",
          text: "L虚構推理は、主にレア役や周期抽選で当選するCZから初当たりボーナスを目指すゲーム性。一部でボーナス直撃あり!?\n▲通常時の液晶画面",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou08.webp`
        },
        {
          title: "通常時のステージ：病院",
          text: "病院",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou10.webp`
        },
        {
          title: "通常時のステージ：紗季の部屋",
          text: "紗季の部屋",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou11.webp`
        },
        {
          title: "通常時のステージ：真倉坂市・夕［高確示唆］",
          text: "真倉坂市（夕）",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou12.webp`
        },
        {
          title: "通常時のステージ：真倉坂市・夜［前兆示唆］",
          text: "真倉坂市（夜）",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou13.webp`
        },
        {
          title: "通常時のステージ：アイドルステージ［CZ本前兆!?］",
          text: "アイドルステージ。CZ当選に期待！",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou14.webp`
        }
      ]},
      { id: "cz-lottery", title: "通常時の抽選［CZ抽選/内部状態］", items: [
        {
          title: "内部状態とCZ当選期待度",
          text: "L虚構推理の通常時は、CZ当選率に影響する内部状態【低確・高確】が存在する。\n主に弱チェリーやスイカで移行抽選が行われ、内部状態と成立役に応じてCZ当選期待度が変化する。"
        },
        {
          title: "規定ゲーム数・引き戻し抽選",
          text: "また、100G経過ごとの規定ゲーム数による移行抽選や、CZ失敗後の引き戻し抽選でもCZに突入する可能性がある。"
        },
        {
          title: "CZ当選時の演出",
          text: "▲CZ当選時の演出",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou15.webp`
        }
      ]},
      { id: "ceiling-reset", title: "天井/朝一（リセット）/やめどき", items: [
        {
          title: "天井条件と恩恵",
          table: {
            headers: ["項目", "天井ゲーム数", "恩恵"],
            rows: [
              ["CZ間天井", "550G + α", "CZ当選"],
              ["ボーナス間天井", "999G + α", "ボーナス当選"],
              ["AT間天井", "2500G + α", "輪廻転生当選!?"]
            ]
          }
        },
        {
          title: "やめどき",
          text: "ボーナス終了後、虚構連モードからの転落を確認してヤメ。または1周期（岩永ポイント）を確認してヤメを推奨。"
        }
      ]},
      { id: "how-to-play", title: "打ち方/通常時のベース", items: [
        { title: "リール配列", img: `${KYOKOU_R2}/l_kyokousuiri_reel.webp` },
        { 
          title: "通常時の打ち方", 
          text: "本機は左1st（左押し）で消化することを推奨している。\n通常時に中押しや逆押しで消化した場合は、ペナルティが発生する。",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou01.webp`
        },
        { 
          title: "ペナルティ発生時の画面", 
          text: "◆左リールに“BAR(赤7でもOK)”を狙い、レア役をフォローしよう",
          img: `${KYOKOU_R2}/l_kyokousuiri_uchikata01.webp`
        },
        { 
          title: "打ち方(2)：スイカ停止時", 
          text: "◆スイカ停止時は以下の手順を実行しよう\n▲中リール“BAR（または赤7）”を目安にスイカ狙い(右リールは適当打ちでOK)\n※スイカはこぼしても枚数的な損失はない",
          img: `${KYOKOU_R2}/l_kyokousuiri_uchikata08.webp`
        },
        { 
          title: "打ち方(3)(4)：その他の停止形", 
          text: "◆上記停止形以外は残り適当打ちでOK\n▲上記は適当打ちでOK",
          img: `${KYOKOU_R2}/l_kyokousuiri_uchikata02.webp`
        },
        { 
          img: `${KYOKOU_R2}/l_kyokousuiri_uchikata05.webp` 
        },
        { title: "主なレア役の停止形" },
        { 
          title: "🍒弱チェリー（リプレイ）", 
          text: "左リールにチェリー図柄が停止し、右リール下段にスイカ図柄が停止する。",
          img: `${KYOKOU_R2}/l_kyokousuiri_uchikata06.webp`
        },
        { 
          title: "🍒強チェリー（1枚）", 
          text: "左リールにチェリー図柄が停止し、右リール中段にスイカ図柄が停止する。",
          img: `${KYOKOU_R2}/l_kyokousuiri_uchikata07.webp`
        },
        { 
          title: "🍉スイカ（3枚）", 
          text: "スイカ図柄が右上がり一直線または下段一直線に停止する。",
          img: `${KYOKOU_R2}/l_kyokousuiri_uchikata09.webp`
        },
        { 
          title: "✨チャンス目（1枚）", 
          text: "チャンス目（1枚）は、スイカテンパイハズレや小役ダブルテンパイハズレで停止する。",
          img: `${KYOKOU_R2}/l_kyokousuiri_uchikata03.webp`
        },
        { 
          img: `${KYOKOU_R2}/l_kyokousuiri_uchikata04.webp` 
        },
        { 
          img: `${KYOKOU_R2}/l_kyokousuiri_uchikata10.webp` 
        },
        { text: "通常時のベース：約32.5G/50枚" }
      ]},
      { id: "setting-hints", title: "設定判別/設定示唆", items: [
        {
          title: "初当たり確率による判別",
          text: "CZ確率・ボーナス初当たり確率ともに大きな設定差が存在する。\n設定6ならCZ確率は1/103.5と、設定1に比べて20%以上軽くなっているため、序盤のCZ当選率は要チェックだ。"
        },
        {
          title: "ボーナス終了画面",
          text: "ボーナス終了画面での出現キャラに秘密あり！？（現在調査中）",
        }
      ]},
      { id: "cz-nanase", title: "鋼人七瀬攻略議会［CZ］", items: [
        {
          title: "CZ性能・基本ゲーム性",
          text: "鋼人七瀬攻略議会は、セット突破型の自力チャンスゾーン。 エピソード1～5まで存在し、5つのエピソードをすべて突破すればボーナス当選となる。（赤7BB or 白7BB）\n1セット：6G継続（初回セットのみ：7G）で、消化中は成立役に応じてエピソードの突破抽選を行っている。1セットあたりの突破期待度は約75%となっている。",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou16.webp`
        }
      ]},
      { id: "ayakashi-bonus", title: "あやかしぼーなす［RB］", items: [
        {
          title: "ボーナス性能・基本挙動",
          text: "あやかしぼーなすは、差枚数管理タイプのレギュラーボーナス。獲得枚数は約50枚。\n消化中は、成立役に応じて雪女ストックの抽選を行っている。",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou27.webp`
        },
        {
          title: "雪女ストックの恩恵",
          text: "雪女をストックすれば、ボーナス後の「虚構真偽」を獲得！\nまた、ストック時の一部で最強出玉トリガー「輪廻転生」に突入することもあるため、レギュラーといえど油断は禁物だ。"
        },
        {
          title: "設定示唆（キャラ紹介）",
          text: "ボーナス消化中に発生するキャラ紹介には、設定示唆パターンが隠されている！？背景の色や登場キャラに注目しよう。"
        }
      ]},
      { id: "red7-bb", title: "虚構推理ボーナス［赤7BB］", items: [
        {
          title: "ボーナス性能",
          text: "虚構推理ボーナスは、差枚数管理タイプの赤7揃いビッグボーナス。獲得枚数は約100枚。\n消化中は、成立役に応じて雪女ストックの抽選を行っており、雪女をストックすれば「虚構真偽」を獲得する。",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou29.webp`
        },
        {
          title: "入賞図柄",
          text: "▲虚構推理ボーナスの入賞図柄",
          img: `${KYOKOU_R2}/l_kyokousuiri_haitou03.webp`
        }
      ]},
      { id: "blue7-bb", title: "虚構推理ボーナス～SUPER～［青7BB］", items: [
        {
          title: "ボーナス性能",
          text: "虚構推理ボーナス～SUPER～は、JACゲーム+ゲーム数上乗せタイプの青7揃いビッグボーナス。\n小役ゲームと虚構JACの2部構成で、この2つを行き来しながら出玉を増やしていく。\n小役ゲーム中はハズレ・押し順ベル以外が成立（リプレイ/共通ベル/レア役）すれば虚構JAC突入濃厚!?となり、レア役経由時は虚構JACの規定ベル回数が優遇される。\n一方、虚構JAC中は成立役に応じて小役ゲームの上乗せ抽選を行っている。",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou31.webp`
        },
        {
          title: "入賞図柄",
          text: "▲虚構推理ボーナス～SUPER～の入賞図柄",
          img: `${KYOKOU_R2}/l_kyokousuiri_haitou02.webp`
        }
      ]},
      { id: "white7-bb", title: "スペシャルボーナス［白7BB］", items: [
        {
          title: "ボーナス性能",
          text: "スペシャルボーナスは、JACゲーム+ゲーム数上乗せタイプの白7揃いビッグボーナスで、突入画面のキャラに応じて恩恵あり。\n小役ゲームと虚構JACの2部構成で、この2つを行き来しながら出玉を増やしていく。\n小役ゲーム中はハズレ・押し順ベル以外が成立（リプレイ/共通ベル/レア役）すれば虚構JAC突入濃厚!?となり、レア役経由時は虚構JACの規定ベル回数が優遇される。\n一方、虚構JAC中は成立役に応じて小役ゲームの上乗せ抽選を行っている。",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou32.webp`
        },
        {
          title: "入賞図柄",
          text: "▲スペシャルボーナスの入賞図柄",
          img: `${KYOKOU_R2}/l_kyokousuiri_haitou01.webp`
        }
      ]},
      { id: "at-loop", title: "虚構連モード［ボーナス高確率］", items: [
        {
          title: "虚構連モードの性能",
          text: "虚構連モードは、毎ゲーム全役抽選のボーナス高確率状態で、ボーナス終了後に必ず移行する。\n内部状態（ショート/ミドル/ロング）を推測しつつ、転落前にボーナス昇格CZの「虚構真偽」当選を目指そう。",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou20.webp`
        }
      ]},
      { id: "kyokou-shingi", title: "虚構真偽［ボーナス昇格CZ］", items: [
        {
          title: "CZ性能",
          text: "虚構真偽は、10G+α継続するボーナス昇格タイプのチャンスゾーン。成功期待度は約70%。10G以内に「未来決定」へ突入できれば虚構推理ボーナス［赤7BB］以上となる。\n消化中は、成立役に応じて「未来決定」の突入抽選（成功抽選）を行っており、昇格失敗時はあやかしぼーなす［RB］に突入する。",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou21.webp`
        }
      ]},
      { id: "mirai-kettei", title: "未来決定［ボーナス決定ゾーン］", items: [
        {
          title: "ゾーン性能",
          text: "未来決定は、ボーナスの当選種別を決める自力タイプのボーナス決定ゾーン。突入時点で虚構推理ボーナス［赤7BB］以上濃厚!?\nステージが2パターン【デフォルト/チャンス】あり、赤7テンパイハズレのフラグが成立すればチャンスステージへ移行する。\nチャンスステージ移行で青7BB以上濃厚!?となる。",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou42.webp`
        }
      ]},
      { id: "kyoukou-shingi", title: "狂構神偽［上位昇格CZ］", items: [
        {
          title: "上位CZ性能",
          text: "狂構神偽は、4G継続する虚構連ロング突入（スペシャルボーナス六花当選）をかけたチャンスゾーン。成功期待度は約50%。\n【読み方は虚構真偽と同じ（きょこうしんぎ）】\n消化中は、成立役に応じて成功抽選を行っており、レア役成立時や最終ゲームに小役が成立すれば成功濃厚!?",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou49.webp`
        }
      ]},
      { id: "rinne-tensei", title: "輪廻転生［最強出玉トリガー］", items: [
        {
          title: "発動時の恩恵",
          text: "輪廻転生は、虚構真偽失敗までループし続ける本機最強の出玉トリガー。発動時の期待枚数は3500枚over!?\n\n【発動時の恩恵】\n・虚構連モード中は”虚構真偽”濃厚!?\n└レア役経由で当選した場合は未来決定直行!?\n・“虚構真偽”移行時は約70%で”未来決定”へ\n・“未来決定”突入時は青7BB以上濃厚!?\n・“狂構神偽”突入時は成功濃厚!?",
          img: `${KYOKOU_R2}/l_kyokousuiri_ekishou03.webp`
        }
      ]},
      { id: "freeze", title: "ロングフリーズ", items: [
        {
          title: "ロングフリーズについて",
          text: "L虚構推理のロングフリーズは、2種類搭載されており、フリーズの種類に応じて恩恵が異なる。"
        },
        {
          title: "フリーズの種類と恩恵",
          table: {
            headers: ["フリーズ種別", "恩恵"],
            rows: [
              ["レバーフリーズ\n(レバーON判定)", "・スペシャルボーナス「六花」(白7)\n・雪女ストック4個以上\n・輪廻転生発動！\n・虚構連モード「ロング」移行"],
              ["第3停止フリーズ", "・エピソードボーナス(黒BAR)\n・虚構連モード移行\n・期待枚数：約2,500枚"]
            ]
          }
        },
        {
          title: "中段チェリーについて",
          text: "本機に中段チェリーは非搭載となっている。"
        }
      ]}
    ]
  },
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
    let { sections, ...mainInfo } = data;
    
    // 🔥 Firestore 用に items 内の table.rows を JSON 文字列に変換 (入れ子配列対策)
    if (sections && Array.isArray(sections)) {
      sections = sections.map((s: any) => {
        // セクション自体の画像URLクリーンアップ
        if (s.img) s.img = s.img.trim().replace(/\s+/g, '_');
        
        if (s.items) {
          return {
            ...s,
            items: s.items.map((item: any) => {
              // アイテムの画像URLクリーンアップ
              if (item.img) item.img = item.img.trim().replace(/\s+/g, '_');
              
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

    // 🔥 メイン画像のURLクリーンアップ
    if (mainInfo.images) {
      Object.keys(mainInfo.images).forEach(key => {
        if (typeof mainInfo.images[key] === 'string') {
          mainInfo.images[key] = mainInfo.images[key].trim().replace(/\s+/g, '_');
        }
      });
    }


    const machineMainData = {
      slug,
      ...mainInfo,
      updatedAt: Timestamp.now()
    };

    console.log("📡 Firestoreに送信する本体データ:", JSON.stringify(machineMainData.images, null, 2));


    // 1. 本体データの保存
    const machineRef = db.collection('machines').doc(slug);
    await machineRef.set(machineMainData, { merge: true });

    // 2. sections サブコレクションの保存
    if (sections && Array.isArray(sections)) {
      console.log(`📦 ${sections.length} 個のセクションを更新します...`);
      const sectionsCol = machineRef.collection('sections');
      
      // 🔥 古いセクションを一度削除（ID変更等によるゴミを除去）
      const snapshot = await sectionsCol.get();
      if (!snapshot.empty) {
        console.log(`🧹 古いセクション (${snapshot.size}件) を削除中...`);
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

// コマンドライン引数からスラグを取得
const targetSlug = process.argv[2];

async function main() {
  if (targetSlug === 'all') {
    console.log("🌀 全機種のインポートを実行します...");
    for (const slug in MACHINES_DATA) {
      if (slug === 'debug_test') continue;
      await importMachine(slug);
    }
  } else if (targetSlug && targetSlug !== 'debug_test') {
    await importMachine(targetSlug);
  } else if (targetSlug === 'debug_test') {
    console.log("🛑 debug_test のインポートはスキップされます。");
  } else {
    console.log("💡 使い方:");
    console.log("  npx tsx scripts/import-machine.ts [slug]      (特定の機種のみ)");
    console.log("  npx tsx scripts/import-machine.ts all         (全機種一括)");
    console.log("\n現在登録されているスラグ:");
    Object.keys(MACHINES_DATA).forEach(s => console.log(`  - ${s}`));
  }
}

main();
