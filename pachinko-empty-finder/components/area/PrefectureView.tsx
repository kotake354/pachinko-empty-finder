"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PrefectureInfo } from "@/lib/prefectures";
import type { Hall } from "@/lib/firebase/getHall";

export default function PrefectureView({
  info,
  halls,
}: {
  info: PrefectureInfo;
  halls: Hall[];
}) {
  const [q, setQ] = useState("");

  // 店名・住所・地域でライブ絞り込み
  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return halls;
    return halls.filter((h) =>
      [h.name, h.address, h.area].some((v) => (v || "").toLowerCase().includes(keyword))
    );
  }, [q, halls]);

  const cities = useMemo(
    () => Array.from(new Set(halls.map((h) => h.area))),
    [halls]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー：県名＋検索ボックス */}
      <div className="border-b-4 border-red-600 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center">
          <h1 className="whitespace-nowrap text-2xl font-black text-gray-800">
            {info.fullName}
          </h1>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`${info.fullName}のパチンコ店名・住所から検索`}
            className="w-full rounded border border-gray-300 px-4 py-2 text-sm outline-none focus:border-red-400"
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* 集計 */}
        <div className="mb-6 flex flex-wrap gap-2 text-sm">
          <span className="rounded border border-gray-300 bg-white px-3 py-1.5">
            {info.fullName}すべて{" "}
            <span className="font-bold text-red-600">{halls.length}</span> 店舗
          </span>
          <span className="rounded border border-gray-300 bg-white px-3 py-1.5 text-gray-500">
            地域数 <span className="font-bold text-red-600">{cities.length}</span>
          </span>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* 地域から探す */}
          <section>
            <div className="mb-3 bg-gray-700 px-3 py-2 text-sm font-bold text-white">
              地域から探す
            </div>
            {cities.length > 0 ? (
              <ul className="divide-y divide-gray-100 rounded-b border border-gray-200 bg-white">
                {cities.map((city) => (
                  <li key={city}>
                    <Link
                      href={`/area/${info.slug}/${encodeURIComponent(city)}`}
                      className="block px-4 py-3 text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      {city}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-b border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">
                登録地域がありません。
              </div>
            )}
          </section>

          {/* 店舗一覧（検索結果） */}
          <section>
            <div className="mb-3 flex items-center justify-between bg-red-700 px-3 py-2 text-sm font-bold text-white">
              <span>店舗一覧</span>
              <span>{filtered.length} 店舗</span>
            </div>
            {filtered.length > 0 ? (
              <ul className="max-h-96 divide-y divide-gray-100 overflow-y-auto rounded-b border border-gray-200 bg-white">
                {filtered.map((hall) => (
                  <li key={hall.id}>
                    <Link
                      href={`/hall/${hall.slug}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-red-50/40"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-[9px] font-bold italic text-gray-400">
                        NO IMG
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-bold text-red-700">{hall.name}</div>
                        <div className="text-xs text-gray-500">
                          {hall.area}
                          {hall.address ? ` ${hall.address}` : ""}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-b border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">
                {q
                  ? `「${q}」に一致する店舗がありません。`
                  : "この都道府県の店舗はまだ登録されていません。"}
              </div>
            )}
          </section>
        </div>

        <div className="mt-8">
          <Link href="/area" className="text-sm text-blue-600 hover:underline">
            ← 全国の地図に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
