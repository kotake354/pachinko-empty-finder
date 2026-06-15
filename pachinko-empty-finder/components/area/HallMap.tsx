"use client";

import dynamic from "next/dynamic";
import type { Hall } from "@/lib/firebase/getHall";

// Leaflet はブラウザ専用（window 依存）のため SSR を無効にして読み込む
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <p className="p-4 text-sm text-gray-400">地図を読み込み中...</p>,
});

export default function HallMap({ hall }: { hall: Hall }) {
  return (
    <MapView halls={[hall]} center={[hall.lat, hall.lng]} zoom={15} height="320px" />
  );
}
