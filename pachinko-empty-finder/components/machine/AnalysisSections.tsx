"use client";

import { Link as ScrollLink, Element } from "react-scroll";

interface AnalysisData {
  [key: string]: any;
}

interface Section {
  id: string;
  title: string;
  content?: string;
  img?: string;
  items?: { 
    title?: string;
    text: string; 
    img?: string;
    table?: {
      headers: string[];
      rows: (string | number)[][];
    };
    tableJson?: string;
  }[];
}

export default function AnalysisSections({ data }: { data: AnalysisData }) {
  // 表示したい解析項目の定義（IDと表示名のマッピング）
  const sections: Section[] = [
    { 
      id: "ceiling", 
      title: "天井・ヤメ時", 
      content: typeof data.ceiling === 'string' ? data.ceiling : undefined,
      items: Array.isArray(data.ceiling) ? data.ceiling : undefined
    },
    { 
      id: "small-role", 
      title: "小役確率・通常時のベース", 
      content: typeof data["small-role"] === 'string' ? data["small-role"] : undefined,
      img: data["small-role-img"],
      items: Array.isArray(data["small-role"]) ? data["small-role"] : undefined
    },
    { 
      id: "how-to-play", 
      title: "打ち方・レア役", 
      content: typeof data["how-to-play"] === 'string' ? data["how-to-play"] : undefined, 
      img: data["how-to-play-img"],
      items: Array.isArray(data["how-to-play"]) ? data["how-to-play"] : undefined
    },
    { 
      id: "basic-game", 
      title: "通常時・モード", 
      content: typeof data["basic-game"] === 'string' ? data["basic-game"] : undefined, 
      img: data["basic-game-img"],
      items: Array.isArray(data["basic-game"]) ? data["basic-game"] : undefined
    },
    { 
      id: "cz-summary", 
      title: "CZ抽選システム", 
      content: typeof data["cz-summary"] === 'string' ? data["cz-summary"] : undefined, 
      img: data["cz-summary-img"],
      items: Array.isArray(data["cz-summary"]) ? data["cz-summary"] : undefined
    },
    { 
      id: "cz-1", 
      title: "CZ① (詳細)", 
      content: typeof data["cz-1"] === 'string' ? data["cz-1"] : undefined, 
      img: data["cz-1-img"],
      items: Array.isArray(data["cz-1"]) ? data["cz-1"] : undefined
    },
    { 
      id: "cz-2", 
      title: "CZ② (詳細)", 
      content: typeof data["cz-2"] === 'string' ? data["cz-2"] : undefined, 
      img: data["cz-2-img"],
      items: Array.isArray(data["cz-2"]) ? data["cz-2"] : undefined
    },
    { 
      id: "cz-3", 
      title: "CZ③ (詳細)", 
      content: typeof data["cz-3"] === 'string' ? data["cz-3"] : undefined, 
      img: data["cz-3-img"],
      items: Array.isArray(data["cz-3"]) ? data["cz-3"] : undefined
    },
    { 
      id: "cz-special", 
      title: "特殊CZ (詳細)", 
      content: typeof data["cz-special"] === 'string' ? data["cz-special"] : undefined, 
      img: data["cz-special-img"],
      items: Array.isArray(data["cz-special"]) ? data["cz-special"] : undefined
    },
    { 
      id: "bonus", 
      title: "ボーナス関連", 
      content: typeof data.bonus === 'string' ? data.bonus : undefined, 
      img: data["bonus-img"],
      items: Array.isArray(data.bonus) ? data.bonus : undefined
    },
    { 
      id: "st-main", 
      title: "ST（デッドオアアライブ）", 
      content: typeof data["st-main"] === 'string' ? data["st-main"] : undefined, 
      img: data["st-main-img"],
      items: Array.isArray(data["st-main"]) ? data["st-main"] : undefined
    },
    { 
      id: "at-main", 
      title: "AT・上位AT関連", 
      content: typeof data["at-main"] === 'string' ? data["at-main"] : undefined, 
      img: data["at-main-img"],
      items: Array.isArray(data["at-main"]) ? data["at-main"] : undefined
    },
    { 
      id: "special-zone", 
      title: "上乗せ特化ゾーン（極悪ドライブ）", 
      content: typeof data["special-zone"] === 'string' ? data["special-zone"] : undefined, 
      img: data["special-zone-img"],
      items: Array.isArray(data["special-zone"]) ? data["special-zone"] : undefined
    },
    { 
      id: "long-freeze", 
      title: "ロングフリーズと運命揃い", 
      content: typeof data["long-freeze"] === 'string' ? data["long-freeze"] : undefined, 
      img: data["long-freeze-img"],
      items: Array.isArray(data["long-freeze"]) ? data["long-freeze"] : undefined
    },
    { 
      id: "settings", 
      title: "設定差・判別ポイント", 
      content: typeof data.settings === 'string' ? data.settings : undefined,
      items: Array.isArray(data.settings) ? data.settings : undefined
    },
  ];

  return (
    <div className="mt-8 px-4 pb-8">
      {/* 1. クイックナビ（一撃風の目次ボタン） */}
      <nav className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-10">
        {sections.map((s, idx) => {
          // コンテンツが存在するかどうかを確認
          const hasContent = s.items && s.items.length > 0
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
          const hasContent = s.items && s.items.length > 0
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
                  {s.items && s.items.length > 0 ? (
                    <div className="space-y-6">
                      {s.items.map((item, i) => item.text && (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
                          {item.title && <p className="font-bold text-blue-900 mb-2">{item.title}</p>}
                          <p className={item.table || item.img ? "mb-4" : ""}>{item.text}</p>
                          
                          {/* テーブル表示機能 */}
                          {(() => {
                            let tableData = item.table;
                            if (item.tableJson) {
                              try {
                                tableData = JSON.parse(item.tableJson);
                              } catch (e) {
                                console.error("Failed to parse tableJson:", e);
                              }
                            }
                            
                            if (!tableData) return null;

                            return (
                              <div className="overflow-x-auto mb-4 rounded-lg border border-gray-200 shadow-inner">
                                <table className="w-full text-xs text-left border-collapse bg-white">
                                  <thead>
                                    <tr className="bg-gray-700 text-white">
                                      {tableData.headers.map((h, j) => (
                                        <th key={j} className="p-2.5 border border-gray-600 font-bold text-center">{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {tableData.rows.map((row, j) => (
                                      <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                                        {Array.isArray(row) ? row.map((cell, k) => (
                                          <td key={k} className="p-2.5 border border-gray-200 text-center font-medium">{cell}</td>
                                        )) : (
                                          <td colSpan={tableData!.headers.length} className="p-2.5 border border-gray-200 text-center font-medium text-red-500">Invalid row data</td>
                                        )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })()}

                          {item.img && (
                            <div className="mt-3 rounded-lg overflow-hidden shadow-sm border border-gray-200">
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
                        <div className="mt-3 rounded-lg overflow-hidden shadow-sm border border-gray-200">
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
