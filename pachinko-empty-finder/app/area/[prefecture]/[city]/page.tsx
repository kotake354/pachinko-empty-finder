import { notFound } from "next/navigation";
import Link from "next/link";
import { getPrefectureBySlug } from "@/lib/prefectures";
import { getHallsByPrefecture } from "@/lib/firebase/getHall";

export const revalidate = 300;

export default async function CityPage({
  params,
}: {
  params: Promise<{ prefecture: string; city: string }>;
}) {
  const { prefecture, city } = await params;
  const info = getPrefectureBySlug(prefecture);
  if (!info) notFound();

  const cityName = decodeURIComponent(city);
  const halls = (await getHallsByPrefecture(info.fullName)).filter(
    (h) => h.area === cityName
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー＋パンくず */}
      <div className="border-b-4 border-red-600 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <nav className="mb-1 text-xs text-gray-500">
            <Link href="/area" className="hover:underline">
              全国
            </Link>
            {" > "}
            <Link href={`/area/${info.slug}`} className="hover:underline">
              {info.fullName}
            </Link>
            {" > "}
            <span className="text-gray-700">{cityName}</span>
          </nav>
          <h1 className="text-2xl font-black text-gray-800">
            {info.fullName} {cityName}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <Link
          href="/area"
          className="mb-4 inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
        >
          ← 店舗データベースに戻る
        </Link>

        <div className="mb-3 flex items-center justify-between bg-red-700 px-3 py-2 text-sm font-bold text-white">
          <span>店舗一覧</span>
          <span>{halls.length} 店舗</span>
        </div>

        {halls.length > 0 ? (
          <ul className="divide-y divide-gray-100 rounded-b border border-gray-200 bg-white">
            {halls.map((hall) => (
              <li key={hall.id}>
                <Link
                  href={`/hall/${hall.slug}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-red-50/40"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-[9px] font-bold italic text-gray-400">
                    NO IMG
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-bold text-red-700">{hall.name}</div>
                    <div className="text-xs text-gray-500">
                      {hall.prefecture} {hall.area}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-b border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
            {cityName}の店舗はまだ登録されていません。
          </div>
        )}

        <div className="mt-8">
          <Link href={`/area/${info.slug}`} className="text-sm text-blue-600 hover:underline">
            ← {info.fullName}の地域一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
