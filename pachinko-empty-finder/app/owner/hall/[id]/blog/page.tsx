"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { getHallData, type Hall } from "@/lib/firebase/getHall";
import HallBlogManager from "@/components/owner/HallBlogManager";

export default function OwnerBlogPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
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
      if (!data || data.ownerId !== user.uid) {
        setDenied(true);
        setLoading(false);
        return;
      }
      setHall(data);
      setLoading(false);
    });
    return () => unsub();
  }, [params.id, router]);

  if (loading) {
    return <div className="p-12 text-center text-gray-400">読み込み中...</div>;
  }

  if (denied || !hall) {
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
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/owner" className="mb-4 inline-block text-sm text-blue-600 hover:underline">
          ← ダッシュボードに戻る
        </Link>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-800">店舗ブログ管理</h1>
            <p className="text-sm text-gray-500">{hall.name}</p>
          </div>
          <Link
            href={`/hall/${hall.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
          >
            🔍 プレビュー
          </Link>
        </div>
        <HallBlogManager hallId={hall.id} />
      </div>
    </div>
  );
}
