"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

export default function PostDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [post, setPost] = useState<any>(null);
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(true);

    // コメント用のステート
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;

        // 投稿データの取得
        const fetchPost = async () => {
            try {
                const docRef = doc(db, "posts", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPost(data);
                    setLikes(data.likes || 0);
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();

        // コメントのリアルタイム取得
        const q = query(
            collection(db, "comments"),
            where("postId", "==", id),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setComments(list);
        });

        return () => unsubscribe();
    }, [id]);

    const handleComment = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "comments"), {
                postId: id,
                comment: newComment,
                userName: "匿名",
                createdAt: serverTimestamp()
            });
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment: ", error);
            alert("コメントの投稿に失敗しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async () => {
        if (!id) return;

        try {
            const ref = doc(db, "posts", id);
            await updateDoc(ref, {
                likes: increment(1)
            });
            setLikes(prev => prev + 1);
        } catch (error) {
            console.error("Error tipping: ", error);
        }
    };

    const handleCommentLike = async (commentId: string) => {
        try {
            const ref = doc(db, "comments", commentId);
            await updateDoc(ref, {
                likes: increment(1)
            });
        } catch (error) {
            console.error("Error liking comment: ", error);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                    <p className="text-gray-400">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">投稿が見つかりませんでした</h1>
                <Link href="/posts" className="text-blue-600 hover:underline">
                    一覧に戻る
                </Link>
            </div>
        );
    }

    // R2のベースURLを取得（末尾のスラッシュの有無を考慮）
    const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
    const baseUrlFormatted = r2BaseUrl.endsWith('/') ? r2BaseUrl : `${r2BaseUrl}/`;
    const videoUrl = post?.videoFileName ? `${baseUrlFormatted}${post.videoFileName}` : null;

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <button
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>戻る</span>
            </button>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <div className="flex items-start justify-between mb-4">
                        {post.type && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 shadow-sm">
                                {post.type}
                            </span>
                        )}
                        {post.createdAt && (
                            <span className="text-xs text-gray-400 font-mono">
                                {new Date(post.createdAt.seconds * 1000).toLocaleString("ja-JP")}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                        {post.machine}
                    </h1>
                    <p className="text-xl text-gray-500 mt-2">@ {post.hall}</p>
                </div>

                {/* 動画領域 */}
                {videoUrl && (
                    <div className="w-full aspect-video bg-black border-b border-gray-100">
                        <VideoPlayer 
                            src={videoUrl}
                            controls={true}
                            autoPlay={true}
                            muted={true}
                            loop={true}
                        />
                    </div>
                )}

                <div className="p-8">
                    <div className="prose prose-blue max-w-none">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">
                            コメント
                        </label>
                        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-xl border border-gray-100">
                            {post.comment}
                        </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 hover:bg-pink-50 text-gray-600 hover:text-pink-600 rounded-full border border-gray-200 hover:border-pink-200 transition-all active:scale-95 group shadow-sm"
                        >
                            <span className="text-xl group-hover:scale-125 transition-transform duration-200 flex-shrink-0">👍</span>
                            <span className="font-bold">{likes}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* コメントセクション */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-8 pb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        みんなのコメント ({comments.length})
                    </h2>
                </div>

                <div className="p-8 pt-4 space-y-6">
                    {/* コメント投稿フォーム */}
                    <div className="flex flex-col gap-3 group">
                        <textarea
                            placeholder="この投稿にコメントする..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 resize-none h-24"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleComment}
                                disabled={isSubmitting || !newComment.trim()}
                                className={`px-6 py-2 rounded-xl font-bold transition-all ${isSubmitting || !newComment.trim()
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700 active:scale-95"
                                    }`}
                            >
                                {isSubmitting ? "投稿中..." : "コメントを送信"}
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-50 pt-6 space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-center text-gray-400 py-8 italic">まだコメントがありません。最初のコメントを書いてみましょう！</p>
                        ) : (
                            comments.map((c) => (
                                <div key={c.id} className="bg-gray-50 rounded-xl p-4 transition-all hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                                {c.userName?.[0] || "?"}
                                            </div>
                                            <span className="font-bold text-gray-700 text-sm">{c.userName}</span>
                                        </div>
                                        {c.createdAt && (
                                            <span className="text-[10px] text-gray-400 font-mono">
                                                {new Date(c.createdAt.seconds * 1000).toLocaleString("ja-JP", {
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap pl-10 mb-3">
                                        {c.comment}
                                    </p>
                                    <div className="pl-10">
                                        <button
                                            onClick={() => handleCommentLike(c.id)}
                                            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-pink-50 text-gray-500 hover:text-pink-600 rounded-full border border-gray-100 hover:border-pink-100 transition-all active:scale-95 shadow-sm text-xs font-bold group"
                                        >
                                            <span className="group-hover:animate-bounce">👍</span>
                                            <span>{c.likes || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/posts" className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors flex items-center justify-center gap-1 group">
                    一覧に戻る
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
