"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import FeedVideo from "@/components/FeedVideo";


export default function PostsPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null); // 削除中のポストIDを保持

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUserId(user ? user.uid : null);
        });

        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id, ...doc.data(),
            }));

            setPosts(data);
        });

        return () => {
            unsubscribeAuth();
            unsubscribe();
        };
    }, []);

    // WorkerのURLを取得（末尾のスラッシュの有無を考慮）
    const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || '';
    const baseUrlFormatted = workerUrl.endsWith('/') ? workerUrl.slice(0, -1) : workerUrl;

    const handleDeletePost = async (e: React.MouseEvent, post: any) => {
        e.preventDefault(); // 親の Link への遷移を防止
        e.stopPropagation();

        if (!confirm(`「${post.machine}」の投稿を削除しますか？\nコメントとメディアファイルも一緒に削除されます。`)) return;

        setIsDeleting(post.id);
        try {
            // 1. 投稿のメディアファイルをR2から削除
            if (post.videoFileName) {
                await fetch('/api/delete-media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: post.videoFileName }),
                });
            }

            // 2. 関連コメントを取得してすべて削除（コメントのメディアも含む）
            const commentsQuery = query(
                collection(db, "comments"),
                where("postId", "==", post.id)
            );
            const commentsSnap = await getDocs(commentsQuery);

            const commentDeletePromises = commentsSnap.docs.map(async (commentDoc) => {
                const commentData = commentDoc.data();
                if (commentData.mediaFileName) {
                    await fetch('/api/delete-media', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fileName: commentData.mediaFileName }),
                    });
                }
                await deleteDoc(doc(db, "comments", commentDoc.id));
            });
            await Promise.all(commentDeletePromises);

            // 3. 投稿のFirestoreドキュメントを削除
            await deleteDoc(doc(db, "posts", post.id));

            alert("削除が完了しました");
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("削除に失敗しました。もう一度お試しください。");
        } finally {
            setIsDeleting(null);
        }
    };

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
                        const videoUrl = post?.videoFileName && baseUrlFormatted ? `${baseUrlFormatted}/?file=${post.videoFileName}` : null;

                        return (
                            <Link
                                key={post.id}
                                href={`/posts/${post.id}`}
                                className="block group"
                            >
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 group-hover:shadow-md group-hover:border-blue-200 transition-all duration-200 cursor-pointer h-full">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {post.type && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                                    {post.type}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {post.createdAt && (
                                                <div className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                                    {new Date(post.createdAt.seconds * 1000).toLocaleString("ja-JP", {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })}
                                                    
                                                    {/* 削除ボタン（自分の投稿のみ表示） */}
                                                    {currentUserId && post.userId === currentUserId && (
                                                        <button
                                                            onClick={(e) => handleDeletePost(e, post)}
                                                            disabled={isDeleting === post.id}
                                                            title="この投稿を削除する"
                                                            className="ml-2 bg-transparent border-none outline-none text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-all duration-200 shadow-sm z-20"
                                                        >
                                                            {isDeleting === post.id ? (
                                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                /* 生のSVG（ゴミ箱）を直接記述 + インラインスタイルで確実に表示 */
                                                                <svg 
                                                                    xmlns="http://www.w3.org/2000/svg" 
                                                                    fill="none" 
                                                                    viewBox="0 0 24 24" 
                                                                    strokeWidth="1.5" 
                                                                    stroke="currentColor" 
                                                                    className="w-5 h-5"
                                                                    style={{ width: '20px', height: '20px', color: '#dc2626' }}
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                            {post.machine}
                                        </h3>
                                    </div>

                                    {(() => {
                                        if (!videoUrl) return null;
                                        const fileName = post.videoFileName?.toLowerCase() || '';
                                        const isImage = fileName.endsWith('.heic') ||
                                            fileName.endsWith('.jpg') ||
                                            fileName.endsWith('.jpeg') ||
                                            fileName.endsWith('.png') ||
                                            fileName.endsWith('.webp') ||
                                            post.mediaType === 'image';

                                        const currentMediaUrl = videoUrl;
                                        if (isImage) {
                                            return (
                                                <div className="w-full flex justify-center bg-gray-50 border border-gray-100 rounded-lg relative z-10">
                                                        <img
                                                            src={currentMediaUrl}
                                                            alt={`${post.machine}の画像`}
                                                            className="rounded-lg max-h-32 object-contain shadow-sm"
                                                            style={{ maxHeight: '128px' }}
                                                            loading="lazy"
                                                        />
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div 
                                                    className="w-full max-w-[300px] mx-auto bg-black rounded-lg overflow-hidden mb-4 relative z-10"
                                                    style={{ maxWidth: '300px' }}
                                                >
                                                    <div className="aspect-video w-full">
                                                        <FeedVideo
                                                            src={currentMediaUrl}
                                                            className="rounded-lg"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })()}

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
