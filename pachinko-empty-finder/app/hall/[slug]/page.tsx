import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getHallData, textColorFor } from "@/lib/firebase/getHall";
import HallMap from "@/components/area/HallMap";
import FilteredPosts from "@/components/posts/FilteredPosts";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hall = await getHallData(slug);
  if (!hall) return { title: "店舗が見つかりません" };
  return {
    title: `${hall.name}（${hall.prefecture}${hall.area}）| 店舗情報`,
    description: `${hall.name} の店舗情報・地図・口コミ投稿`,
  };
}

export default async function HallDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hall = await getHallData(slug);
  if (!hall) notFound();

  // Googleマップを開くだけのURL（APIキー不要・無料）。店名＋住所で検索する。
  const mapsQuery = `${hall.name} ${hall.prefecture}${hall.area}${hall.address ?? ""}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapsQuery
  )}`;

  // 店舗情報の行を組み立て（値があるものだけ表示）
  const infoRows: { label: string; value: string }[] = [];
  if (hall.openTime || hall.closeTime) {
    infoRows.push({
      label: "営業時間",
      value: `${hall.openTime ?? ""}${hall.openTime && hall.closeTime ? " 〜 " : ""}${hall.closeTime ?? ""}`,
    });
  }
  if (hall.holiday) infoRows.push({ label: "定休日", value: hall.holiday });
  if (hall.phone) infoRows.push({ label: "電話番号", value: hall.phone });
  if (hall.pachinkoCount != null || hall.slotCount != null) {
    infoRows.push({
      label: "台数",
      value: [
        hall.pachinkoCount != null ? `パチンコ ${hall.pachinkoCount}台` : null,
        hall.slotCount != null ? `スロット ${hall.slotCount}台` : null,
      ]
        .filter(Boolean)
        .join(" / "),
    });
  }
  if (hall.parking) infoRows.push({ label: "駐車場", value: hall.parking });
  if (hall.nearestStation) infoRows.push({ label: "アクセス", value: hall.nearestStation });

  // 外観写真（R2 / Worker 経由）
  const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "";
  const mediaBase = workerUrl.endsWith("/") ? workerUrl.slice(0, -1) : workerUrl;
  const imageUrl =
    hall.imageFileName && mediaBase ? `${mediaBase}/?file=${hall.imageFileName}` : null;

  // テーマカラー（背景色）と、それに合う文字色
  const theme = hall.themeColor || "#b91c1c";
  const onTheme = textColorFor(theme);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー（テーマカラー背景） */}
      <div style={{ backgroundColor: theme }}>
        <div className="mx-auto max-w-4xl px-4 py-5">
          <nav className="mb-1 text-xs" style={{ color: onTheme, opacity: 0.85 }}>
            <Link href="/area" className="hover:underline">
              全国
            </Link>
            {" > "}
            <span>
              {hall.prefecture} {hall.area}
            </span>
          </nav>
          <h1 className="text-2xl font-black" style={{ color: onTheme }}>
            {hall.name}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <Link
          href="/area"
          className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
        >
          ← 店舗データベースに戻る
        </Link>

        {/* 外観写真 */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${hall.name}の外観`}
            className="max-h-72 w-full rounded-lg border border-gray-200 bg-white object-contain"
          />
        )}

        {/* 店舗情報 */}
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="bg-gray-700 px-4 py-2 text-sm font-bold text-white">店舗情報</div>
          <dl className="divide-y divide-gray-100 text-sm">
            <div className="flex px-4 py-3">
              <dt className="w-24 flex-shrink-0 font-bold text-gray-500">所在地</dt>
              <dd>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <span>
                    {hall.prefecture} {hall.area}
                    {hall.address ? ` ${hall.address}` : ""}
                  </span>
                  <span aria-hidden className="text-xs">📍 地図</span>
                </a>
              </dd>
            </div>
            {infoRows.map((row) => (
              <div key={row.label} className="flex px-4 py-3">
                <dt className="w-24 flex-shrink-0 font-bold text-gray-500">{row.label}</dt>
                <dd className="text-gray-800">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 店舗紹介・リンク */}
        {(hall.description || hall.websiteUrl || hall.snsUrl) && (
          <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="bg-gray-700 px-4 py-2 text-sm font-bold text-white">店舗紹介</div>
            <div className="space-y-4 p-4">
              {hall.description && (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {hall.description}
                </p>
              )}
              {(hall.websiteUrl || hall.snsUrl) && (
                <div className="flex flex-wrap gap-3">
                  {hall.websiteUrl && (
                    <a
                      href={hall.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-gray-300 px-3 py-1.5 text-sm font-bold text-blue-600 hover:bg-blue-50"
                    >
                      🌐 公式サイト
                    </a>
                  )}
                  {hall.snsUrl && (
                    <a
                      href={hall.snsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-gray-300 px-3 py-1.5 text-sm font-bold text-blue-600 hover:bg-blue-50"
                    >
                      🔗 SNS
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 地図 */}
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="bg-gray-700 px-4 py-2 text-sm font-bold text-white">地図</div>
          <HallMap hall={hall} />
        </section>

        {/* この店舗の投稿（投稿×店舗の紐付けは今後） */}
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between bg-red-700 px-4 py-2 text-sm font-bold text-white">
            <span>この店舗の投稿</span>
            <Link
              href={`/post?hall=${hall.slug}`}
              className="rounded bg-white/20 px-2 py-0.5 text-xs hover:bg-white/30"
            >
              投稿する
            </Link>
          </div>
          <FilteredPosts
            field="hallId"
            value={hall.slug}
            emptyText="この店舗の投稿はまだありません。"
          />
        </section>

        <div>
          <Link href="/area" className="text-sm text-blue-600 hover:underline">
            ← 全国の地図に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
