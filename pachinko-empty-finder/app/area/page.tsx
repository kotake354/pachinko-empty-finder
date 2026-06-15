import Link from "next/link";
import JapanMap from "@/components/area/JapanMap";
import { getAllHalls } from "@/lib/firebase/getHall";

export const revalidate = 300;

export default async function AreaPage() {
  const halls = await getAllHalls();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-black text-red-600">店舗データベース</h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* 左：登録店舗リスト */}
          <section>
            <div className="mb-3 flex items-center justify-between border-b-2 border-gray-200 pb-2">
              <h2 className="font-bold text-gray-700">店舗情報</h2>
              <span className="text-xs text-gray-400">{halls.length} 店舗</span>
            </div>
            {halls.length > 0 ? (
              // 自動スクロール領域。マウスを乗せると停止。リストを2連結して無限ループ。
              <div className="h-80 overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="animate-vscroll divide-y divide-gray-100">
                  {[...halls, ...halls].map((hall, i) => (
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
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
                店舗が登録されていません。
              </div>
            )}
          </section>

          {/* 右：日本地図タイル */}
          <section>
            <div className="mb-3 border-b-2 border-gray-200 pb-2">
              <h2 className="font-bold text-gray-700">地域から探す</h2>
            </div>
            <div className="flex justify-center rounded-lg border border-gray-200 bg-white p-4">
              <JapanMap />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
