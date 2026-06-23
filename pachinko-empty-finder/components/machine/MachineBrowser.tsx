"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Machine } from "@/lib/firebase/getMachine";

// 「2026年4月6日」形式の文字列を比較・新着判定用のタイムスタンプに変換する
function parseReleaseDate(s?: string): number {
  if (!s) return 0;
  const m = s.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
}

// 新台とみなす期間（最新機種の発売日からこの日数以内）
const NEW_WINDOW_DAYS = 120;

type Category = "all" | "slot" | "pachinko";

export default function MachineBrowser({ machines }: { machines: Machine[] }) {
  const [category, setCategory] = useState<Category>("all");
  const [queryText, setQueryText] = useState("");

  // 発売日の新しい順に整列し、新台フラグを付与
  const enriched = useMemo(() => {
    const withTs = machines.map((m) => ({ m, ts: parseReleaseDate(m.releaseDate) }));
    withTs.sort((a, b) => b.ts - a.ts);
    const newest = withTs[0]?.ts ?? 0;
    const threshold = newest - NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    return withTs.map(({ m, ts }) => ({ ...m, isNew: ts > 0 && ts >= threshold }));
  }, [machines]);

  const counts = useMemo(
    () => ({
      all: enriched.length,
      slot: enriched.filter((m) => m.category === "slot").length,
      pachinko: enriched.filter((m) => m.category === "pachinko").length,
    }),
    [enriched]
  );

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    return enriched.filter((m) => {
      if (category !== "all" && m.category !== category) return false;
      if (!q) return true;
      return (
        m.name?.toLowerCase().includes(q) ||
        m.maker?.toLowerCase().includes(q) ||
        m.modelName?.toLowerCase().includes(q)
      );
    });
  }, [enriched, category, queryText]);

  // 新台帯（検索なし・全カテゴリのときだけ）
  const newReleases = useMemo(
    () => enriched.filter((m) => m.isNew).slice(0, 8),
    [enriched]
  );
  const showNewStrip = category === "all" && !queryText.trim() && newReleases.length > 0;

  const tabs: { key: Category; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "slot", label: "スロット" },
    { key: "pachinko", label: "パチンコ" },
  ];

  return (
    <div className="space-y-6">
      {/* 検索＋カテゴリタブ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setCategory(t.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                category === t.key
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-500 hover:text-indigo-600"
              }`}
            >
              {t.label}
              <span className={`ml-1.5 text-xs ${category === t.key ? "text-indigo-200" : "text-slate-400"}`}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="機種名・メーカーで検索"
            className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* 新台帯（横スクロール） */}
      {showNewStrip && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-400 px-2 py-0.5 text-xs font-black text-amber-950">
              NEW
            </span>
            <h2 className="text-sm font-black tracking-wide text-slate-700">新台ピックアップ</h2>
          </div>
          <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
            {newReleases.map((m) => (
              <Link
                key={m.id}
                href={`/machine/${m.id}`}
                className="group w-32 flex-shrink-0"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
                  {m.images?.main ? (
                    <img
                      src={m.images.main}
                      alt={m.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] font-bold italic text-slate-400">
                      NO IMAGE
                    </div>
                  )}
                  <span className="absolute left-1.5 top-1.5 rounded bg-amber-400 px-1.5 py-0.5 text-[9px] font-black text-amber-950">
                    新台
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[11px] font-bold leading-tight text-slate-700 group-hover:text-indigo-600">
                  {m.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 機種カードグリッド */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((m) => (
            <Link
              key={m.id}
              href={`/machine/${m.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                {m.images?.main ? (
                  <img
                    src={m.images.main}
                    alt={m.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-bold italic text-slate-400">
                    NO IMAGE
                  </div>
                )}
                {/* カテゴリチップ（S/P） */}
                <span
                  className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md text-xs font-black text-white shadow ${
                    m.category === "slot" ? "bg-indigo-600" : "bg-rose-600"
                  }`}
                >
                  {m.category === "slot" ? "S" : "P"}
                </span>
                {m.isNew && (
                  <span className="absolute right-2 top-2 rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-black text-amber-950 shadow">
                    NEW
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h3 className="line-clamp-2 text-sm font-black leading-tight text-slate-800 group-hover:text-indigo-600">
                  {m.name}
                </h3>
                <p className="mt-1 truncate text-[11px] text-slate-500">{m.maker}</p>
                {m.releaseDate && (
                  <p className="mt-0.5 text-[11px] font-medium text-slate-400">{m.releaseDate}</p>
                )}
                {Array.isArray(m.type) && m.type.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.type.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-400">
          {queryText.trim()
            ? `「${queryText}」に一致する機種は見つかりませんでした。`
            : "このカテゴリの機種はまだ登録されていません。"}
        </div>
      )}
    </div>
  );
}
