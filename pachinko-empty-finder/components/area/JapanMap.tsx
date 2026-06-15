import Link from "next/link";

// 都道府県タイル。col=列(西→東), row=行(北→南) でおおよそ日本の形に配置する。
type Pref = {
  slug: string;
  name: string; // 表示名（短縮）
  region: string;
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
};

const PREFECTURES: Pref[] = [
  // 北海道
  { slug: "hokkaido", name: "北海道", region: "hokkaido", col: 9, row: 1, colSpan: 3, rowSpan: 2 },
  // 東北
  { slug: "aomori", name: "青森", region: "tohoku", col: 9, row: 3, colSpan: 2 },
  { slug: "akita", name: "秋田", region: "tohoku", col: 9, row: 4 },
  { slug: "iwate", name: "岩手", region: "tohoku", col: 10, row: 4 },
  { slug: "yamagata", name: "山形", region: "tohoku", col: 9, row: 5 },
  { slug: "miyagi", name: "宮城", region: "tohoku", col: 10, row: 5 },
  { slug: "niigata", name: "新潟", region: "chubu", col: 9, row: 6 },
  { slug: "fukushima", name: "福島", region: "tohoku", col: 10, row: 6 },
  // 北陸・中部（石川 富山 新潟 福島 の行 → 福井 岐阜 長野 群馬 栃木 茨城 の行）
  { slug: "ishikawa", name: "石川", region: "chubu", col: 7, row: 6 },
  { slug: "toyama", name: "富山", region: "chubu", col: 8, row: 6 },
  { slug: "fukui", name: "福井", region: "chubu", col: 6, row: 7 },
  { slug: "gifu", name: "岐阜", region: "chubu", col: 7, row: 7 },
  { slug: "nagano", name: "長野", region: "chubu", col: 8, row: 7 },
  // 関東
  { slug: "gunma", name: "群馬", region: "kanto", col: 9, row: 7 },
  { slug: "tochigi", name: "栃木", region: "kanto", col: 10, row: 7 },
  { slug: "ibaraki", name: "茨城", region: "kanto", col: 10, row: 8 },
  { slug: "saitama", name: "埼玉", region: "kanto", col: 9, row: 8 },
  { slug: "tokyo", name: "東京", region: "kanto", col: 9, row: 9 },
  { slug: "chiba", name: "千葉", region: "kanto", col: 10, row: 9 },
  { slug: "kanagawa", name: "神奈川", region: "kanto", col: 9, row: 10 },
  { slug: "yamanashi", name: "山梨", region: "chubu", col: 8, row: 8 },
  { slug: "aichi", name: "愛知", region: "chubu", col: 8, row: 9 },
  { slug: "shizuoka", name: "静岡", region: "chubu", col: 8, row: 10 },
  // 近畿
  { slug: "hyogo", name: "兵庫", region: "kinki", col: 5, row: 8 },
  { slug: "kyoto", name: "京都", region: "kinki", col: 6, row: 8 },
  { slug: "shiga", name: "滋賀", region: "kinki", col: 7, row: 8 },
  { slug: "osaka", name: "大阪", region: "kinki", col: 6, row: 9 },
  { slug: "nara", name: "奈良", region: "kinki", col: 7, row: 9 },
  { slug: "wakayama", name: "和歌山", region: "kinki", col: 6, row: 10 },
  { slug: "mie", name: "三重", region: "kinki", col: 7, row: 10 },
  // 中国
  { slug: "shimane", name: "島根", region: "chugoku", col: 3, row: 8 },
  { slug: "tottori", name: "鳥取", region: "chugoku", col: 4, row: 8 },
  { slug: "yamaguchi", name: "山口", region: "chugoku", col: 3, row: 9 },
  { slug: "hiroshima", name: "広島", region: "chugoku", col: 4, row: 9 },
  { slug: "okayama", name: "岡山", region: "chugoku", col: 5, row: 9 },
  // 四国
  { slug: "ehime", name: "愛媛", region: "shikoku", col: 5, row: 10 },
  { slug: "kochi", name: "高知", region: "shikoku", col: 5, row: 11 },
  { slug: "kagawa", name: "香川", region: "shikoku", col: 6, row: 11 },
  { slug: "tokushima", name: "徳島", region: "shikoku", col: 6, row: 12 },
  // 九州・沖縄
  { slug: "fukuoka", name: "福岡", region: "kyushu", col: 3, row: 10 },
  { slug: "oita", name: "大分", region: "kyushu", col: 4, row: 10 },
  { slug: "saga", name: "佐賀", region: "kyushu", col: 2, row: 11 },
  { slug: "kumamoto", name: "熊本", region: "kyushu", col: 3, row: 11 },
  { slug: "nagasaki", name: "長崎", region: "kyushu", col: 2, row: 12 },
  { slug: "miyazaki", name: "宮崎", region: "kyushu", col: 4, row: 11 },
  { slug: "kagoshima", name: "鹿児島", region: "kyushu", col: 3, row: 12 },
  { slug: "okinawa", name: "沖縄", region: "kyushu", col: 1, row: 13 },
];

// 地域ごとのパステルカラー（リファレンス風）
const REGION_COLOR: Record<string, string> = {
  hokkaido: "#f7b2a0",
  tohoku: "#f4a9c8",
  kanto: "#a8d5a2",
  chubu: "#f6c177",
  kinki: "#a9c7ea",
  chugoku: "#f4a9c8",
  shikoku: "#a8d5a2",
  kyushu: "#f7b2a0",
};

export default function JapanMap() {
  return (
    <div
      className="grid w-full max-w-[480px]"
      style={{
        // 11列×13行の比率を固定 → 画面幅に合わせて全体が等比スケール（スマホでも崩れない）
        aspectRatio: "11 / 13",
        gridTemplateColumns: "repeat(11, 1fr)",
        gridTemplateRows: "repeat(13, 1fr)",
        gap: "2px",
      }}
    >
      {PREFECTURES.map((p) => (
        <Link
          key={p.slug}
          href={`/area/${p.slug}`}
          className="flex items-center justify-center overflow-hidden rounded text-center font-bold leading-none text-gray-700 transition-all hover:brightness-95 hover:ring-2 hover:ring-red-400"
          style={{
            gridColumn: `${p.col} / span ${p.colSpan ?? 1}`,
            gridRow: `${p.row} / span ${p.rowSpan ?? 1}`,
            backgroundColor: REGION_COLOR[p.region],
            fontSize: "clamp(7px, 2vw, 11px)",
          }}
        >
          {p.name}
        </Link>
      ))}
    </div>
  );
}
