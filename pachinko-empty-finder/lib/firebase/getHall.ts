import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

// 店舗（ホール）のデータ型。位置情報は lat / lng に統一する。
export interface Hall {
  id: string; // FirestoreのDocument ID (slug)
  name: string;
  prefecture: string; // 例: 千葉県
  area: string; // 市区町村 例: 柏
  slug: string; // 例: maruhan-kashiwa
  lat: number;
  lng: number;
  address?: string;
  ownerId?: string; // 店舗オーナー（自主掲載）のUID。管理者シードは未設定
  // --- 営業情報 ---
  openTime?: string; // 例: 10:00
  closeTime?: string; // 例: 22:45
  holiday?: string; // 例: 年中無休 / 第3水曜
  phone?: string;
  // --- 設備・アクセス ---
  pachinkoCount?: number; // パチンコ台数
  slotCount?: number; // スロット台数
  parking?: string; // あり / なし / 提携あり など
  nearestStation?: string; // 最寄り駅
  // --- 紹介・リンク ---
  description?: string; // 紹介文（自由テキスト）
  websiteUrl?: string;
  snsUrl?: string;
  // --- 画像 ---
  imageFileName?: string; // 外観写真（R2のファイル名）。Worker経由で配信
  // --- デザイン ---
  themeColor?: string; // ページ上部ヘッダーの背景色（HEX 例: #b91c1c）
  createdAt?: string | null; // 作成日時（ISO文字列。Timestampは渡せないため変換）
}

// FirestoreドキュメントをHallへ変換。createdAt(Timestamp)を文字列化する
// （Server Component → Client Component に Timestamp を渡すとシリアライズエラーになる）
function toHall(id: string, data: any): Hall {
  return {
    id,
    ...data,
    createdAt: data?.createdAt?.toDate
      ? data.createdAt.toDate().toISOString()
      : typeof data?.createdAt === "string"
        ? data.createdAt
        : null,
  } as Hall;
}

// 店舗画像（外観）のURLを返す。未設定なら null。
const _workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "";
const _mediaBase = _workerUrl.endsWith("/") ? _workerUrl.slice(0, -1) : _workerUrl;
export function hallImageUrl(hall: Pick<Hall, "imageFileName">): string | null {
  return hall.imageFileName && _mediaBase ? `${_mediaBase}/?file=${hall.imageFileName}` : null;
}

// 背景色(HEX)に対して読みやすい文字色（濃いグレー or 白）を返す
export function textColorFor(hex?: string): string {
  const c = (hex || "").replace("#", "");
  if (c.length < 6) return "#ffffff";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#111827" : "#ffffff";
}

/** 全店舗を取得する（地図のピン表示などに使用） */
export async function getAllHalls(): Promise<Hall[]> {
  try {
    const snapshot = await getDocs(collection(db, "halls"));
    return snapshot.docs.map((d) => toHall(d.id, d.data()));
  } catch (error) {
    console.error("Error fetching halls:", error);
    return [];
  }
}

/** 都道府県（正式名）で店舗を取得する。例: "千葉県" */
export async function getHallsByPrefecture(prefecture: string): Promise<Hall[]> {
  try {
    const q = query(collection(db, "halls"), where("prefecture", "==", prefecture));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => toHall(d.id, d.data()));
  } catch (error) {
    console.error("Error fetching halls by prefecture:", error);
    return [];
  }
}

/** オーナー（店舗アカウント）が管理する店舗を取得する */
export async function getHallsByOwner(ownerId: string): Promise<Hall[]> {
  try {
    const q = query(collection(db, "halls"), where("ownerId", "==", ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => toHall(d.id, d.data()));
  } catch (error) {
    console.error("Error fetching halls by owner:", error);
    return [];
  }
}

/** スラグから特定の店舗を取得する */
export async function getHallData(slug: string): Promise<Hall | null> {
  try {
    const snap = await getDoc(doc(db, "halls", slug));
    if (!snap.exists()) return null;
    return toHall(snap.id, snap.data());
  } catch (error) {
    console.error("Error fetching hall data:", error);
    return null;
  }
}
