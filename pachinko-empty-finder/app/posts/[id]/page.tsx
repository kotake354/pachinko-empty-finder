"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, updateDoc, increment, deleteDoc, getDocs, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import FeedVideo from "@/components/FeedVideo";


export default function PostDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [post, setPost] = useState<any>(null);
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // コメント用のステート
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [commentFile, setCommentFile] = useState<File | null>(null);

    useEffect(() => {
        if (!id) return;

        // ログイン状態の監視
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUserId(user ? user.uid : null);
        });

        // 投稿データの取得
        const fetchPost = async () => {
            try {
                const docRef = doc(db, "posts", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() } as any;
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

        return () => {
            unsubscribeAuth();
            unsubscribe();
        };
    }, [id]);

    const handleCommentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCommentFile(e.target.files[0]);
        }
    };

    const handleDeletePost = async () => {
        if (!id || !post) return;
        if (!confirm(`「${post.machine}」の投稿を削除しますか？\nコメントとメディアファイルも一緒に削除されます。`)) return;

        setIsDeleting(true);
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
                where("postId", "==", id)
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
            await deleteDoc(doc(db, "posts", id));

            // 4. 一覧ページへリダイレクト
            router.push('/posts');
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("削除に失敗しました。もう一度お試しください。");
            setIsDeleting(false);
        }
    };
    
    const handleDeleteComment = async (commentId: string, mediaFileName?: string) => {
        if (!confirm("このコメントを削除しますか？")) return;

        try {
            // 1. メディアファイルがある場合はR2から削除
            if (mediaFileName) {
                await fetch('/api/delete-media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: mediaFileName }),
                });
            }

            // 2. Firestoreから削除
            await deleteDoc(doc(db, "comments", commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("コメントの削除に失敗しました");
        }
    };

    const handleComment = async () => {
        if (!newComment.trim() && !commentFile) return;
        if (newComment.length > 200) {
            alert("コメントは200文字以内で入力してください");
            return;
        }

        setIsSubmitting(true);
        try {
            let mediaFileName = '';

            // ファイルが選択されている場合はR2へアップロード
            if (commentFile) {
                const extension = commentFile.name.split('.').pop();
                const tempFileName = `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${extension}`;

                const contentType = commentFile.type || 'application/octet-stream';
                const res = await fetch('/api/upload-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileName: tempFileName,
                        contentType: contentType,
                    }),
                });

                if (!res.ok) {
                    let errMsg = 'アップロード用URLの取得に失敗しました。';
                    try {
                        const errJson = await res.json();
                        errMsg += ` (${res.status}: ${errJson.error || JSON.stringify(errJson)})`;
                    } catch { }
                    console.error('upload-url API error:', res.status);
                    throw new Error(errMsg);
                }

                const { uploadUrl, fileName: uniqueFileName } = await res.json();
                mediaFileName = uniqueFileName;

                const uploadRes = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();

                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percentComplete = Math.round((event.loaded / event.total) * 100);
                            setUploadProgress(percentComplete);
                        }
                    };

                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr.response);
                        } else {
                            reject(new Error(`ファイルのアップロードに失敗しました (Status: ${xhr.status})`));
                        }
                    };

                    xhr.onerror = () => {
                        reject(new Error('ファイルのアップロード中にネットワークエラーが発生しました。'));
                    };

                    xhr.open('PUT', uploadUrl, true);
                    xhr.setRequestHeader('Content-Type', contentType);
                    xhr.send(commentFile);
                });
            }

            const extension = commentFile?.name.split('.').pop()?.toLowerCase();
            const isVideo = commentFile?.type.startsWith('video/') || ['mp4', 'mov', 'webm'].includes(extension || '');
            const isImage = commentFile?.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(extension || '');

            await addDoc(collection(db, "comments"), {
                postId: id,
                comment: newComment,
                userName: "匿名",
                mediaFileName: mediaFileName || null,
                mediaType: isImage ? 'image' : isVideo ? 'video' : null,
                createdAt: serverTimestamp(),
                userId: auth.currentUser?.uid || null
            });
            setNewComment("");
            setCommentFile(null);
            setUploadProgress(0);
        } catch (error) {
            console.error("Error adding comment: ", error);
            alert("コメントの投稿に失敗しました");
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const handleLike = async () => {
        if (!id || !currentUserId) {
            if (!currentUserId) alert("いいねするにはログインが必要です");
            return;
        }

        try {
            const ref = doc(db, "posts", id);
            const isLiked = post?.likedBy?.includes(currentUserId);

            if (isLiked) {
                // すでにいいねしている場合は解除
                await updateDoc(ref, {
                    likes: increment(-1),
                    likedBy: arrayRemove(currentUserId)
                });
                setLikes(prev => prev - 1);
                setPost((prev: any) => ({
                    ...prev,
                    likedBy: prev.likedBy.filter((uid: string) => uid !== currentUserId)
                }));
            } else {
                // 未いいねの場合は追加
                await updateDoc(ref, {
                    likes: increment(1),
                    likedBy: arrayUnion(currentUserId)
                });
                setLikes(prev => prev + 1);
                setPost((prev: any) => ({
                    ...prev,
                    likedBy: [...(prev.likedBy || []), currentUserId]
                }));
            }
        } catch (error) {
            console.error("Error toggling like: ", error);
        }
    };

    const handleCommentLike = async (commentId: string) => {
        if (!currentUserId) {
            alert("いいねするにはログインが必要です");
            return;
        }

        try {
            const comment = comments.find(c => c.id === commentId);
            const isLiked = comment?.likedBy?.includes(currentUserId);
            const ref = doc(db, "comments", commentId);

            if (isLiked) {
                await updateDoc(ref, {
                    likes: increment(-1),
                    likedBy: arrayRemove(currentUserId)
                });
            } else {
                await updateDoc(ref, {
                    likes: increment(1),
                    likedBy: arrayUnion(currentUserId)
                });
            }
        } catch (error) {
            console.error("Error toggling comment like: ", error);
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

    // WorkerのURLを取得（末尾のスラッシュの有無を考慮）
    const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || '';
    const baseUrlFormatted = workerUrl.endsWith('/') ? workerUrl.slice(0, -1) : workerUrl;
    // ドメインが空の場合は、相対パスにならないよう null にする
    const postMediaUrl = post?.videoFileName && baseUrlFormatted
        ? `${baseUrlFormatted}/?file=${post.videoFileName}`
        : null;

    const isImageFile = (fileName: string | undefined, mediaType: string | undefined) => {
        if (!fileName && !mediaType) return false;
        const lowerCaseFileName = fileName?.toLowerCase() || '';
        return mediaType === 'image' ||
            lowerCaseFileName.endsWith('.heic') ||
            lowerCaseFileName.endsWith('.jpg') ||
            lowerCaseFileName.endsWith('.jpeg') ||
            lowerCaseFileName.endsWith('.png') ||
            lowerCaseFileName.endsWith('.webp');
    };

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
                        <div className="flex items-center gap-2">
                            {post.type && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 shadow-sm">
                                    {post.type}
                                </span>
                            )}
                            {post.createdAt && (
                                <div className="text-sm text-gray-500 flex items-center gap-1 font-mono">
                                    {new Date(post.createdAt.seconds * 1000).toLocaleString("ja-JP")}
                                    
                                    {currentUserId && post.userId === currentUserId && (
                                        <button
                                            onClick={handleDeletePost}
                                            disabled={isDeleting}
                                            title="この投稿を削除する"
                                            className="ml-2 bg-transparent border-none outline-none text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-all duration-200 shadow-sm"
                                        >
                                            {isDeleting ? (
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                /* 生のSVGを直接記述 + インラインスタイルで確実に表示 */
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
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                        {post.machine}
                    </h1>
                </div>

                {/* メディア領域 */}
                {postMediaUrl && (
                    <div className="w-full bg-black border-b border-gray-100">
                        {isImageFile(post.videoFileName, post.mediaType) ? (
                            <div className="w-full flex justify-center bg-gray-50 p-4">
                                <img
                                    src={postMediaUrl}
                                    alt={`${post.machine}の画像`}
                                    className="rounded-lg max-h-[30vh] object-contain shadow-sm"
                                    style={{ maxHeight: '30vh' }}
                                />
                            </div>
                        ) : (
                            <div 
                                className="aspect-video w-full max-w-xl mx-auto"
                                style={{ maxWidth: '36rem' }} // max-w-xl is 36rem
                            >
                                <FeedVideo src={postMediaUrl} />
                            </div>
                        )}
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
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all active:scale-95 shadow-sm font-bold group ${
                                post?.likedBy?.includes(currentUserId)
                                    ? "bg-pink-50 text-pink-600 border-pink-200"
                                    : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200"
                            }`}
                        >
                            <span className={`text-xl transition-transform duration-200 flex-shrink-0 ${post?.likedBy?.includes(currentUserId) ? "animate-bounce" : "group-hover:scale-125"}`}>👍</span>
                            <span>{likes}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* コメントセクション */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
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
                            maxLength={200}
                            disabled={isSubmitting}
                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all bg-gray-50 resize-none h-24 disabled:opacity-50 ${
                                newComment.length > 200 ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                            }`}
                        />
                        <div className={`text-right text-xs mt-1 font-medium ${newComment.length >= 200 ? "text-red-500" : "text-gray-400"}`}>
                            {newComment.length} / 200
                        </div>

                        {/* メディアアップロード領域 */}
                        <div className="w-full">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                                画像・動画を添付 (任意)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleCommentFileChange}
                                    disabled={isSubmitting}
                                    className="block w-full text-sm text-gray-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-blue-50 file:text-blue-700
                                      hover:file:bg-blue-100
                                      disabled:opacity-50 cursor-pointer"
                                />
                                {commentFile && (
                                    <button
                                        onClick={() => setCommentFile(null)}
                                        className="absolute right-0 top-1 text-xs text-red-500 hover:text-red-700 px-2 py-1 bg-red-50 rounded-full"
                                        disabled={isSubmitting}
                                    >
                                        クリア
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mt-2">
                            <button
                                onClick={handleComment}
                                disabled={isSubmitting || (!newComment.trim() && !commentFile) || newComment.length > 200}
                                className={`relative overflow-hidden px-6 py-2.5 rounded-xl font-bold transition-all ${isSubmitting || (!newComment.trim() && !commentFile) || newComment.length > 200
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                    : "bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700 active:scale-95 border border-transparent"
                                    }`}
                            >
                                {/* プログレスバー背景（アップロード中のみ表示） */}
                                {isSubmitting && commentFile && (
                                    <div
                                        className="absolute top-0 left-0 h-full bg-blue-200/50 transition-all duration-300 ease-out z-0"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                )}

                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {commentFile ? `送信中... (${uploadProgress}%)` : "送信中..."}
                                        </>
                                    ) : (
                                        "コメントを送信"
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-50 pt-6 space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-center text-gray-400 py-8 italic">まだコメントがありません。最初のコメントを書いてみましょう！</p>
                        ) : (
                            comments.map((c) => {
                                // ドメインが空の場合は、相対パスにならないよう null にする
                                const commentMediaUrl = c.mediaFileName && baseUrlFormatted 
                                    ? `${baseUrlFormatted}/?file=${c.mediaFileName}` 
                                    : null;

                                return (
                                    <div key={c.id} className="bg-gray-50 rounded-xl p-4 transition-all hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                                    {c.userName?.[0] || "?"}
                                                </div>
                                                <span className="font-bold text-gray-700 text-sm">{c.userName}</span>
                                            </div>
                                            {c.createdAt && (
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-[10px] text-gray-400 font-mono">
                                                        {new Date(c.createdAt.seconds * 1000).toLocaleString("ja-JP", {
                                                            month: "2-digit",
                                                            day: "2-digit",
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </span>
                                                    {currentUserId && c.userId === currentUserId && (
                                                        <button
                                                            onClick={() => handleDeleteComment(c.id, c.mediaFileName)}
                                                            className="ml-2 bg-transparent border-none outline-none text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-all duration-200 shadow-sm"
                                                            title="コメントを削除"
                                                        >
                                                            {/* 生のSVGを直接記述 + インラインスタイル */}
                                                            <svg 
                                                                xmlns="http://www.w3.org/2000/svg" 
                                                                fill="none" 
                                                                viewBox="0 0 24 24" 
                                                                strokeWidth="1.5" 
                                                                stroke="currentColor" 
                                                                className="w-4 h-4"
                                                                style={{ width: '16px', height: '16px', color: '#dc2626' }}
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* コメントテキスト */}
                                        {c.comment && (
                                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap pl-10 mb-3">
                                                {c.comment}
                                            </p>
                                        )}

                                        {/* コメント画像・メディア領域 */}
                                        {commentMediaUrl && (
                                            <div className="pl-10 mb-3 max-w-[200px]">
                                                {isImageFile(c.mediaFileName, c.mediaType) ? (
                                                        <img
                                                            src={commentMediaUrl}
                                                            alt="コメント添付メディア"
                                                            className="rounded-lg border border-gray-200 max-h-32 object-contain bg-white"
                                                            style={{ maxHeight: '128px' }}
                                                            loading="lazy"
                                                        />
                                                ) : (
                                                    <div className="rounded-lg overflow-hidden border border-gray-200">
                                                        <VideoPlayer
                                                            src={commentMediaUrl}
                                                            controls={true}
                                                            autoPlay={true}
                                                            muted={true}
                                                            loop={true}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="pl-10">
                                            <button
                                                onClick={() => handleCommentLike(c.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all active:scale-95 shadow-sm text-xs font-bold group ${
                                                    c.likedBy?.includes(currentUserId)
                                                        ? "bg-pink-50 text-pink-600 border-pink-100"
                                                        : "bg-white text-gray-500 hover:bg-pink-50 hover:text-pink-600 border-gray-100 hover:border-pink-100"
                                                }`}
                                            >
                                                <span className={`transition-transform ${c.likedBy?.includes(currentUserId) ? "animate-bounce" : "group-hover:animate-bounce"}`}>👍</span>
                                                <span>{c.likes || 0}</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
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
