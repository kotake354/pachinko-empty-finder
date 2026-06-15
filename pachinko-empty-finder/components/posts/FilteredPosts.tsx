"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
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

  useEffect(() => {
    const q = query(collection(db, "posts"), where(field, "==", value));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setPosts(data);
    });
    return () => unsubscribe();
  }, [field, value]);

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

        return (
          <li key={post.id} className="p-4">
            <Link href={`/posts/${post.id}`} className="group block">
              <div className="mb-2 flex items-center gap-2">
                {post.type && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                    {post.type}
                  </span>
                )}
                <span className="truncate font-bold text-gray-900 group-hover:text-red-600">
                  {post.machine}
                </span>
                <span className="ml-auto flex-shrink-0 text-[11px] font-bold text-pink-500">
                  👍 {post.likes || 0}
                </span>
              </div>

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
