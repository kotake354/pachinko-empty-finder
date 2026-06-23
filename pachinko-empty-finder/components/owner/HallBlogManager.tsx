"use client";

import { useEffect, useRef, useState } from "react";
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

// Worker のメディア配信URL（R2にアップロードした画像・動画のプレビュー用）
const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "";
const mediaBase = workerUrl.endsWith("/") ? workerUrl.slice(0, -1) : workerUrl;
const mediaUrl = (fileName?: string | null) =>
  fileName && mediaBase ? `${mediaBase}/?file=${fileName}` : null;

// 動画の最大長（秒）
const MAX_VIDEO_SECONDS = 60;

export default function HallBlogManager({ hallId }: { hallId: string }) {
  const [articles, setArticles] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>(ARTICLE_CATEGORIES[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setError("");
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  // 動画は長さ（1分以内）を選択時にチェックする
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setError("");
    if (!file) {
      setVideoFile(null);
      setVideoPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      if (v.duration > MAX_VIDEO_SECONDS + 0.5) {
        setError(`動画は1分（${MAX_VIDEO_SECONDS}秒）以内にしてください。`);
        setVideoFile(null);
        setVideoPreview(null);
        if (videoInputRef.current) videoInputRef.current.value = "";
        URL.revokeObjectURL(url);
        return;
      }
      setVideoFile(file);
      setVideoPreview(url);
    };
    v.onerror = () => {
      setError("動画ファイルを読み込めませんでした。");
      URL.revokeObjectURL(url);
    };
    v.src = url;
  };

  // ファイルをR2へアップロードし、保存するファイル名を返す
  const uploadFile = async (file: File): Promise<string> => {
    const contentType = file.type || "application/octet-stream";
    const res = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, contentType }),
    });
    if (!res.ok) throw new Error("アップロードURLの取得に失敗しました。");
    const { uploadUrl, fileName } = await res.json();
    const put = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    });
    if (!put.ok) throw new Error("アップロードに失敗しました。");
    return fileName as string;
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setCategory(ARTICLE_CATEGORIES[0]);
    setImageFile(null);
    setImagePreview(null);
    setVideoFile(null);
    setVideoPreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("タイトルと本文を入力してください。");
      return;
    }
    setSaving(true);
    setError("");
    try {
      // 画像・動画があればR2へアップロード
      const imageFileName = imageFile ? await uploadFile(imageFile) : null;
      const videoFileName = videoFile ? await uploadFile(videoFile) : null;

      await addDoc(collection(db, "halls", hallId, "articles"), {
        title: title.trim(),
        body: body.trim(),
        category,
        imageFileName,
        videoFileName,
        createdAt: serverTimestamp(),
      });
      resetForm();
    } catch (err) {
      console.error("Error adding article:", err);
      setError("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a: any) => {
    if (!confirm(`「${a.title}」を削除しますか？`)) return;
    try {
      await deleteDoc(doc(db, "halls", hallId, "articles", a.id));
      // 紐づくR2メディアも削除（失敗しても投稿削除は完了させる）
      [a.imageFileName, a.videoFileName].forEach((fileName) => {
        if (fileName) {
          fetch("/api/delete-media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName }),
          }).catch(() => {});
        }
      });
    } catch (err) {
      console.error("Error deleting article:", err);
      alert("削除に失敗しました。");
    }
  };

  const field =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
  const fileInput =
    "block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-bold file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-60";

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

        {/* 画像 */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">画像（任意）</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="画像プレビュー"
              className="max-h-48 w-full rounded-lg border border-gray-200 object-contain"
            />
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={saving}
            className={fileInput}
          />
        </div>

        {/* 動画 */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            動画（任意・1分以内）
          </label>
          {videoPreview && (
            <video
              src={videoPreview}
              controls
              playsInline
              className="max-h-56 w-full rounded-lg border border-gray-200 bg-black object-contain"
            />
          )}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            disabled={saving}
            className={fileInput}
          />
          <p className="text-xs text-gray-400">
            ※ 1分（{MAX_VIDEO_SECONDS}秒）を超える動画はアップロードできません。
          </p>
        </div>

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
                    onClick={() => handleDelete(a)}
                    className="ml-auto rounded bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    削除
                  </button>
                </div>
                <div className="font-bold text-gray-900">{a.title}</div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{a.body}</p>
                {mediaUrl(a.imageFileName) && (
                  <img
                    src={mediaUrl(a.imageFileName)!}
                    alt=""
                    className="mt-2 max-h-48 w-full rounded-lg border border-gray-200 object-contain"
                  />
                )}
                {mediaUrl(a.videoFileName) && (
                  <video
                    src={mediaUrl(a.videoFileName)!}
                    controls
                    playsInline
                    className="mt-2 max-h-56 w-full rounded-lg border border-gray-200 bg-black object-contain"
                  />
                )}
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
