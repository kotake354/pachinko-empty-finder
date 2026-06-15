// 都道府県の slug ↔ 名称マッピング。
// slug は URL（/area/[prefecture]）、fullName は halls.prefecture と一致させる。

export interface PrefectureInfo {
  slug: string;
  name: string; // 短縮表示名（例: 東京）
  fullName: string; // 正式名（例: 東京都）halls.prefecture と一致
}

export const PREFECTURES_INFO: Record<string, PrefectureInfo> = {
  hokkaido: { slug: "hokkaido", name: "北海道", fullName: "北海道" },
  aomori: { slug: "aomori", name: "青森", fullName: "青森県" },
  akita: { slug: "akita", name: "秋田", fullName: "秋田県" },
  iwate: { slug: "iwate", name: "岩手", fullName: "岩手県" },
  yamagata: { slug: "yamagata", name: "山形", fullName: "山形県" },
  miyagi: { slug: "miyagi", name: "宮城", fullName: "宮城県" },
  fukushima: { slug: "fukushima", name: "福島", fullName: "福島県" },
  niigata: { slug: "niigata", name: "新潟", fullName: "新潟県" },
  ishikawa: { slug: "ishikawa", name: "石川", fullName: "石川県" },
  toyama: { slug: "toyama", name: "富山", fullName: "富山県" },
  fukui: { slug: "fukui", name: "福井", fullName: "福井県" },
  gifu: { slug: "gifu", name: "岐阜", fullName: "岐阜県" },
  nagano: { slug: "nagano", name: "長野", fullName: "長野県" },
  gunma: { slug: "gunma", name: "群馬", fullName: "群馬県" },
  tochigi: { slug: "tochigi", name: "栃木", fullName: "栃木県" },
  ibaraki: { slug: "ibaraki", name: "茨城", fullName: "茨城県" },
  saitama: { slug: "saitama", name: "埼玉", fullName: "埼玉県" },
  tokyo: { slug: "tokyo", name: "東京", fullName: "東京都" },
  chiba: { slug: "chiba", name: "千葉", fullName: "千葉県" },
  kanagawa: { slug: "kanagawa", name: "神奈川", fullName: "神奈川県" },
  yamanashi: { slug: "yamanashi", name: "山梨", fullName: "山梨県" },
  aichi: { slug: "aichi", name: "愛知", fullName: "愛知県" },
  shizuoka: { slug: "shizuoka", name: "静岡", fullName: "静岡県" },
  hyogo: { slug: "hyogo", name: "兵庫", fullName: "兵庫県" },
  kyoto: { slug: "kyoto", name: "京都", fullName: "京都府" },
  shiga: { slug: "shiga", name: "滋賀", fullName: "滋賀県" },
  osaka: { slug: "osaka", name: "大阪", fullName: "大阪府" },
  nara: { slug: "nara", name: "奈良", fullName: "奈良県" },
  wakayama: { slug: "wakayama", name: "和歌山", fullName: "和歌山県" },
  mie: { slug: "mie", name: "三重", fullName: "三重県" },
  shimane: { slug: "shimane", name: "島根", fullName: "島根県" },
  tottori: { slug: "tottori", name: "鳥取", fullName: "鳥取県" },
  yamaguchi: { slug: "yamaguchi", name: "山口", fullName: "山口県" },
  hiroshima: { slug: "hiroshima", name: "広島", fullName: "広島県" },
  okayama: { slug: "okayama", name: "岡山", fullName: "岡山県" },
  ehime: { slug: "ehime", name: "愛媛", fullName: "愛媛県" },
  kagawa: { slug: "kagawa", name: "香川", fullName: "香川県" },
  kochi: { slug: "kochi", name: "高知", fullName: "高知県" },
  tokushima: { slug: "tokushima", name: "徳島", fullName: "徳島県" },
  fukuoka: { slug: "fukuoka", name: "福岡", fullName: "福岡県" },
  oita: { slug: "oita", name: "大分", fullName: "大分県" },
  saga: { slug: "saga", name: "佐賀", fullName: "佐賀県" },
  kumamoto: { slug: "kumamoto", name: "熊本", fullName: "熊本県" },
  nagasaki: { slug: "nagasaki", name: "長崎", fullName: "長崎県" },
  miyazaki: { slug: "miyazaki", name: "宮崎", fullName: "宮崎県" },
  kagoshima: { slug: "kagoshima", name: "鹿児島", fullName: "鹿児島県" },
  okinawa: { slug: "okinawa", name: "沖縄", fullName: "沖縄県" },
};

export function getPrefectureBySlug(slug: string): PrefectureInfo | undefined {
  return PREFECTURES_INFO[slug];
}
