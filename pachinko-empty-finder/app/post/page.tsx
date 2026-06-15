"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAllHalls, type Hall } from "@/lib/firebase/getHall";
import { getAllMachines, type Machine } from "@/lib/firebase/getMachine";
import Link from 'next/link';

const POST_TYPES = ["据え置き", "イベント", "回収", "爆出し", "今日どうだった", "明日どうする", "暇つぶし"];

export default function PostPage() {
    const [machine, setMachine] = useState("");
    const [comment, setComment] = useState("");
    const [selectedType, setSelectedType] = useState("据え置き");

    // 店舗・機種選択（任意）
    const [halls, setHalls] = useState<Hall[]>([]);
    const [hallId, setHallId] = useState("");
    const [machines, setMachines] = useState<Machine[]>([]);
    const [machineId, setMachineId] = useState("");

    useEffect(() => {
        getAllHalls().then(setHalls);
        getAllMachines(100).then(setMachines);
        // 店舗/機種ページの「投稿する」から来た場合は ?hall= / ?machine= で初期選択
        const params = new URLSearchParams(window.location.search);
        const presetHall = params.get("hall");
        const presetMachine = params.get("machine");
        if (presetHall) setHallId(presetHall);
        if (presetMachine) setMachineId(presetMachine);
    }, []);

    // 動画アップロード用のState
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    };

    const handlePost = async () => {
        if (!machine) {
            setErrorMsg("台情報を入力してください");
            return;
        }

        if (comment.length > 200) {
            setErrorMsg("コメントは200文字以内で入力してください");
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
                const contentType = videoFile.type || 'application/octet-stream'; // MIMEタイプが不明な場合のフォールバック
                const res = await fetch('/api/upload-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileName: videoFileName,
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

                // API側で生成されたユニークなファイル名を受け取る
                const { uploadUrl, fileName: uniqueFileName } = await res.json();

                // Firestoreにはこのユニークな名前を保存する
                videoFileName = uniqueFileName;

                // 3. R2へPUTリクエスト (XHRを使用して進捗を取得)
                await new Promise((resolve, reject) => {
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
                            reject(new Error(`動画のアップロードに失敗しました (Status: ${xhr.status})`));
                        }
                    };

                    xhr.onerror = () => {
                        reject(new Error('動画のアップロード中にネットワークエラーが発生しました。'));
                    };

                    xhr.open('PUT', uploadUrl, true);
                    xhr.setRequestHeader('Content-Type', contentType);
                    xhr.send(videoFile);
                });
            }

            // 4. Firestoreへ保存
            if (!auth.currentUser) {
                throw new Error("ログインユーザーが見つかりません。ページを再読み込みしてください。");
            }

            const selectedHall = halls.find((h) => h.slug === hallId);
            const selectedMachine = machines.find((m) => m.id === machineId);

            await addDoc(collection(db, "posts"), {
                machine,
                comment,
                type: selectedType,
                hallId: hallId || null, // 店舗未選択なら null
                hallName: selectedHall?.name || null,
                machineId: machineId || null, // 機種未選択なら null
                machineName: selectedMachine?.name || null,
                videoFileName: videoFileName || null, // 動画・画像がない場合は null
                mediaType: videoFile?.type.startsWith('image/') ? 'image' : videoFile?.type.startsWith('video/') ? 'video' : null,
                createdAt: serverTimestamp(),
                userId: auth.currentUser.uid
            });

            setSuccessMsg("リアルタイム情報を共有しました！");

            // フォームリセット
            setMachine("");
            setComment("");
            setSelectedType("据え置き");
            setHallId("");
            setMachineId("");
            setVideoFile(null);
            setUploadProgress(0);

        } catch (error: any) {
            console.error("Error adding document: ", error);
            setErrorMsg(error.message || "投稿に失敗しました");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
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


                    {/* 店舗選択（任意） */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            店舗（任意）
                        </label>
                        <select
                            value={hallId}
                            onChange={(e) => setHallId(e.target.value)}
                            disabled={isUploading}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50"
                        >
                            <option value="">店舗を選択しない</option>
                            {halls.map((h) => (
                                <option key={h.id} value={h.slug}>
                                    {h.name}（{h.prefecture}{h.area}）
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 機種選択（任意） */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            機種を選ぶ（任意）
                        </label>
                        <select
                            value={machineId}
                            onChange={(e) => setMachineId(e.target.value)}
                            disabled={isUploading}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50"
                        >
                            <option value="">機種を選択しない</option>
                            {machines.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
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
                            maxLength={200}
                            disabled={isUploading}
                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all bg-gray-50 resize-none ${
                                comment.length > 200 ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                            }`}
                        />
                        <div className={`text-right text-xs mt-1 font-medium ${comment.length >= 200 ? "text-red-500" : "text-gray-400"}`}>
                            {comment.length} / 200
                        </div>
                    </div>

                    {/* メディアアップロード */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            画像・動画ファイル (任意)
                        </label>
                        <div className="w-full px-4 py-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                disabled={isUploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <div className="text-center pointer-events-none flex flex-col items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" style={{ width: '32px', height: '32px' }} className="text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {videoFile ? (
                                    <span className="text-sm font-semibold text-blue-600">{videoFile.name} が選択されています</span>
                                ) : (
                                    <span className="text-sm text-gray-500">クリックして画像・動画を選択、またはドラッグ＆ドロップ</span>
                                )}
                            </div>
                        </div>
                    </div>


                    <button
                        onClick={handlePost}
                        disabled={isUploading}
                        className="relative w-full py-4 mt-8 overflow-hidden rounded-xl shadow-lg transition-all active:scale-95 disabled:pointer-events-none group"
                    >
                        {/* プログレスバー背景 */}
                        {isUploading && (
                            <div
                                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300 ease-out z-0"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        )}

                        {/* 通常時の背景 */}
                        <div className={`absolute top-0 left-0 w-full h-full -z-10 transition-colors duration-300 ${isUploading ? 'bg-gray-200' : 'bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700'}`} />

                        {/* テキストとアイコン */}
                        <div className={`relative z-10 flex justify-center items-center gap-2 font-bold ${isUploading ? 'text-gray-900' : 'text-white'}`}>
                            {isUploading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    送信中... ({uploadProgress}%)
                                </>
                            ) : (
                                '投稿する'
                            )}
                        </div>
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