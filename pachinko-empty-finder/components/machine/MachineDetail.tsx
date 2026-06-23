'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FireIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/solid';
import { Machine } from '@/lib/firebase/getMachine';
import AnalysisSections from './AnalysisSections';
import MachineRatings, { MachineRatingSummary } from './MachineRatings';

export default function MachineDetail({ data }: { data: Machine, extras?: any }) {
  const isSlot = data.category === 'slot';

  // payoutData の rate 文字列（例: "97.9%（99.0%）"）から機械割レンジを算出
  const rates = Array.isArray(data.payoutData)
    ? data.payoutData
        .map((r) => {
          const m = r.rate?.match(/([\d.]+)\s*%/);
          return m ? parseFloat(m[1]) : NaN;
        })
        .filter((n) => !Number.isNaN(n))
    : [];
  const payoutRange = rates.length
    ? `${Math.min(...rates)}% 〜 ${Math.max(...rates)}%`
    : null;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <div className="mx-auto min-h-screen max-w-4xl bg-white pb-20 shadow-xl">

        {/* パンくず */}
        <nav className="flex items-center gap-1 border-b border-slate-100 bg-slate-50 p-4 text-[10px] text-slate-400">
          <Link href="/" className="hover:text-indigo-600">HOME</Link>
          <ChevronRightIcon className="h-3 w-3" />
          <Link href="/machine" className="hover:text-indigo-600">機種一覧</Link>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="truncate font-bold text-slate-600">{data.name}</span>
        </nav>

        {/* 1. ヒーロー（画像＋情報パネル） */}
        <header className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 画像 */}
            <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-lg">
              {data.images?.main ? (
                data.images.main.startsWith('http') || data.images.main.startsWith('/') ? (
                  <Image
                    src={data.images.main}
                    alt={data.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-contain p-3"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-4 text-center text-[10px] font-bold text-amber-300">
                    {data.images.main}
                  </div>
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold italic text-slate-500">
                  NO IMAGE
                </div>
              )}
            </div>

            {/* 情報パネル */}
            <div className="flex flex-col text-white">
              <span
                className={`mb-2 inline-block w-fit rounded px-2 py-0.5 text-[10px] font-bold text-white ${
                  isSlot ? 'bg-indigo-500' : 'bg-rose-500'
                }`}
              >
                {isSlot ? 'パチスロ' : 'パチンコ'}
              </span>
              <h1 className="text-2xl font-black leading-tight md:text-3xl">{data.name}</h1>
              {data.modelName && (
                <p className="mt-1 font-mono text-xs text-slate-400">{data.modelName}</p>
              )}

              {/* 評価サマリー */}
              <div className="mt-4">
                <MachineRatingSummary machineId={data.id} />
              </div>

              {/* 主要スペック */}
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-white/10 px-3 py-2">
                  <dt className="text-[10px] font-bold text-amber-400">機械割</dt>
                  <dd className="font-bold text-white">{payoutRange ?? '—'}</dd>
                </div>
                <div className="rounded-lg bg-white/10 px-3 py-2">
                  <dt className="text-[10px] font-bold text-amber-400">導入開始日</dt>
                  <dd className="font-bold text-white">{data.releaseDate || '—'}</dd>
                </div>
                <div className="col-span-2 rounded-lg bg-white/10 px-3 py-2">
                  <dt className="text-[10px] font-bold text-amber-400">メーカー</dt>
                  <dd className="font-bold text-white">{data.maker || '—'}</dd>
                </div>
              </dl>

              {/* タイプタグ */}
              {Array.isArray(data.type) && data.type.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {data.type.map((t, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-slate-600 bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 注目ポイント */}
        {Array.isArray(data.features) && data.features.length > 0 && (
          <section className="p-6">
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-inner">
              <h3 className="mb-3 flex items-center gap-1 text-sm font-bold text-amber-800">
                <FireIcon className="h-5 w-5" /> 注目ポイント
              </h3>
              <ul className="space-y-3 text-xs leading-relaxed text-amber-900">
                {data.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-bold text-amber-500">▶</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* スペック詳細（機械割テーブル） */}
        <section className="p-6">
          <h2 className="mb-6 flex items-center gap-2 rounded-r border-l-8 border-indigo-500 bg-slate-50 py-2 pl-4 text-lg font-bold text-slate-800">
            スペック・出玉率（機械割）
          </h2>
          <div className="overflow-x-auto rounded-2xl border-2 border-slate-50 shadow-sm">
            <table className="w-full text-center text-sm">
              <thead className="bg-slate-800 text-[10px] font-bold uppercase text-white">
                <tr>
                  <th className="border-r border-slate-700 p-4">{isSlot ? '設定' : '状態'}</th>
                  <th className="border-r border-slate-700 p-4">{isSlot ? 'CZ / ボーナス等' : '大当り確率'}</th>
                  <th className="border-r border-slate-700 p-4">{isSlot ? 'AT / 初当り' : '継続率/比率'}</th>
                  <th className="bg-amber-500 p-4 text-amber-950">{isSlot ? '出玉率' : '備考'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {Array.isArray(data.payoutData) ? data.payoutData.map((row, i) => (
                  <tr key={i} className="transition-colors hover:bg-indigo-50/50">
                    <th className="border-r border-slate-100 bg-slate-50/50 p-4 font-bold text-slate-900">{row.label}</th>
                    <td className="border-r border-slate-100 p-4">{row.val1}</td>
                    <td className="border-r border-slate-100 p-4">{row.val2}</td>
                    <td className="bg-amber-50/40 p-4 font-black text-slate-900">{row.rate}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-8 italic text-slate-400">データがありません</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* PV */}
        {data.pvUrl && (
          <section className="p-6">
            <h2 className="mb-6 flex items-center gap-2 rounded-r border-l-8 border-indigo-500 bg-slate-50 py-2 pl-4 text-lg font-bold text-slate-800">
              <PlayIcon className="h-5 w-5 text-indigo-500" /> 公式PV・ティザームービー
            </h2>
            <div className="aspect-video w-full overflow-hidden rounded-2xl border-4 border-slate-100 bg-black shadow-2xl">
              <iframe src={data.pvUrl} className="h-full w-full" allowFullScreen title="PV" />
            </div>
          </section>
        )}

        {/* 配当表＆リール配列 */}
        {(data.images?.paytable || data.images?.reel) && (
          <section className="p-6">
            <div className="flex items-center justify-between bg-slate-800 px-4 py-2 text-sm font-black text-white shadow-sm">
              <span className="flex items-center gap-2">
                <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] tracking-wider text-white">画像</span>
                配当表・リール配列
              </span>
              <span className="text-[10px] font-bold tracking-widest opacity-70">IMAGE DATA</span>
            </div>
            <div className="border-x border-b border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {data.images?.paytable && (
                  <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 rounded bg-slate-50 py-2 text-center text-sm font-bold text-slate-700">配当表</h3>
                    <div className="flex justify-center p-4">
                      {data.images.paytable.startsWith('http') || data.images.paytable.startsWith('/') ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={data.images.paytable} alt={`${data.name} 配当表`} className="max-h-96 object-contain" />
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center rounded-lg bg-slate-100 p-4 text-center text-[10px] font-bold text-amber-600 break-all">
                          {data.images.paytable}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {data.images?.reel && (
                  <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 rounded bg-slate-50 py-2 text-center text-sm font-bold text-slate-700">リール配列</h3>
                    <div className="flex justify-center p-4">
                      {data.images.reel.startsWith('http') || data.images.reel.startsWith('/') ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={data.images.reel} alt={`${data.name} リール配列`} className="max-h-96 object-contain" />
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center rounded-lg bg-slate-100 p-4 text-center text-[10px] font-bold text-amber-600 break-all">
                          {data.images.reel}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 解析セクション（目次付き） */}
        <AnalysisSections data={data as any} />

        {/* ユーザー評価 */}
        <MachineRatings machineId={data.id} />

        {/* アクション */}
        <div className="mt-10 p-6 text-center">
          <Link
            href="/posts"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-10 py-4 font-black text-white shadow-xl transition-all hover:from-indigo-700 hover:to-violet-700 active:scale-95"
          >
            この機種の空台状況・投稿を見る
            <ChevronRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}
