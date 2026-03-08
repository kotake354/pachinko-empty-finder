"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const POST_TYPES = ["据え置き", "イベント", "回収", "爆出し", "今日どうだった", "明日どうする", "暇つぶし"];

export default function PostPage() {
    const [hall, setHall] = useState("");
    const [machine, setMachine] = useState("");
    const [comment, setComment] = useState("");
    const [selectedType, setSelectedType] = useState("据え置き");

    const handlePost = async () => {
        if (!hall || !machine) {
            alert("店舗名と台名を入力してください");
            return;
        }

        try {
            await addDoc(collection(db, "posts"), {
                hall,
                machine,
                comment,
                type: selectedType,
                createdAt: new Date()
            });

            alert("リアルタイム情報を共有しました！");
            setHall("");
            setMachine("");
            setComment("");
            setSelectedType("据え置き");
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("投稿に失敗しました");
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        情報を共有する
                    </h1>
                    <p className="text-gray-500">現在のホールの状況を教えてください</p>
                </div>

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
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-1.5 border-2 ${selectedType === t
                                            ? "bg-orange-500 text-white border-orange-500 shadow-lg transform scale-105 ring-4 ring-orange-100 opacity-100"
                                            : "bg-white text-gray-300 border-gray-100 opacity-30 hover:opacity-80 hover:border-gray-300 hover:text-gray-400"
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
                            店舗名
                        </label>
                        <input
                            placeholder="例: マルハン新宿店"
                            value={hall}
                            onChange={(e) => setHall(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50"
                        />
                    </div>

                    {/* 機種名 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            機種・台情報
                        </label>
                        <input
                            placeholder="例: P北斗の拳10 123番台"
                            value={machine}
                            onChange={(e) => setMachine(e.target.value)}
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 resize-none"
                        />
                    </div>

                    <button
                        onClick={handlePost}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all active:scale-95 mt-4"
                    >
                        投稿する
                    </button>
                </div>
            </div>
        </div>
    );
}