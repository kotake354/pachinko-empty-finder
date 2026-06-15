"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Hall } from "@/lib/firebase/getHall";

/**
 * 店舗情報の自動スクロールリスト。
 * - 通常は自動で下方向にスクロール（リストを2連結して無限ループ）
 * - マウスを乗せる/タッチ中は自動停止し、ホイールやドラッグで手動スクロールできる
 */
export default function AutoScrollHalls({ halls }: { halls: Hall[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const SPEED = 0.15; // 1フレームあたりの移動量（小さいほど遅い）
    let raf = 0;
    let pos = el.scrollTop; // floatで累積（ブラウザの丸めで止まらないように）

    const step = () => {
      if (el.scrollHeight > el.clientHeight) {
        if (pausedRef.current) {
          pos = el.scrollTop; // 手動スクロールに追従
        } else {
          const half = el.scrollHeight / 2; // 2連結の半分でループ
          pos += SPEED;
          if (pos >= half) pos -= half;
          el.scrollTop = pos;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [halls.length]);

  const pause = () => (pausedRef.current = true);
  const resume = () => (pausedRef.current = false);

  // 2連結して無限ループに見せる
  const items = [...halls, ...halls];

  return (
    <div
      ref={ref}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      className="no-scrollbar h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white"
    >
      <div className="divide-y divide-gray-100">
        {items.map((hall, i) => (
          <Link
            key={`${hall.id}-${i}`}
            href={`/hall/${hall.slug}`}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-red-50/40"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-[9px] font-bold italic text-gray-400">
              NO IMG
            </div>
            <div className="min-w-0">
              <div className="truncate font-bold text-red-700">{hall.name}</div>
              <div className="text-xs text-gray-500">
                {hall.prefecture} {hall.area}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
