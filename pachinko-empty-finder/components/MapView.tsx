"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// 初期表示の中心（東京駅）
const center: [number, number] = [35.681236, 139.767125];

export default function MapView() {
  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom
      style={{ width: "100%", height: "500px" }}
    >
      {/* OpenStreetMap タイル（APIキー不要・無料） */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={defaultIcon}>
        <Popup>東京駅周辺</Popup>
      </Marker>
    </MapContainer>
  );
}
