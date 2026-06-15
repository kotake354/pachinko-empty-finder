"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import Link from "next/link";

// Firebaseのエラーコードを日本語に変換
function toJaError(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "メールアドレスの形式が正しくありません。";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "メールアドレスまたはパスワードが違います。";
    case "auth/email-already-in-use":
      return "このメールアドレスは既に登録されています。";
    case "auth/weak-password":
      return "パスワードは6文字以上にしてください。";
    case "auth/operation-not-allowed":
      return "メール/パスワード認証が有効化されていません（Firebaseコンソールで設定が必要）。";
    default:
      return "エラーが発生しました。時間をおいて再度お試しください。";
  }
}

export default function OwnerLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/owner");
    } catch (err: any) {
      setError(toJaError(err?.code || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="text-xs font-bold tracking-widest text-gray-400">HALL MANAGER</div>
            <h1 className="text-2xl font-black text-gray-800">
              {mode === "login" ? "店舗ログイン" : "店舗アカウント登録"}
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              店舗オーナー向け。自店の情報を掲載・管理できます。
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                パスワード（6文字以上）
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-bold text-white transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:opacity-60"
            >
              {loading ? "処理中..." : mode === "login" ? "ログイン" : "登録する"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-500">
            {mode === "login" ? (
              <button onClick={() => setMode("signup")} className="font-bold text-blue-600 hover:underline">
                店舗アカウントを新規登録
              </button>
            ) : (
              <button onClick={() => setMode("login")} className="font-bold text-blue-600 hover:underline">
                すでに登録済みの方はログイン
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
