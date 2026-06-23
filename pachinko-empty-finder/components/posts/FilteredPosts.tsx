"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import FeedVideo from "@/components/FeedVideo";

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "";
const baseUrl = workerUrl.endsWith("/") ? workerUrl.slice(0, -1) : workerUrl;

const isImageFile = (fileName: string, mediaType?: string) => {
  const f = fileName.toLowerCase();
  return (
    mediaType === "image" ||
    [".heic", ".jpg", ".jpeg", ".png", ".webp", ".gif"].some((ext) => f.endsWith(ext))
  );
};

// 指定フィールド（hallId / machineId）で投稿を絞り込んで表示する共通リスト。
// 並べ替えはJS側で行う（複合インデックス不要）。
export default function FilteredPosts({
  field,
  value,
  emptyText,
}: {
  field: "hallId" | "machineId";
  value: string;
  emptyText?: string;
}) {
  const [posts, setPosts] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user ? user.uid : null);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "posts"), where(field, "==", value));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setPosts(data);
    });
    return () => unsubscribe();
  }, [field, value]);

  // 一覧から直接いいねを切り替える（onSnapshotで件数は自動更新される）
  const handleLike = async (post: any) => {
    if (!currentUserId) {
      alert("いいねするにはログインが必要です");
      return;
    }
    try {
      const ref = doc(db, "posts", post.id);
      const isLiked = post.likedBy?.includes(currentUserId);
      await updateDoc(ref, {
        likes: increment(isLiked ? -1 : 1),
        likedBy: isLiked ? arrayRemove(currentUserId) : arrayUnion(currentUserId),
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        {emptyText ?? "投稿はまだありません。"}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {posts.map((post) => {
        const mediaUrl =
          post?.videoFileName && baseUrl ? `${baseUrl}/?file=${post.videoFileName}` : null;
        const isImage = mediaUrl && isImageFile(post.videoFileName || "", post.mediaType);
        const isLiked = post.likedBy?.includes(currentUserId);

        return (
          <li key={post.id} className="p-4">
            <div className="mb-2 flex items-center gap-2">
              {post.type && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                  {post.type}
                </span>
              )}
              <Link
                href={`/posts/${post.id}`}
                className="truncate font-bold text-gray-900 hover:text-red-600"
              >
                {post.machine}
              </Link>
              {/* いいねボタン（一覧から直接押せる） */}
              <button
                onClick={() => handleLike(post)}
                className={`ml-auto flex flex-shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold transition-all active:scale-95 ${
                  isLiked
                    ? "border-pink-200 bg-pink-50 text-pink-600"
                    : "border-gray-100 bg-gray-50 text-gray-500 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                <span>👍</span>
                <span>{post.likes || 0}</span>
              </button>
            </div>

            <Link href={`/posts/${post.id}`} className="group block">
              {mediaUrl && (
                <div className="mb-2 max-w-[280px] overflow-hidden rounded-lg bg-black">
                  {isImage ? (
                    <img
                      src={mediaUrl}
                      alt={post.machine}
                      className="max-h-40 w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="aspect-video">
                      <FeedVideo src={mediaUrl} className="rounded-lg" />
                    </div>
                  )}
                </div>
              )}

              <p className="line-clamp-2 whitespace-pre-wrap text-sm text-gray-700">
                {post.comment}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
