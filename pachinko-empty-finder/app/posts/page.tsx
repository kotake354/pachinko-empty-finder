"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

export default function PostsPage() {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setPosts(data);
        });

        return () => unsubscribe();
    }, []);

    // R2のベースURLを取得（末尾のスラッシュの有無を考慮）
    const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
    const baseUrlFormatted = r2BaseUrl.endsWith('/') ? r2BaseUrl : `${r2BaseUrl}/`;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    投稿一覧
                </h1>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                    {posts.length} 件の投稿
                </span>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400">まだ投稿がありません。</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {posts.map((post) => {
                        const videoUrl = post?.videoFileName ? `${baseUrlFormatted}${post.videoFileName}` : null;
                        
                        return (
                            <Link
                                key={post.id}
                                href={`/posts/${post.id}`}
                                className="block group"
                            >
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 group-hover:shadow-md group-hover:border-blue-200 transition-all duration-200 cursor-pointer h-full">
                                    <div className="flex items-start justify-between mb-2">
                                        {post.type && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                                {post.type}
                                            </span>
                                        )}
                                        {post.createdAt && (
                                            <span className="text-xs text-gray-400 font-mono">
                                                {new Date(post.createdAt.seconds * 1000).toLocaleString("ja-JP", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                            {post.machine} <span className="text-base font-normal text-gray-500">@ {post.hall}</span>
                                        </h3>
                                    </div>
                                    
                                    {/* 動画プレイヤー領域 */}
                                    {videoUrl && (
                                        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-4 relative z-10" onClick={(e) => {
                                            // 動画内クリックで親(Link)への遷移を防ぐ場合は e.preventDefault() 等も可能だが
                                            // プレイヤー全体のクリックで詳細に飛ぶ方が自然なためここではそのままに
                                        }}>
                                            <VideoPlayer 
                                                src={videoUrl}
                                                controls={false} // 一覧ではコントロール非表示
                                                autoPlay={true}
                                                muted={true} // 一覧はミュート必須
                                                loop={true}
                                                className="rounded-lg"
                                            />
                                        </div>
                                    )}

                                    <div className="bg-gray-50 rounded-lg p-4 group-hover:bg-blue-50/30 transition-colors line-clamp-3">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.comment}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
