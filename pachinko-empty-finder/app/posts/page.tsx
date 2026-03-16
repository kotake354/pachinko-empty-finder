"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

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

    // R2のベースURLを取得（末尾のスラッシュの有無を考慮）
    const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
    const baseUrlFormatted = r2BaseUrl.endsWith('/') ? r2BaseUrl : `${r2BaseUrl}/`;

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
                        const videoUrl = post?.videoFileName ? `${baseUrlFormatted}${post.videoFileName}` : null;
                        
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
                                            {/* 削除ボタン（自分の投稿のみ表示） */}
                                            {currentUserId && post.userId === currentUserId && (
                                                <button
                                                    onClick={(e) => handleDeletePost(e, post)}
                                                    disabled={isDeleting === post.id}
                                                    title="この投稿を削除する"
                                                    className="p-1.5 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all z-20"
                                                >
                                                    {isDeleting === post.id ? (
                                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                            {post.machine} <span className="text-base font-normal text-gray-500">@ {post.hall}</span>
                                        </h3>
                                    </div>
                                    
                                    {/* メディア表示領域 */}
                                    {videoUrl && (
                                        <div className="w-full bg-black rounded-lg overflow-hidden mb-4 relative z-10" onClick={(e) => {
                                            // メディア内クリックで親(Link)への遷移を防ぐ場合は e.preventDefault() 等も可能だが
                                            // 全体のクリックで詳細に飛ぶ方が自然なためここではそのままに
                                        }}>
                                            {post.mediaType === 'video' ? (
                                                <div className="aspect-video w-full">
                                                    <VideoPlayer 
                                                        src={videoUrl}
                                                        controls={false} // 一覧ではコントロール非表示
                                                        autoPlay={true}
                                                        muted={true} // 一覧はミュート必須
                                                        loop={true}
                                                        className="rounded-lg"
                                                    />
                                                </div>
                                            ) : post.mediaType === 'image' || !post.mediaType ? ( // 下位互換性のため !post.mediaType も画像として扱うか、またはファイル名で判定も可。今回は画像優先とする（または動画優先とするか？）
                                                // 以前の投稿（mediaTypeがないもの）は主に動画だったので、動画としてフォールバックするのが安全かも。しかし今後は明確に判定。
                                                // 拡張子で判定する簡単なフォールバックを実装
                                                (() => {
                                                    const isLikelyVideo = !post.mediaType && videoUrl.match(/\.(mp4|webm|ogg|mov)$/i);
                                                    if (post.mediaType === 'image' || (!post.mediaType && !isLikelyVideo)) {
                                                        return (
                                                            <div className="w-full flex justify-center bg-gray-50 border border-gray-100 rounded-lg">
                                                                <img 
                                                                    src={videoUrl} 
                                                                    alt={`${post.machine}の画像`}
                                                                    className="rounded-lg max-h-64 object-contain"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        );
                                                    } else {
                                                        return (
                                                            <div className="aspect-video w-full">
                                                                <VideoPlayer 
                                                                    src={videoUrl}
                                                                    controls={false}
                                                                    autoPlay={true}
                                                                    muted={true}
                                                                    loop={true}
                                                                    className="rounded-lg"
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                })()
                                            ) : null}
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
