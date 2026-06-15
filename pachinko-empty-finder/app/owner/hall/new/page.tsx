"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import HallForm from "@/components/owner/HallForm";

export default function NewHallPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && !user.isAnonymous) {
        setUid(user.uid);
        setLoading(false);
      } else {
        router.replace("/owner/login");
      }
    });
    return () => unsub();
  }, [router]);

  if (loading || !uid) {
    return <div className="p-12 text-center text-gray-400">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/owner" className="mb-4 inline-block text-sm text-blue-600 hover:underline">
          ← ダッシュボードに戻る
        </Link>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-xl font-black text-gray-800">新規店舗を登録</h1>
          <HallForm ownerId={uid} />
        </div>
      </div>
    </div>
  );
}
