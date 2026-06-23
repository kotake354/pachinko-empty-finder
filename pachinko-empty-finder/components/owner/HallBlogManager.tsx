"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ARTICLE_CATEGORIES } from "@/lib/firebase/hallArticles";

export default function HallBlogManager({ hallId }: { hallId: string }) {
  const [articles, setArticles] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>(ARTICLE_CATEGORIES[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "halls", hallId, "articles"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setArticles(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, [hallId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("タイトルと本文を入力してください。");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "halls", hallId, "articles"), {
        title: title.trim(),
        body: body.trim(),
        category,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setBody("");
      setCategory(ARTICLE_CATEGORIES[0]);
    } catch (err) {
      console.error("Error adding article:", err);
      setError("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, t: string) => {
    if (!confirm(`「${t}」を削除しますか？`)) return;
    try {
      await deleteDoc(doc(db, "halls", hallId, "articles", id));
    } catch (err) {
      console.error("Error deleting article:", err);
      alert("削除に失敗しました。");
    }
  };

  const field =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  return (
    <div className="space-y-8">
      {/* 投稿フォーム */}
      <form onSubmit={handleAdd} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-bold text-gray-500">新しい記事を投稿</h2>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_1fr]">
          <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={saving} className={field}>
            {ARTICLE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
            placeholder="タイトル（例: 新台入替のお知らせ）"
            className={field}
          />
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={saving}
          rows={5}
          placeholder="本文"
          className={`${field} resize-none`}
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:opacity-60"
        >
          {saving ? "投稿中..." : "投稿する"}
        </button>
      </form>

      {/* 投稿済み一覧 */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-gray-500">投稿済みの記事（{articles.length}）</h2>
        {articles.length > 0 ? (
          <ul className="space-y-3">
            {articles.map((a) => (
              <li key={a.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="mb-1 flex items-center gap-2">
                  {a.category && (
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      {a.category}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {a.createdAt?.seconds
                      ? new Date(a.createdAt.seconds * 1000).toLocaleDateString("ja-JP")
                      : ""}
                  </span>
                  <button
                    onClick={() => handleDelete(a.id, a.title)}
                    className="ml-auto rounded bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    削除
                  </button>
                </div>
                <div className="font-bold text-gray-900">{a.title}</div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{a.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-400">
            まだ記事がありません。上のフォームから投稿してください。
          </div>
        )}
      </div>
    </div>
  );
}
