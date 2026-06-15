"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { getAllHalls, type Hall } from "@/lib/firebase/getHall";

// Leaflet のデフォルトマーカー画像はバンドラ環境で読み込めないため、明示的に指定する
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// バンドラによって画像 import は文字列 or { src } で返るため両対応する
const assetSrc = (img: string | { src: string }): string =>
  typeof img === "string" ? img : img.src;

const defaultIcon = L.icon({
  iconUrl: assetSrc(markerIcon),
  iconRetinaUrl: assetSrc(markerIcon2x),
  shadowUrl: assetSrc(markerShadow),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// フォールバックの中心（東京駅）
const fallbackCenter: [number, number] = [35.681236, 139.767125];

interface MapViewProps {
  halls?: Hall[]; // 指定時はその店舗だけ表示（未指定なら全店舗をFirestoreから取得）
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function MapView({
  halls: hallsProp,
  center: centerProp,
  zoom: zoomProp,
  height = "500px",
}: MapViewProps = {}) {
  const [fetchedHalls, setFetchedHalls] = useState<Hall[]>([]);

  useEffect(() => {
    if (!hallsProp) getAllHalls().then(setFetchedHalls);
  }, [hallsProp]);

  const halls = hallsProp ?? fetchedHalls;

  // 中心：指定があればそれ、なければ店舗の平均座標（無ければ東京駅）
  const center: [number, number] =
    centerProp ??
    (halls.length > 0
      ? [
          halls.reduce((s, h) => s + h.lat, 0) / halls.length,
          halls.reduce((s, h) => s + h.lng, 0) / halls.length,
        ]
      : fallbackCenter);
  const zoom = zoomProp ?? (halls.length > 0 ? 10 : 12);

  return (
    <MapContainer
      key={`${halls.length}-${center[0]}`} // 店舗読み込み後に中心を反映する
      center={center}
      zoom={zoom}
      scrollWheelZoom
      style={{ width: "100%", height }}
    >
      {/* OpenStreetMap タイル（APIキー不要・無料） */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {halls.map((hall) => (
        <Marker key={hall.id} position={[hall.lat, hall.lng]} icon={defaultIcon}>
          <Popup>
            <div className="text-sm">
              <div className="font-bold">{hall.name}</div>
              <div className="text-xs text-gray-500">
                {hall.prefecture} {hall.area}
              </div>
              <Link href={`/hall/${hall.slug}`} className="text-blue-600 underline">
                店舗ページへ →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
