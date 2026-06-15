"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import HallForm from "@/components/owner/HallForm";
import { getHallData, type Hall } from "@/lib/firebase/getHall";

export default function EditHallPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [uid, setUid] = useState<string | null>(null);
  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || user.isAnonymous) {
        router.replace("/owner/login");
        return;
      }
      const data = await getHallData(params.id);
      // 自分が所有する店舗のみ編集可
      if (!data || data.ownerId !== user.uid) {
        setDenied(true);
        setLoading(false);
        return;
      }
      setUid(user.uid);
      setHall(data);
      setLoading(false);
    });
    return () => unsub();
  }, [params.id, router]);

  if (loading) {
    return <div className="p-12 text-center text-gray-400">読み込み中...</div>;
  }

  if (denied || !hall || !uid) {
    return (
      <div className="mx-auto max-w-2xl p-12 text-center">
        <p className="mb-4 text-gray-500">この店舗を編集する権限がありません。</p>
        <Link href="/owner" className="text-sm text-blue-600 hover:underline">
          ← ダッシュボードに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/owner" className="mb-4 inline-block text-sm text-blue-600 hover:underline">
          ← ダッシュボードに戻る
        </Link>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-xl font-black text-gray-800">店舗情報を編集</h1>
          <HallForm ownerId={uid} hall={hall} />
        </div>
      </div>
    </div>
  );
}
