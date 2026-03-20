"use client";

import Link from "next/link";
import { useState } from "react";

// ダミーデータ
const UPDATE_INFO = [
    {
        id: "1",
        date: "2026.03.19.(木)",
        type: "slot",
        title: "Lアクダマドライブ",
        content: "機種ページを公開。ATとSTの強力ループが魅力！",
        isNew: true,
        thumbnail: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=200&h=112&fit=crop"
    },
    {
        id: "2",
        date: "2026.03.19.(木)",
        type: "slot",
        title: "スマスロ 甲鉄城のカバネリ 海門（うなと）決戦",
        content: "通常時の演出法則を大量更新！【アイキャッチの示唆等】",
        isNew: true,
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=112&fit=crop"
    },
    {
        id: "3",
        date: "2026.03.18.(水)",
        type: "pachinko",
        title: "eリコリス・リコイル",
        content: "大人気アニメがパチンコで登場！初当たり確率約1/259！",
        isNew: true,
        thumbnail: "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?w=200&h=112&fit=crop"
    }
];

const STANDARD_MACHINES = [
    { id: "1", name: "カバネリ2 (スマスロ)", isNew: true, thumbnail: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=110&h=180&fit=crop" },
    { id: "2", name: "サンダー (スマスロ)", isNew: true, thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=110&h=180&fit=crop" },
    { id: "3", name: "攻殻機動隊 (スマスロ)", isNew: false, thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=110&h=180&fit=crop" },
    { id: "4", name: "ハナビ (スマスロ)", isNew: false, thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=110&h=180&fit=crop" },
    { id: "5", name: "新鬼武者3 (スマスロ)", isNew: false, thumbnail: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=110&h=180&fit=crop" },
];

const AIUEO = ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ"];

export default function MachinePage() {
    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    {/* 左サブカラム (Sidebar) */}
                    <aside className="md:col-span-3 space-y-6">
                        {/* ホールマネージャー風バナー */}
                        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-lg p-4 text-white shadow-lg text-center">
                            <div className="text-xs font-bold opacity-80 mb-1">HALL MANAGER</div>
                            <div className="text-xl font-black italic tracking-tighter mb-2">Login</div>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 px-4 rounded-full transition-all active:scale-95 shadow-md">
                                ログインはこちら
                            </button>
                        </div>

                        {/* 目次 */}
                        <nav className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-700 text-white px-4 py-2 text-sm font-bold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                目次
                            </div>
                            <ul className="text-sm divide-y divide-gray-100">
                                {["更新情報", "スロット新台と定番", "パチンコ新台と定番", "50音順検索", "業界ニュース"].map((item) => (
                                    <li key={item}>
                                        <a href={`#${item}`} className="block px-4 py-3 text-blue-600 hover:bg-blue-50 transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* コンテンツリスト */}
                        <nav className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-blue-800 text-white px-4 py-2 text-sm font-bold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                コンテンツリスト
                            </div>
                            <ul className="text-sm">
                                {["一撃トップ", "スロット", "パチンコ", "新台カレンダー", "業界ニュース", "店舗情報"].map((item) => (
                                    <li key={item} className="border-b last:border-0 border-gray-100">
                                        <Link href="#" className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 group">
                                            <span className="font-medium text-gray-700">{item}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* 右メインカラム */}
                    <main className="md:col-span-9 space-y-8">
                        {/* クイックナビカード */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { name: "スロット", color: "from-blue-600 to-blue-800" },
                                { name: "パチンコ", color: "from-blue-600 to-blue-800" },
                                { name: "新台カレンダー", color: "from-blue-500 to-blue-700" },
                                { name: "業界ニュース", color: "from-blue-500 to-blue-700" }
                            ].map((nav) => (
                                <button key={nav.name} className={`h-14 bg-gradient-to-r ${nav.color} text-white font-bold rounded shadow-md border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all`}>
                                    {nav.name}
                                </button>
                            ))}
                        </div>

                        {/* 更新情報セクション */}
                        <section id="更新情報" className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-blue-900 text-white px-4 py-2 font-bold flex items-center gap-2">
                                <span className="text-yellow-400">▼</span> パチンコ・スロット更新情報
                            </div>
                            <div className="divide-y divide-gray-100">
                                {UPDATE_INFO.map((update) => (
                                    <Link key={update.id} href="#" className="flex p-4 gap-4 hover:bg-blue-50/30 transition-colors group">
                                        <div className="w-24 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                            <img src={update.thumbnail} alt={update.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-[10px] mb-1">
                                                <span className="text-blue-600 font-bold">{update.date} 更新</span>
                                                {update.isNew && <span className="text-white bg-red-600 px-1 font-bold">NEW</span>}
                                                <span className={`px-1 text-white text-[8px] font-bold ${update.type === 'slot' ? 'bg-indigo-600' : 'bg-red-500'}`}>
                                                    {update.type === 'slot' ? 'S' : 'P'}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-blue-700 mb-1 group-hover:underline truncate">{update.title}</h4>
                                            <p className="text-[11px] text-gray-500 line-clamp-1">{update.content}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* 今週の新台タググリッド */}
                        <section id="スロット新台と定番" className="space-y-4">
                            <h2 className="bg-blue-900 text-white px-4 py-2 font-bold flex items-center gap-2 rounded">
                                <span className="text-yellow-400">▼</span> スロット・パチスロ 今週の新台と定番機種
                            </h2>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {STANDARD_MACHINES.map((machine) => (
                                    <Link key={machine.id} href="#" className="group flex flex-col items-center">
                                        <div className="relative w-full aspect-[11/18] bg-gray-200 rounded shadow-sm overflow-hidden border border-gray-100">
                                            <img src={machine.thumbnail} alt={machine.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            {machine.isNew && (
                                                <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 z-10">新台</div>
                                            )}
                                        </div>
                                        <span className="mt-2 text-[11px] font-bold text-blue-700 text-center leading-tight group-hover:underline">
                                            {machine.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* 50音検索パネル */}
                        <section id="50音順検索" className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-[#f0f0f0] border-b border-gray-200 px-4 py-2 text-sm font-bold text-gray-700">
                                機種名 50音順（スロット・パチスロ）
                            </div>
                            <div className="p-4 grid grid-cols-5 gap-1">
                                {AIUEO.map((char) => (
                                    <button key={char} className="h-10 border border-gray-200 flex items-center justify-center text-sm font-bold text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all">
                                        {char}
                                    </button>
                                ))}
                            </div>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}