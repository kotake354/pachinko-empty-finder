"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import FeedVideo from "@/components/FeedVideo";

// Worker のメディア配信URL（末尾スラッシュを正規化）
const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "";
const baseUrl = workerUrl.endsWith("/") ? workerUrl.slice(0, -1) : workerUrl;

const isImageFile = (fileName: string, mediaType?: string) => {
  const f = fileName.toLowerCase();
  return (
    mediaType === "image" ||
    [".heic", ".jpg", ".jpeg", ".png", ".webp", ".gif"].some((ext) => f.endsWith(ext))
  );
};

type Props = {
  // 並び順: createdAt（最新）または likes（人気）
  orderField?: "createdAt" | "likes";
  emptyText?: string;
};

export default function PostFeed({ orderField = "createdAt", emptyText }: Props) {
  const [posts, setPosts] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user ? user.uid : null);
    });
    const q = query(collection(db, "posts"), orderBy(orderField, "desc"), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      unsubscribeAuth();
      unsubscribe();
    };
  }, [orderField]);

  // カードのリンク遷移を止めて、いいねをトグルする（onSnapshotで自動反映）
  const handleLike = async (e: React.MouseEvent, post: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUserId) {
      alert("いいねするにはログインが必要です");
      return;
    }
    const isLiked = post.likedBy?.includes(currentUserId);
    await updateDoc(doc(db, "posts", post.id), {
      likes: increment(isLiked ? -1 : 1),
      likedBy: isLiked ? arrayRemove(currentUserId) : arrayUnion(currentUserId),
    });
  };

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-600 bg-zinc-800/40 p-10 text-center text-sm text-zinc-400">
        {emptyText ?? "まだ投稿がありません。"}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const mediaUrl =
          post?.videoFileName && baseUrl ? `${baseUrl}/?file=${post.videoFileName}` : null;
        const isImage = mediaUrl && isImageFile(post.videoFileName || "", post.mediaType);

        return (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="group overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800/60 transition-all duration-200 hover:border-cyan-400/60 hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.4)]"
          >
            <div className="flex h-36 items-center justify-center overflow-hidden bg-zinc-900/70">
              {mediaUrl ? (
                isImage ? (
                  <img
                    src={mediaUrl}
                    alt={post.machine}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <FeedVideo src={mediaUrl} />
                )
              ) : (
                <span className="text-xs font-bold italic text-zinc-700">NO MEDIA</span>
              )}
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2">
                {post.type && (
                  <span className="rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-[10px] font-bold text-fuchsia-300 ring-1 ring-fuchsia-500/30">
                    {post.type}
                  </span>
                )}
                <button
                  onClick={(e) => handleLike(e, post)}
                  title="いいね"
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold transition-all ${
                    post.likedBy?.includes(currentUserId)
                      ? "bg-pink-500/20 text-pink-300 ring-1 ring-pink-500/40"
                      : "text-zinc-400 hover:text-pink-300"
                  }`}
                >
                  <span>👍</span>
                  <span>{post.likes || 0}</span>
                </button>
                {post.createdAt && (
                  <span className="ml-auto font-mono text-[10px] text-zinc-500">
                    {new Date(post.createdAt.seconds * 1000).toLocaleDateString("ja-JP", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
              <h3 className="mb-1 truncate font-bold text-zinc-100 transition-colors group-hover:text-cyan-300">
                {post.machine}
              </h3>
              <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">{post.comment}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
