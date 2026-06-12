"use client";

import dynamic from "next/dynamic";

// Leaflet はブラウザ専用（window 依存）のため SSR を無効にして読み込む
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <p className="p-4">地図を読み込み中...</p>,
});

export default function AreaPage() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">エリアから探す</h1>
      <MapView />
    </main>
  );
}
