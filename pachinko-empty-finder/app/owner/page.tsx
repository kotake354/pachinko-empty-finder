"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { getHallsByOwner, type Hall } from "@/lib/firebase/getHall";
import Link from "next/link";

export default function OwnerDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      // 店舗オーナー（メール認証）以外はログインへ
      if (user && !user.isAnonymous) {
        setEmail(user.email);
        setHalls(await getHallsByOwner(user.uid));
        setLoading(false);
      } else {
        router.replace("/owner/login");
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/owner/login");
  };

  const handleDelete = async (hall: Hall) => {
    if (!confirm(`「${hall.name}」を削除しますか？\nこの操作は取り消せません。`)) return;
    try {
      await deleteDoc(doc(db, "halls", hall.id));
      setHalls((prev) => prev.filter((h) => h.id !== hall.id));
    } catch (error) {
      console.error("Error deleting hall:", error);
      alert("削除に失敗しました。もう一度お試しください。");
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-400">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b-4 border-blue-600 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5">
          <div>
            <div className="text-xs font-bold tracking-widest text-gray-400">HALL MANAGER</div>
            <h1 className="text-xl font-black text-gray-800">店舗管理ダッシュボード</h1>
          </div>
          <div className="text-right">
            <div className="max-w-[160px] truncate text-xs text-gray-500">{email}</div>
            <button onClick={handleLogout} className="text-xs font-bold text-blue-600 hover:underline">
              ログアウト
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-gray-700">登録した店舗</h2>
          <Link
            href="/owner/hall/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
          >
            ＋ 新規店舗を登録
          </Link>
        </div>

        {halls.length > 0 ? (
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
            {halls.map((hall) => (
              <li key={hall.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold text-gray-900">{hall.name}</div>
                  <div className="text-xs text-gray-500">
                    {hall.prefecture} {hall.area}
                    {hall.address ? ` ${hall.address}` : ""}
                  </div>
                </div>
                <Link
                  href={`/hall/${hall.slug}`}
                  className="rounded border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  表示
                </Link>
                <Link
                  href={`/owner/hall/${hall.id}/edit`}
                  className="rounded bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                >
                  編集
                </Link>
                <button
                  onClick={() => handleDelete(hall)}
                  className="rounded bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-400">
            まだ店舗を登録していません。「＋ 新規店舗を登録」から追加してください。
          </div>
        )}
      </div>
    </div>
  );
}
