import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// 機種詳細のデータ型（Firestoreのフィールドと一致させる）
export interface Machine {
  id: string; // FirestoreのDocument ID (slug)
  name: string;
  maker: string;
  releaseDate: string;
  modelName: string;
  category: 'slot' | 'pachinko';
  type: string[];
  images: {
    main: string;
    reel?: string;
    paytable?: string;
  };
  payoutData: {
    label: string;
    val1: string;
    val2: string;
    rate: string;
  }[];
  features: string[];
  pvUrl?: string;
  sections?: {
    id: string;
    title: string;
    content?: string;
    img?: string;
    items?: {
      title?: string;
      text: string;
      img?: string;
      table?: {
        headers: string[];
        rows: (string | number)[][];
      };
      tableJson?: string;
    }[];
  }[];
  updatedAt?: any;
}

/**
 * スラグ（ドキュメントID）から特定の機種データを取得する
 */
export async function getMachineData(slug: string): Promise<Machine | null> {
  try {
    const docRef = doc(db, "machines", slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // sections サブコレクションの全ドキュメントを取得
      const sectionsSnapshot = await getDocs(query(collection(docRef, "sections"), orderBy("updatedAt", "asc")));
      const sections = sectionsSnapshot.docs.map(sDoc => {
        const sData = sDoc.data();
        return {
          id: sDoc.id,
          ...sData,
          updatedAt: sData.updatedAt?.toDate ? sData.updatedAt.toDate().toISOString() : null
        };
      });

      return {
        id: docSnap.id,
        ...data,
        sections, // フロントエンドで使用できるように追加
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : null
      } as Machine;
    }
    return null;
  } catch (error) {
    console.error("Error fetching machine data:", error);
    return null;
  }
}

/**
 * 全機種のリストを取得する（一覧ページ用）
 */
export async function getAllMachines(maxResults: number = 20): Promise<Machine[]> {
  try {
    const q = query(
      collection(db, "machines"),
      orderBy("releaseDate", "desc"), // 導入日順
      limit(maxResults)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        updatedAt: data.updatedAt?.toDate().toISOString() || null
      };
    }) as Machine[];
  } catch (error) {
    console.error("Error fetching all machines:", error);
    return [];
  }
}

