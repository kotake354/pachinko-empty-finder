"use client";

import { Link as ScrollLink, Element, animateScroll as scroll } from "react-scroll";
import Image from "next/image";
import { useState, useEffect } from "react";

// =========================================
// 🌟 テーブル型の定義
// =========================================
interface TableData {
  headers: string[];
  rows: string[][];
}

interface Section {
  id: string;
  title: string;
  content?: string;
  img?: string;
  items?: { title?: string; text?: string; img?: string; table?: TableData }[];
  category?: string;
}

interface AnalysisData {
  sections?: Section[];
}

export default function AnalysisSections({ data }: { data: AnalysisData }) {
  const sections = data.sections || [];
  const [showTopBtn, setShowTopBtn] = useState(false);

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    "基本情報・スペック": true,
    "設定判別・推測ポイント": true,
  });

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => scroll.scrollToTop({ smooth: true, duration: 500 });

  if (!sections.length) return null;

  // =========================================
  // 🧠 自動カテゴリ振り分けロジック
  // =========================================
  const categoryOrder = [
    "基本情報・スペック",
    "設定判別・推測ポイント",
    "天井・リセット・朝一",
    "通常関連",
    "ボーナス・AT関連",
    "演出関連"
  ];

  const groupedSections: Record<string, Section[]> = categoryOrder.reduce((acc, cat) => {
    acc[cat] = [];
    return acc;
  }, {} as Record<string, Section[]>);

  sections.forEach(s => {
    let cat = s.category;
    if (!cat) {
      const t = s.title + s.id;
      if (t.match(/設定|判別|推測|終了画面|トロフィー/)) cat = "設定判別・推測ポイント";
      else if (t.match(/天井|リセット|朝一|ヤメ時|やめどき/)) cat = "天井・リセット・朝一";
      else if (t.match(/ボーナス|AT|ST|特化|ラッシュ|BB|ドライブ|ジャッジ/i)) cat = "ボーナス・AT関連";
      else if (t.match(/演出|フリーズ|示唆|アイキャッチ/)) cat = "演出関連";
      else if (t.match(/通常|CZ|ポイント|周期|ステージ|メーター/)) cat = "通常関連";
      else cat = "基本情報・スペック";
    }
    
    if (groupedSections[cat]) {
      groupedSections[cat].push(s);
    } else {
      if (!groupedSections["基本情報・スペック"]) groupedSections["基本情報・スペック"] = [];
      groupedSections["基本情報・スペック"].push(s);
    }
  });

  // 🌟 サイドバー＆スマホ上部ナビ用のコンポーネント
  const renderAccordionNav = () => (
    <div className="w-full flex flex-col rounded-b-lg overflow-hidden border-x border-b border-[#444] shadow-md bg-[#2b2b2b]">
      {categoryOrder.map(cat => {
        const items = groupedSections[cat];
        if (!items || items.length === 0) return null;
        const isOpen = openCategories[cat];

        return (
          <div key={cat} className="flex flex-col border-b border-[#111] last:border-b-0">
            <button
              onClick={() => toggleCategory(cat)}
              className="w-full flex justify-between items-center bg-[#1a1a1a] hover:bg-[#222] text-white px-3 py-3 font-bold text-[13px] transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-red-500 text-lg leading-none">○</span> {cat}
              </span>
              <span className="text-gray-400 text-[10px]">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="flex flex-col bg-[#2b2b2b]">
                {items.map((s, idx) => (
                  <ScrollLink
                    key={`nav-${s.id || idx}`}
                    to={s.id}
                    smooth={true}
                    offset={-100}
                    spy={true}
                    activeClass="bg-gray-700 text-white font-bold border-l-4 border-red-500"
                    className="cursor-pointer border-t border-[#3c3c3c] pl-8 pr-4 py-3 text-xs text-gray-300 hover:bg-[#333] hover:text-white transition-colors leading-relaxed"
                  >
                    {s.title}
                  </ScrollLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    // 🌟 全体のレイアウト：PCは横並び（左サイドバー、右コンテンツ）
    <div className="mt-8 px-2 md:px-4 pb-8 flex flex-col md:flex-row gap-6 items-start relative max-w-[1400px] mx-auto">
      
      {/* 📱 スマホ用：上部のアコーディオンナビ */}
      <nav className="md:hidden w-full z-10 mb-4">
        <div className="bg-[#1a1a1a] text-center font-bold text-white text-sm py-2 rounded-t-lg tracking-widest border-b-2 border-red-600">
          解析情報インデックス
        </div>
        {renderAccordionNav()}
      </nav>

      {/* 💻 PC・タブレット用：左サイドバー（固定） */}
      <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg shadow-xl scrollbar-thin scrollbar-thumb-gray-500 z-10">
        <div className="bg-[#1a1a1a] text-center font-bold text-white text-sm py-3 rounded-t-lg tracking-widest border-b-2 border-red-600">
          解析情報インデックス
        </div>
        {renderAccordionNav()}
      </aside>

      {/* 📖 右側：メインコンテンツエリア */}
      <div className="flex-1 w-full min-w-0 space-y-12 z-0">
        {categoryOrder.map(cat => {
          const items = groupedSections[cat];
          if (!items || items.length === 0) return null;

          return items.map((s, idx) => (
            <Element name={s.id} key={s.id || idx} className="scroll-mt-24">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 py-3 text-base font-black flex items-center shadow-md rounded-t-md">
                <span className="w-1.5 h-5 bg-red-500 mr-3 rounded-sm"></span>
                {s.title}
              </div>
              
              <div className="bg-white p-4 md:p-6 border-x border-b border-gray-200 shadow-sm rounded-b-md relative">
                {s.items ? (
                  // 🌟 ここがポイント！ 2列（grid）をやめて、縦1列（space-y-8）でドカンと見せる
                  <div className="space-y-8 w-full">
                    {s.items.map((item, i) => (item.text || item.img || item.table) && (
                      <div key={i} className="flex flex-col bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm">
                        {item.title && <h4 className="font-bold text-red-700 mb-3 border-b border-red-100 pb-2 text-base md:text-lg">{item.title}</h4>}
                        {item.text && <p className="text-sm md:text-base text-gray-800 flex-grow whitespace-pre-wrap leading-relaxed mb-4">{item.text}</p>}
                        
                        {/* 🌟 テーブル描画 */}
                        {item.table && (
                          <div className="overflow-x-auto w-full mb-4 rounded border border-gray-300">
                            <table className="w-full text-sm md:text-base text-left border-collapse bg-white">
                              <thead>
                                <tr className="bg-gray-800 text-white whitespace-nowrap">
                                  {item.table.headers.map((h, j) => (
                                    <th key={j} className="p-3 border border-gray-700 font-bold">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {item.table.rows.map((row, j) => (
                                  <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    {row.map((cell, k) => (
                                      <td key={k} className="p-3 border border-gray-200">{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {item.img && (
                          // 🌟 画像も1列に合わせて大きく表示（aspect-videoで16:9をキープ）
                          <div className="mt-2 rounded-md overflow-hidden border border-gray-200 relative w-full aspect-video bg-white shadow-sm max-w-4xl mx-auto">
                            {item.img.startsWith('http') || item.img.startsWith('/') ? (
                              <Image src={item.img} alt="" fill className="object-contain" loading="lazy" unoptimized />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-gray-200 text-red-500 text-xs break-all p-2">{item.img}</div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm md:text-base text-gray-800 leading-relaxed whitespace-pre-wrap w-full">
                    <p>{s.content}</p>
                    {s.img && (
                      <div className="mt-6 rounded-md overflow-hidden relative w-full aspect-video max-w-4xl mx-auto shadow-sm border border-gray-200">
                         {s.img.startsWith('http') || s.img.startsWith('/') ? (
                            <Image src={s.img} alt={s.title} fill className="object-contain" loading="lazy" unoptimized />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-200 text-red-500 text-xs break-all p-2">{s.img}</div>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Element>
          ));
        })}
      </div>

      {/* 🔝 ページTOPへ戻るボタン */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-10 right-10 z-50 p-4 bg-red-700 text-white rounded-lg shadow-2xl transition-all duration-300 flex flex-col items-center justify-center gap-1 hover:bg-red-600 active:scale-95 ${
          showTopBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <span className="text-xl">▲</span>
        <span className="text-[10px] font-bold">TOP</span>
      </button>
      
    </div>
  );
}
