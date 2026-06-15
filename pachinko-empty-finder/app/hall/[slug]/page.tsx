import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getHallData } from "@/lib/firebase/getHall";
import HallMap from "@/components/area/HallMap";

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="border-b-4 border-red-600 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-5">
          <nav className="mb-1 text-xs text-gray-500">
            <Link href="/area" className="hover:underline">
              全国
            </Link>
            {" > "}
            <span className="text-gray-700">
              {hall.prefecture} {hall.area}
            </span>
          </nav>
          <h1 className="text-2xl font-black text-gray-800">{hall.name}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
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
          </dl>
        </section>

        {/* 地図 */}
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="bg-gray-700 px-4 py-2 text-sm font-bold text-white">地図</div>
          <HallMap hall={hall} />
        </section>

        {/* この店舗の投稿（投稿×店舗の紐付けは今後） */}
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between bg-red-700 px-4 py-2 text-sm font-bold text-white">
            <span>この店舗の投稿</span>
            <Link href="/post" className="rounded bg-white/20 px-2 py-0.5 text-xs hover:bg-white/30">
              投稿する
            </Link>
          </div>
          <div className="p-8 text-center text-sm text-gray-400">
            この店舗に紐づく投稿はまだありません。
            <br />
            <span className="text-xs">（投稿と店舗の紐付けは今後対応予定です）</span>
          </div>
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
