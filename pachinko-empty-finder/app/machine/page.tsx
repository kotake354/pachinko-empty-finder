import Link from "next/link";
import { getAllMachines } from "@/lib/firebase/getMachine";

export const revalidate = 3600; // 1時間ごとに再生成

export default async function MachinePage() {
    // 1. Firestoreから最新機種を取得
    const machines = await getAllMachines(20);

    // 2. 表示用にデータを分割（最新3件を更新情報、それ以外をポスター枠へ）
    const latestMachines = machines.slice(0, 3);
    const standardMachines = machines.length > 5 ? machines.slice(3, 8) : machines;

    const AIUEO = ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ"];

    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    {/* 左サブカラム (Sidebar) */}
                    <aside className="md:col-span-3 space-y-6">
                        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-lg p-4 text-white shadow-lg text-center">
                            <div className="text-xs font-bold opacity-80 mb-1">HALL MANAGER</div>
                            <div className="text-xl font-black italic tracking-tighter mb-2">Login</div>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 px-4 rounded-full transition-all active:scale-95 shadow-md">
                                ログインはこちら
                            </button>
                        </div>

                        <nav className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-700 text-white px-4 py-2 text-sm font-bold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                目次
                            </div>
                            <ul className="text-sm divide-y divide-gray-100">
                                {["更新情報", "新台と定番", "50音順検索", "業界ニュース"].map((item) => (
                                    <li key={item}>
                                        <a href={`#${item}`} className="block px-4 py-3 text-blue-600 hover:bg-blue-50 transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* 右メインカラム */}
                    <main className="md:col-span-9 space-y-8">
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
                                {latestMachines.length > 0 ? latestMachines.map((machine) => (
                                    <Link key={machine.id} href={`/machine/${machine.id}`} className="flex p-4 gap-4 hover:bg-blue-50/30 transition-colors group">
                                        <div className="w-24 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200 flex items-center justify-center">
                                            {machine.images?.main ? (
                                                <img src={machine.images.main} alt={machine.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <div className="text-[10px] text-gray-400 font-bold italic">NO IMAGE</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-[10px] mb-1">
                                                <span className="text-blue-600 font-bold">{machine.releaseDate || '新台'} 更新</span>
                                                <span className="text-white bg-red-600 px-1 font-bold">NEW</span>
                                                <span className={`px-1 text-white text-[8px] font-bold ${machine.category === 'slot' ? 'bg-indigo-600' : 'bg-red-500'}`}>
                                                    {machine.category === 'slot' ? 'S' : 'P'}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-blue-700 mb-1 group-hover:underline truncate">{machine.name}</h4>
                                            <p className="text-[11px] text-gray-500 line-clamp-1">
                                                {Array.isArray(machine.features) ? machine.features[0] : '機種詳細・解析情報を公開しました。'}
                                            </p>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="p-8 text-center text-gray-400 text-sm">現在、機種データが登録されていません。</div>
                                )}
                            </div>
                        </section>

                        {/* 新台・定番機種セクション */}
                        <section id="新台と定番" className="space-y-4">
                            <h2 className="bg-blue-900 text-white px-4 py-2 font-bold flex items-center gap-2 rounded">
                                <span className="text-yellow-400">▼</span> 注目の新台・人気機種
                            </h2>
                            {standardMachines.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {standardMachines.map((machine) => (
                                        <Link key={machine.id} href={`/machine/${machine.id}`} className="group flex flex-col items-center">
                                            <div className="relative w-full aspect-[11/18] bg-gray-200 rounded shadow-sm overflow-hidden border border-gray-100 flex items-center justify-center">
                                                {machine.images?.main ? (
                                                    <img src={machine.images.main} alt={machine.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="text-[10px] text-gray-400 font-bold italic">NO IMAGE</div>
                                                )}
                                                <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 z-10">新台</div>
                                            </div>
                                            <span className="mt-2 text-[11px] font-bold text-blue-700 text-center leading-tight group-hover:underline line-clamp-2">
                                                {machine.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded p-8 text-center text-gray-400 text-xs">
                                    さらに多くの機種が準備中です...
                                </div>
                            )}
                        </section>

                        {/* 50音検索パネル */}
                        <section id="50音順検索" className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-[#f0f0f0] border-b border-gray-200 px-4 py-2 text-sm font-bold text-gray-700">
                                機種名 50音順で探す
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