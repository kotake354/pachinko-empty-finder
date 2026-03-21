"use client";

import { Link as ScrollLink, Element } from "react-scroll";

interface AnalysisData {
  [key: string]: any;
}

export default function AnalysisSections({ data }: { data: AnalysisData }) {
  // 表示したい解析項目の定義（IDと表示名のマッピング）
  const sections = [
    { id: "ceiling", title: "天井・ヤメ時", content: data.ceiling },
    { id: "how-to-play", title: "打ち方・レア役", content: data["how-to-play"], img: data["how-to-play-img"] },
    { id: "basic-game", title: "通常時・モード", content: data["basic-game"], img: data["basic-game-img"] },
    { id: "cz-summary", title: "CZ抽選システム", content: data["cz-summary"], img: data["cz-summary-img"] },
    { id: "cz-1", title: "CZ① (詳細)", content: data["cz-1"], img: data["cz-1-img"] },
    { id: "cz-2", title: "CZ② (詳細)", content: data["cz-2"], img: data["cz-2-img"] },
    { id: "cz-3", title: "CZ③ (詳細)", content: data["cz-3"], img: data["cz-3-img"] },
    { id: "cz-special", title: "特殊CZ (詳細)", content: data["cz-special"], img: data["cz-special-img"] },
    { id: "bonus", title: "ボーナス関連", content: data.bonus, img: data["bonus-img"] },
    { id: "st-main", title: "ST（デッドオアアライブ）", content: data["st-main"], img: data["st-main-img"] },
    { id: "at-main", title: "AT・上位AT関連", content: data["at-main"], img: data["at-main-img"] },
    { id: "special-zone", title: "上乗せ特化ゾーン（極悪ドライブ）", content: data["special-zone"], img: data["special-zone-img"] },
    { id: "settings", title: "設定差・判別ポイント", content: data.settings },
  ];

  return (
    <div className="mt-8 px-4 pb-8">
      {/* 1. クイックナビ（一撃風の目次ボタン） */}
      <nav className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-10">
        {sections.map((s, idx) => {
          // コンテンツが存在するかどうかを確認
          const hasContent = s.items
            ? s.items.some(item => item.text)
            : !!s.content;

          return hasContent ? (
            <ScrollLink
              key={s.id || idx}
              to={s.id}
              smooth={true}
              offset={-70}
              className="cursor-pointer bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 text-[11px] font-bold py-3 px-2 rounded-lg text-center transition-all border border-gray-200 shadow-sm"
            >
              {s.title}
            </ScrollLink>
          ) : null;
        })}
      </nav>

      {/* 2. 各解析コンテンツのレンダリング */}
      <div className="space-y-12">
        {sections.map((s, idx) => {
          const hasContent = s.items
            ? s.items.some(item => item.text)
            : !!s.content;

          return hasContent ? (
            <Element name={s.id} key={s.id || idx} className="scroll-mt-20">
              {/* ヘッダー部分：一撃のあの重厚な感じ */}
              <div className="bg-gray-800 text-white px-4 py-2 text-sm font-black flex items-center justify-between shadow-sm">
                <span className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded tracking-wider">解析</span>
                  {s.title}
                </span>
                <span className="text-[10px] opacity-70 font-bold tracking-widest">ANALYSIS DATA</span>
              </div>
              
              <div className="bg-white overflow-hidden border-x border-b border-gray-200 shadow-sm">
                <div className="p-5 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {s.items ? (
                    <div className="space-y-6">
                      {s.items.map((item, i) => item.text && (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
                          <p>{item.text}</p>
                          {item.img && (
                            <div className="mt-3 rounded-lg overflow-hidden shadow-sm">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.img} alt="" className="w-full h-auto object-cover" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
                      <p>{s.content}</p>
                      {s.img && (
                        <div className="mt-3 rounded-lg overflow-hidden shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.img} alt={s.title} className="w-full h-auto object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Element>
          ) : null;
        })}
      </div>
    </div>
  );
}
