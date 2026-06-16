"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { hallImageUrl, type Hall } from "@/lib/firebase/getHall";

// 全国の店舗を横断検索（店名・住所・地域・都道府県）
export default function NationwideSearch({ halls }: { halls: Hall[] }) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return [];
    return halls.filter((h) =>
      [h.name, h.address, h.area, h.prefecture].some((v) =>
        (v || "").toLowerCase().includes(keyword)
      )
    );
  }, [q, halls]);

  return (
    <div className="mb-6">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="全国の店舗を検索（店名・住所・地域）"
          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-red-400"
        />
      </div>

      {/* 入力時のみ結果を表示 */}
      {q.trim() && (
        <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between bg-red-700 px-3 py-2 text-sm font-bold text-white">
            <span>検索結果</span>
            <span>{results.length} 店舗</span>
          </div>
          {results.length > 0 ? (
            <ul className="max-h-96 divide-y divide-gray-100 overflow-y-auto">
              {results.map((hall) => (
                <li key={hall.id}>
                  <Link
                    href={`/hall/${hall.slug}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-red-50/40"
                  >
                    {hallImageUrl(hall) ? (
                      <img
                        src={hallImageUrl(hall)!}
                        alt={hall.name}
                        className="h-10 w-10 flex-shrink-0 rounded object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-[9px] font-bold italic text-gray-400">
                        NO IMG
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-bold text-red-700">{hall.name}</div>
                      <div className="text-xs text-gray-500">
                        {hall.prefecture} {hall.area}
                        {hall.address ? ` ${hall.address}` : ""}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-sm text-gray-400">
              「{q}」に一致する店舗がありません。
            </div>
          )}
        </div>
      )}
    </div>
  );
}
