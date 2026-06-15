"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, collection, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { PREFECTURES_INFO } from "@/lib/prefectures";
import type { Hall } from "@/lib/firebase/getHall";

const PREF_LIST = Object.values(PREFECTURES_INFO);

export default function HallForm({ ownerId, hall }: { ownerId: string; hall?: Hall }) {
  const router = useRouter();
  const isEdit = !!hall;

  const [name, setName] = useState(hall?.name ?? "");
  const [prefecture, setPrefecture] = useState(hall?.prefecture ?? "");
  const [area, setArea] = useState(hall?.area ?? "");
  const [address, setAddress] = useState(hall?.address ?? "");
  const [lat, setLat] = useState(hall?.lat?.toString() ?? "");
  const [lng, setLng] = useState(hall?.lng?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !prefecture || !area.trim()) {
      setError("店名・都道府県・地域（市区）は必須です。");
      return;
    }
    const latN = parseFloat(lat);
    const lngN = parseFloat(lng);
    if (Number.isNaN(latN) || Number.isNaN(lngN)) {
      setError("緯度・経度を数値で入力してください（Googleマップで右クリック→座標をコピー）。");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (isEdit && hall) {
        await updateDoc(doc(db, "halls", hall.id), {
          name: name.trim(),
          prefecture,
          area: area.trim(),
          address: address.trim() || null,
          lat: latN,
          lng: lngN,
        });
      } else {
        // 自動生成IDをそのまま slug（=docId）として使う
        const ref = doc(collection(db, "halls"));
        await setDoc(ref, {
          name: name.trim(),
          prefecture,
          area: area.trim(),
          address: address.trim() || null,
          lat: latN,
          lng: lngN,
          slug: ref.id,
          ownerId,
          createdAt: serverTimestamp(),
        });
      }
      router.push("/owner");
    } catch (err) {
      console.error("Error saving hall:", err);
      setError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  const field = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">
          店名 <span className="text-red-500">*</span>
        </label>
        <input value={name} onChange={(e) => setName(e.target.value)} disabled={saving} className={field} placeholder="例: マルハン柏店" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            都道府県 <span className="text-red-500">*</span>
          </label>
          <select value={prefecture} onChange={(e) => setPrefecture(e.target.value)} disabled={saving} className={field}>
            <option value="">選択してください</option>
            {PREF_LIST.map((p) => (
              <option key={p.slug} value={p.fullName}>
                {p.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            地域・市区 <span className="text-red-500">*</span>
          </label>
          <input value={area} onChange={(e) => setArea(e.target.value)} disabled={saving} className={field} placeholder="例: 柏" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">住所（番地など）</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} disabled={saving} className={field} placeholder="例: 末広町1-1" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            緯度 (lat) <span className="text-red-500">*</span>
          </label>
          <input value={lat} onChange={(e) => setLat(e.target.value)} disabled={saving} className={field} placeholder="35.8623" inputMode="decimal" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            経度 (lng) <span className="text-red-500">*</span>
          </label>
          <input value={lng} onChange={(e) => setLng(e.target.value)} disabled={saving} className={field} placeholder="139.9707" inputMode="decimal" />
        </div>
      </div>
      <p className="text-xs text-gray-400">
        ※ 緯度・経度は Googleマップで店舗を右クリック →「座標をコピー」で取得できます（地図表示に使用）。
      </p>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-bold text-white transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:opacity-60"
        >
          {saving ? "保存中..." : isEdit ? "更新する" : "登録する"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/owner")}
          disabled={saving}
          className="rounded-xl border border-gray-300 px-6 font-bold text-gray-600 hover:bg-gray-50"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
