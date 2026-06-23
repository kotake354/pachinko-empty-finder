import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export const ARTICLE_CATEGORIES = ["新台入替", "お知らせ", "イベント"] as const;

export interface HallArticle {
  id: string;
  title: string;
  body: string;
  category?: string;
  createdAt?: string | null; // ISO文字列
}

/** 店舗ブログ記事を新しい順に取得する */
export async function getHallArticles(hallId: string): Promise<HallArticle[]> {
  try {
    const q = query(
      collection(db, "halls", hallId, "articles"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
      };
    }) as HallArticle[];
  } catch (e) {
    console.error("Error fetching hall articles:", e);
    return [];
  }
}
