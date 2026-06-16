"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, collection, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { PREFECTURES_INFO } from "@/lib/prefectures";
import { textColorFor, type Hall } from "@/lib/firebase/getHall";

const PREF_LIST = Object.values(PREFECTURES_INFO);

// Worker のメディア配信URL（既存画像のプレビュー用）
const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "";
const mediaBase = workerUrl.endsWith("/") ? workerUrl.slice(0, -1) : workerUrl;

const field =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
const labelCls = "mb-1 block text-sm font-semibold text-gray-700";

export default function HallForm({ ownerId, hall }: { ownerId: string; hall?: Hall }) {
  const router = useRouter();
  const isEdit = !!hall;

  // 基本
  const [name, setName] = useState(hall?.name ?? "");
  const [prefecture, setPrefecture] = useState(hall?.prefecture ?? "");
  const [area, setArea] = useState(hall?.area ?? "");
  const [address, setAddress] = useState(hall?.address ?? "");
  const [lat, setLat] = useState(hall?.lat?.toString() ?? "");
  const [lng, setLng] = useState(hall?.lng?.toString() ?? "");
  // 営業情報
  const [openTime, setOpenTime] = useState(hall?.openTime ?? "");
  const [closeTime, setCloseTime] = useState(hall?.closeTime ?? "");
  const [holiday, setHoliday] = useState(hall?.holiday ?? "");
  const [phone, setPhone] = useState(hall?.phone ?? "");
  // 設備・アクセス
  const [pachinkoCount, setPachinkoCount] = useState(hall?.pachinkoCount?.toString() ?? "");
  const [slotCount, setSlotCount] = useState(hall?.slotCount?.toString() ?? "");
  const [parking, setParking] = useState(hall?.parking ?? "");
  const [nearestStation, setNearestStation] = useState(hall?.nearestStation ?? "");
  // 紹介・リンク
  const [description, setDescription] = useState(hall?.description ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(hall?.websiteUrl ?? "");
  const [snsUrl, setSnsUrl] = useState(hall?.snsUrl ?? "");
  // 画像
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // デザイン
  const [themeColor, setThemeColor] = useState(hall?.themeColor ?? "#b91c1c");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const currentImageUrl =
    hall?.imageFileName && mediaBase ? `${mediaBase}/?file=${hall.imageFileName}` : null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  // 画像をR2へアップロードし、保存するファイル名を返す
  const uploadImage = async (file: File): Promise<string> => {
    const contentType = file.type || "application/octet-stream";
    const res = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, contentType }),
    });
    if (!res.ok) throw new Error("画像アップロードURLの取得に失敗しました。");
    const { uploadUrl, fileName } = await res.json();
    const put = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    });
    if (!put.ok) throw new Error("画像のアップロードに失敗しました。");
    return fileName as string;
  };

  const numOrNull = (v: string) => {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? null : n;
  };

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
      // 画像が選ばれていればR2へアップロードし、古い画像は削除
      let imageFileName: string | null = hall?.imageFileName ?? null;
      if (imageFile) {
        imageFileName = await uploadImage(imageFile);
        if (hall?.imageFileName) {
          fetch("/api/delete-media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: hall.imageFileName }),
          }).catch(() => {});
        }
      }

      const data = {
        name: name.trim(),
        prefecture,
        area: area.trim(),
        address: address.trim() || null,
        lat: latN,
        lng: lngN,
        openTime: openTime.trim() || null,
        closeTime: closeTime.trim() || null,
        holiday: holiday.trim() || null,
        phone: phone.trim() || null,
        pachinkoCount: numOrNull(pachinkoCount),
        slotCount: numOrNull(slotCount),
        parking: parking || null,
        nearestStation: nearestStation.trim() || null,
        description: description.trim() || null,
        websiteUrl: websiteUrl.trim() || null,
        snsUrl: snsUrl.trim() || null,
        imageFileName,
        themeColor: themeColor || null,
      };

      if (isEdit && hall) {
        await updateDoc(doc(db, "halls", hall.id), data);
      } else {
        const ref = doc(collection(db, "halls"));
        await setDoc(ref, { ...data, slug: ref.id, ownerId, createdAt: serverTimestamp() });
      }
      router.push("/owner");
    } catch (err) {
      console.error("Error saving hall:", err);
      setError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* 基本情報 */}
      <section className="space-y-4">
        <h2 className="border-b border-gray-200 pb-1 text-sm font-bold text-gray-500">基本情報</h2>
        <div>
          <label className={labelCls}>
            店名 <span className="text-red-500">*</span>
          </label>
          <input value={name} onChange={(e) => setName(e.target.value)} disabled={saving} className={field} placeholder="例: マルハン柏店" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
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
            <label className={labelCls}>
              地域・市区 <span className="text-red-500">*</span>
            </label>
            <input value={area} onChange={(e) => setArea(e.target.value)} disabled={saving} className={field} placeholder="例: 柏" />
          </div>
        </div>
        <div>
          <label className={labelCls}>住所（番地など）</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} disabled={saving} className={field} placeholder="例: 末広町1-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
              緯度 (lat) <span className="text-red-500">*</span>
            </label>
            <input value={lat} onChange={(e) => setLat(e.target.value)} disabled={saving} className={field} placeholder="35.8623" inputMode="decimal" />
          </div>
          <div>
            <label className={labelCls}>
              経度 (lng) <span className="text-red-500">*</span>
            </label>
            <input value={lng} onChange={(e) => setLng(e.target.value)} disabled={saving} className={field} placeholder="139.9707" inputMode="decimal" />
          </div>
        </div>
        <p className="text-xs text-gray-400">
          ※ 緯度・経度は Googleマップで店舗を右クリック →「座標をコピー」で取得できます。
        </p>
      </section>

      {/* 営業情報 */}
      <section className="space-y-4">
        <h2 className="border-b border-gray-200 pb-1 text-sm font-bold text-gray-500">営業情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>開店時間</label>
            <input value={openTime} onChange={(e) => setOpenTime(e.target.value)} disabled={saving} className={field} placeholder="10:00" />
          </div>
          <div>
            <label className={labelCls}>閉店時間</label>
            <input value={closeTime} onChange={(e) => setCloseTime(e.target.value)} disabled={saving} className={field} placeholder="22:45" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>定休日</label>
            <input value={holiday} onChange={(e) => setHoliday(e.target.value)} disabled={saving} className={field} placeholder="年中無休" />
          </div>
          <div>
            <label className={labelCls}>電話番号</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={saving} className={field} placeholder="04-1234-5678" inputMode="tel" />
          </div>
        </div>
      </section>

      {/* 設備・アクセス */}
      <section className="space-y-4">
        <h2 className="border-b border-gray-200 pb-1 text-sm font-bold text-gray-500">設備・アクセス</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>パチンコ台数</label>
            <input value={pachinkoCount} onChange={(e) => setPachinkoCount(e.target.value)} disabled={saving} className={field} placeholder="300" inputMode="numeric" />
          </div>
          <div>
            <label className={labelCls}>スロット台数</label>
            <input value={slotCount} onChange={(e) => setSlotCount(e.target.value)} disabled={saving} className={field} placeholder="200" inputMode="numeric" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>駐車場</label>
            <select value={parking} onChange={(e) => setParking(e.target.value)} disabled={saving} className={field}>
              <option value="">未設定</option>
              <option value="あり">あり</option>
              <option value="提携あり">提携あり</option>
              <option value="なし">なし</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>最寄り駅</label>
            <input value={nearestStation} onChange={(e) => setNearestStation(e.target.value)} disabled={saving} className={field} placeholder="柏駅 徒歩5分" />
          </div>
        </div>
      </section>

      {/* 紹介・リンク */}
      <section className="space-y-4">
        <h2 className="border-b border-gray-200 pb-1 text-sm font-bold text-gray-500">紹介・リンク</h2>
        <div>
          <label className={labelCls}>店舗紹介文</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={saving} rows={4} className={`${field} resize-none`} placeholder="店舗のPRや特徴を入力" />
        </div>
        <div>
          <label className={labelCls}>公式サイトURL</label>
          <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} disabled={saving} className={field} placeholder="https://example.com" inputMode="url" />
        </div>
        <div>
          <label className={labelCls}>SNS URL（X / Instagram など）</label>
          <input value={snsUrl} onChange={(e) => setSnsUrl(e.target.value)} disabled={saving} className={field} placeholder="https://x.com/..." inputMode="url" />
        </div>
      </section>

      {/* デザイン */}
      <section className="space-y-3">
        <h2 className="border-b border-gray-200 pb-1 text-sm font-bold text-gray-500">デザイン</h2>
        <label className={labelCls}>ページの背景色（テーマカラー）</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            disabled={saving}
            className="h-10 w-16 cursor-pointer rounded border border-gray-200 bg-white"
          />
          <span className="font-mono text-sm text-gray-600">{themeColor}</span>
          <button
            type="button"
            onClick={() => setThemeColor("#b91c1c")}
            className="ml-auto rounded border border-gray-300 px-3 py-1 text-xs font-bold text-gray-500 hover:bg-gray-50"
          >
            既定に戻す
          </button>
        </div>
        {/* プレビュー */}
        <div className="flex items-center rounded-lg px-4 py-3" style={{ backgroundColor: themeColor }}>
          <span className="font-black" style={{ color: textColorFor(themeColor) }}>
            {name || "店名のプレビュー"}
          </span>
        </div>
      </section>

      {/* 店舗画像 */}
      <section className="space-y-3">
        <h2 className="border-b border-gray-200 pb-1 text-sm font-bold text-gray-500">
          店舗画像（外観）
        </h2>
        {(previewUrl || currentImageUrl) && (
          <img
            src={previewUrl || currentImageUrl || ""}
            alt="店舗画像プレビュー"
            className="max-h-48 w-full rounded-lg border border-gray-200 object-contain"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={saving}
          className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-bold file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-400">
          ※ 外観写真をアップロードできます（保存時に反映）。新しい画像を選ぶと差し替わります。
        </p>
      </section>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-bold text-white transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:opacity-60"
        >
          {saving ? "保存中..." : isEdit ? "更新する" : "登録する"}
        </button>
        {isEdit && hall && (
          <a
            href={`/hall/${hall.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center rounded-xl border border-blue-300 bg-blue-50 px-6 font-bold text-blue-700 hover:bg-blue-100"
          >
            🔍 プレビュー
          </a>
        )}
        <button
          type="button"
          onClick={() => router.push("/owner")}
          disabled={saving}
          className="rounded-xl border border-gray-300 px-6 font-bold text-gray-600 hover:bg-gray-50"
        >
          キャンセル
        </button>
      </div>
      {isEdit && (
        <p className="text-xs text-gray-400">
          ※ プレビューは「保存済み」の内容を別タブで表示します。変更を反映するには先に「更新する」を押してください。
        </p>
      )}
    </form>
  );
}
