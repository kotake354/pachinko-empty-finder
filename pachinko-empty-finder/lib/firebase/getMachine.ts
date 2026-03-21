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
  };
  payoutData: {
    label: string;
    val1: string;
    val2: string;
    rate: string;
  }[];
  features: string[];
  pvUrl?: string;
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
      return {
        id: docSnap.id,
        ...data,
        updatedAt: data.updatedAt?.toDate().toISOString() || null
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

/**
 * 別コレクション（筐体画像、リール配列）などからデータを取得する
 */
export async function getMachineExtras(slug: string) {
  try {
    const [machinemodelSnap, lillemodelSnap] = await Promise.all([
      getDoc(doc(db, "machinemodels", slug)),
      getDoc(doc(db, "lillemodel", slug))
    ]);

    const serializeDoc = (data: Record<string, any>) => ({
      ...data,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : null,
    });

    return {
      machinemodel: machinemodelSnap.exists() ? serializeDoc(machinemodelSnap.data() as Record<string, any>) : null,
      lillemodel: lillemodelSnap.exists() ? serializeDoc(lillemodelSnap.data() as Record<string, any>) : null,
    };
  } catch (error) {
    console.error("Error fetching extra machine data:", error);
    return { machinemodel: null, lillemodel: null };
  }
}
