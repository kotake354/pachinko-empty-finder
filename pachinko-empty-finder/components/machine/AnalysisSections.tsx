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
  // 🌟 Firestore にタイトルデータがあればそれを優先し、なければデフォルトを表示します
  const getTitle = (id: string, defaultTitle: string) => {
    const sectionData = (data as any)[id];
    if (sectionData && !Array.isArray(sectionData) && sectionData.title) return sectionData.title;
    return (data as any)[`${id}-title`] || (data as any)[`${id}_title`] || defaultTitle;
  };

  const sections: Section[] = (data.sections && data.sections.length > 0) 
    ? data.sections 
    : [
    { 
      id: "ceiling", 
      title: getTitle("ceiling", "天井・ヤメ時"), 
      content: typeof data.ceiling === 'string' ? data.ceiling : undefined,
      items: Array.isArray(data.ceiling) ? data.ceiling : undefined
    },
    { 
      id: "settings", 
      title: getTitle("settings", "設定差・判別ポイント"), 
      content: typeof data.settings === 'string' ? data.settings : undefined,
      items: Array.isArray(data.settings) ? data.settings : undefined
    },
    { 
      id: "small-role", 
      title: getTitle("small-role", "小役確率・通常時のベース"), 
      content: typeof (data as any)["small-role"] === 'string' ? (data as any)["small-role"] : undefined,
      img: (data as any)["small-role-img"],
      items: Array.isArray((data as any)["small-role"]) ? (data as any)["small-role"] : undefined
    },
    { 
      id: "how-to-play", 
      title: getTitle("how-to-play", "打ち方・レア役"), 
      content: typeof (data as any)["how-to-play"] === 'string' ? (data as any)["how-to-play"] : undefined,
      img: (data as any)["how-to-play-img"],
      items: Array.isArray((data as any)["how-to-play"]) ? (data as any)["how-to-play"] : undefined
    },
    { 
      id: "basic-game", 
      title: getTitle("basic-game", "通常時・モード"), 
      content: typeof (data as any)["basic-game"] === 'string' ? (data as any)["basic-game"] : undefined,
      img: (data as any)["basic-game-img"],
      items: Array.isArray((data as any)["basic-game"]) ? (data as any)["basic-game"] : undefined
    },
    { 
      id: "cz-summary", 
      title: getTitle("cz-summary", "CZ抽選システム"), 
      content: typeof (data as any)["cz-summary"] === 'string' ? (data as any)["cz-summary"] : undefined,
      img: (data as any)["cz-summary-img"],
      items: Array.isArray((data as any)["cz-summary"]) ? (data as any)["cz-summary"] : undefined
    },
    { 
      id: "cz-1", 
      title: getTitle("cz-1", "CZ①"), 
      content: typeof (data as any)["cz-1"] === 'string' ? (data as any)["cz-1"] : undefined,
      img: (data as any)["cz-1-img"],
      items: Array.isArray((data as any)["cz-1"]) ? (data as any)["cz-1"] : undefined
    },
    { 
      id: "cz-2", 
      title: getTitle("cz-2", "CZ②"), 
      content: typeof (data as any)["cz-2"] === 'string' ? (data as any)["cz-2"] : undefined,
      img: (data as any)["cz-2-img"],
      items: Array.isArray((data as any)["cz-2"]) ? (data as any)["cz-2"] : undefined
    },
    { 
      id: "cz-3", 
      title: getTitle("cz-3", "CZ③"), 
      content: typeof (data as any)["cz-3"] === 'string' ? (data as any)["cz-3"] : undefined,
      img: (data as any)["cz-3-img"],
      items: Array.isArray((data as any)["cz-3"]) ? (data as any)["cz-3"] : undefined
    },
    { 
      id: "cz-special", 
      title: getTitle("cz-special", "特殊CZ"), 
      content: typeof (data as any)["cz-special"] === 'string' ? (data as any)["cz-special"] : undefined,
      img: (data as any)["cz-special-img"],
      items: Array.isArray((data as any)["cz-special"]) ? (data as any)["cz-special"] : undefined
    },
    { 
      id: "bonus", 
      title: getTitle("bonus", "ボーナス関連"), 
      content: typeof data.bonus === 'string' ? data.bonus : undefined,
      img: (data as any)["bonus-img"],
      items: Array.isArray(data.bonus) ? data.bonus : undefined
    },
    { 
      id: "st-main", 
      title: getTitle("st-main", "ST関連"), 
      content: typeof (data as any)["st-main"] === 'string' ? (data as any)["st-main"] : undefined,
      img: (data as any)["st-main-img"],
      items: Array.isArray((data as any)["st-main"]) ? (data as any)["st-main"] : undefined
    },
    { 
      id: "at-main", 
      title: getTitle("at-main", "AT・上位AT関連"), 
      content: typeof (data as any)["at-main"] === 'string' ? (data as any)["at-main"] : undefined,
      img: (data as any)["at-main-img"],
      items: Array.isArray((data as any)["at-main"]) ? (data as any)["at-main"] : undefined
    },
    { 
      id: "special-zone", 
      title: getTitle("special-zone", "上乗せ特化ゾーン"), 
      content: typeof data["special-zone"] === 'string' ? data["special-zone"] : undefined, 
      img: data["special-zone-img"],
      items: Array.isArray(data["special-zone"]) ? data["special-zone"] : undefined
    },
    { 
      id: "premium", 
      title: getTitle("premium", "最強特化ゾーン"), 
      content: typeof data.premium === 'string' ? data.premium : undefined, 
      img: data["premium-img"],
      items: Array.isArray(data.premium) ? data.premium : undefined
    },
    { 
      id: "long-freeze", 
      title: getTitle("long-freeze", "ロングフリーズと運命揃い"), 
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
                              {item.img.startsWith("http") || item.img.startsWith("/") ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={item.img} alt="" className="w-full h-auto object-cover" />
                              ) : (
                                <div className="w-full h-32 bg-gray-100 flex items-center justify-center p-4 text-center">
                                  <span className="text-red-500 font-bold text-[10px] break-all">
                                    {item.img}
                                  </span>
                                </div>
                              )}
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
                          {s.img.startsWith("http") || s.img.startsWith("/") ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={s.img} alt={s.title} className="w-full h-auto object-cover" />
                          ) : (
                            <div className="w-full h-32 bg-gray-100 flex items-center justify-center p-4 text-center">
                              <span className="text-red-500 font-bold text-[10px] break-all">
                                {s.img}
                              </span>
                            </div>
                          )}
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
