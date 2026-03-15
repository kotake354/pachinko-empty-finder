"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Link from 'next/link';

const POST_TYPES = ["据え置き", "イベント", "回収", "爆出し", "今日どうだった", "明日どうする", "暇つぶし"];

export default function PostPage() {
    const [hall, setHall] = useState("");
    const [machine, setMachine] = useState("");
    const [comment, setComment] = useState("");
    const [selectedType, setSelectedType] = useState("据え置き");
    
    // 動画アップロード用のState
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    };

    const handlePost = async () => {
        if (!hall || !machine) {
            setErrorMsg("店舗名と台情報を入力してください");
            return;
        }

        setIsUploading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            let videoFileName = '';

            // 動画が選択されている場合はR2へアップロード
            if (videoFile) {
                // 1. ファイル名生成
                const extension = videoFile.name.split('.').pop();
                videoFileName = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${extension}`;

                // 2. 署名付きURL取得
                const res = await fetch('/api/upload-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileName: videoFileName,
                        contentType: videoFile.type,
                    }),
                });

                if (!res.ok) {
                    throw new Error('アップロード用URLの取得に失敗しました。');
                }

                const { uploadUrl } = await res.json();

                // 3. R2へPUTリクエスト
                const uploadRes = await fetch(uploadUrl, {
                    method: 'PUT',
                    body: videoFile,
                    headers: { 'Content-Type': videoFile.type },
                });

                if (!uploadRes.ok) {
                    throw new Error('動画のアップロードに失敗しました。');
                }
            }

            // 4. Firestoreへ保存
            await addDoc(collection(db, "posts"), {
                hall,
                machine,
                comment,
                type: selectedType,
                videoFileName: videoFileName || null, // 動画がない場合は null
                createdAt: serverTimestamp(),
                // userId: 'dummy_user_123' // 必要に応じて認証ユーザーのIDを追加
            });

            setSuccessMsg("リアルタイム情報を共有しました！");
            
            // フォームリセット
            setHall("");
            setMachine("");
            setComment("");
            setSelectedType("据え置き");
            setVideoFile(null);
            
        } catch (error: any) {
            console.error("Error adding document: ", error);
            setErrorMsg(error.message || "投稿に失敗しました");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            情報を共有する
                        </h1>
                        <p className="text-gray-500">現在のホールの状況を教えてください</p>
                    </div>
                </div>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                        {errorMsg}
                    </div>
                )}
                
                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-medium">
                        {successMsg}
                    </div>
                )}

                <div className="space-y-6">
                    {/* タグ選択 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            現在の状況（タグ）
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {POST_TYPES.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedType(t)}
                                    disabled={isUploading}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-1.5 border-2 ${selectedType === t
                                            ? "bg-orange-500 text-white border-orange-500 shadow-md transform scale-105 ring-4 ring-orange-100 opacity-100"
                                            : "bg-white text-gray-400 border-gray-100 opacity-70 hover:opacity-100 hover:border-gray-300 hover:text-gray-500"
                                        }`}
                                >
                                    {selectedType === t && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 店舗名 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            店舗名 <span className="text-red-500">*</span>
                        </label>
                        <input
                            placeholder="例: マルハン新宿店"
                            value={hall}
                            onChange={(e) => setHall(e.target.value)}
                            disabled={isUploading}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50"
                        />
                    </div>

                    {/* 機種名 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            機種・台情報 <span className="text-red-500">*</span>
                        </label>
                        <input
                            placeholder="例: P北斗の拳10 123番台"
                            value={machine}
                            onChange={(e) => setMachine(e.target.value)}
                            disabled={isUploading}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50"
                        />
                    </div>

                    {/* コメント */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            コメント
                        </label>
                        <textarea
                            placeholder="現在の回転数や状況など..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            disabled={isUploading}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 resize-none"
                        />
                    </div>

                    {/* 動画アップロード */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            動画ファイル (任意)
                        </label>
                        <div className="w-full px-4 py-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer relative">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                disabled={isUploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <div className="text-center pointer-events-none flex flex-col items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" style={{ width: '32px', height: '32px' }} className="text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                {videoFile ? (
                                    <span className="text-sm font-semibold text-blue-600">{videoFile.name} が選択されています</span>
                                ) : (
                                    <span className="text-sm text-gray-500">クリックして動画を選択、またはドラッグ＆ドロップ</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePost}
                        disabled={isUploading}
                        className="w-full py-4 mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                アップロードして投稿中...
                            </>
                        ) : (
                            '投稿する'
                        )}
                    </button>
                    
                    {/* 一覧ページへのリンク（動作確認用などに） */}
                    <div className="text-center mt-4">
                        <Link href="/" className="text-sm text-blue-500 hover:underline">
                            投稿一覧を見る（ホームへ）
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}