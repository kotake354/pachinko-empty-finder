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
}

/** 全店舗を取得する（地図のピン表示などに使用） */
export async function getAllHalls(): Promise<Hall[]> {
  try {
    const snapshot = await getDocs(collection(db, "halls"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Hall[];
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
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Hall[];
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
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Hall[];
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
    return { id: snap.id, ...snap.data() } as Hall;
  } catch (error) {
    console.error("Error fetching hall data:", error);
    return null;
  }
}
