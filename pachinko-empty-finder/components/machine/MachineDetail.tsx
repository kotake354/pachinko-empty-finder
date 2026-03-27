'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FireIcon, CalendarIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/solid';
import { Machine } from '@/lib/firebase/getMachine';
import AnalysisSections from './AnalysisSections';

export default function MachineDetail({ data, extras }: { data: Machine, extras?: any }) {
  const isSlot = data.category === 'slot';

  return (
    <div className="bg-[#f0f2f5] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-xl pb-20">

        {/* パンくずリスト */}
        <nav className="flex items-center gap-1 p-4 text-[10px] text-gray-400 bg-gray-50 border-b border-gray-100">
          <Link href="/" className="hover:text-blue-500">HOME</Link>
          <ChevronRightIcon className="w-3 h-3" />
          <Link href="/machine" className="hover:text-blue-500">機種一覧</Link>
          <ChevronRightIcon className="w-3 h-3" />
          <span className="text-gray-600 font-bold truncate">{data.name}</span>
        </nav>

        {/* 1. ヘッダーセクション */}
        <header className="p-6 border-b-4 border-blue-600 bg-white">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white mb-2 ${isSlot ? 'bg-indigo-600' : 'bg-red-500'}`}>
                {isSlot ? 'パチスロ' : 'パチンコ'}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                {data.name}
              </h1>
              <span className="block text-sm text-blue-600 font-bold mt-1">
                解析攻略・設定判別・スペックまとめ
              </span>
            </div>
            <div className="hidden sm:block text-right">
              <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 mb-1">
                <CalendarIcon className="w-3 h-3" />
                <span>導入開始日</span>
              </div>
              <span className="text-sm font-bold text-gray-700">{data.releaseDate}</span>
            </div>
          </div>
        </header>

        {/* 2. 機種概要（画像とスペック表） */}
        <section className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-md flex items-center justify-center">
            {data.images?.main ? (
              data.images.main.startsWith("http") || data.images.main.startsWith("/") ? (
                <Image
                  src={data.images.main}
                  alt={data.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-4"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center p-4 text-center">
                  <span className="text-red-500 font-bold text-[10px] break-all">
                    {data.images.main}
                  </span>
                </div>
              )
            ) : (
              <div className="text-gray-400 text-xs font-bold bg-gray-100 w-full h-full flex items-center justify-center italic">
                NO IMAGE
              </div>
            )}
          </div>

          <div className="space-y-6">
            <table className="w-full text-sm border-collapse rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <tbody>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 text-left w-1/3">メーカー</th>
                  <td className="p-3 font-bold">{data.maker || '-'}</td>
                </tr>
                <tr className="bg-white border-b border-gray-50">
                  <th className="p-3 text-left text-gray-400 text-xs">型式名</th>
                  <td className="p-3 text-gray-800 font-mono text-xs">{data.modelName || '-'}</td>
                </tr>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-gray-400 text-xs">タイプ</th>
                  <td className="p-3 flex flex-wrap gap-1">
                    {Array.isArray(data.type) ? data.type.map((t, i) => (
                      <span key={i} className="bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">
                        {t}
                      </span>
                    )) : (
                      <span className="text-[10px] text-gray-400 italic">データなし</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-inner">
              <h3 className="text-amber-800 font-bold text-sm mb-3 flex items-center gap-1">
                <FireIcon className="w-5 h-5" /> 注目ポイント
              </h3>
              <ul className="text-xs text-amber-900 space-y-3 leading-relaxed">
                {Array.isArray(data.features) ? data.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-500 font-bold">▶</span> {f}
                  </li>
                )) : (
                  <li className="text-amber-700 italic">準備中...</li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. スペック詳細（機械割テーブル） */}
        <section className="p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-l-8 border-red-500 pl-4 bg-gray-50 py-2 rounded-r">
            スペック・出玉率（機械割）
          </h2>
          <div className="overflow-x-auto rounded-2xl border-2 border-gray-50 shadow-sm">
            <table className="w-full text-sm text-center">
              <thead className="bg-gray-800 text-white uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-4 border-r border-gray-700">{isSlot ? '設定' : '状態'}</th>
                  <th className="p-4 border-r border-gray-700">{isSlot ? 'CZ / ボーナス等' : '大当り確率'}</th>
                  <th className="p-4 border-r border-gray-700">{isSlot ? 'AT / 初当り' : '継続率/比率'}</th>
                  <th className="p-4 bg-red-600 text-white">{isSlot ? '出玉率' : '備考'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {Array.isArray(data.payoutData) ? data.payoutData.map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                    <th className="p-4 font-bold text-gray-900 bg-gray-50/50 border-r border-gray-100">{row.label}</th>
                    <td className="p-4 border-r border-gray-100">{row.val1}</td>
                    <td className="p-4 border-r border-gray-100">{row.val2}</td>
                    <td className="p-4 font-black text-gray-900 bg-gray-50/20">{row.rate}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-gray-400 italic">データがありません</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. PVセクション */}
        {data.pvUrl && (
          <section className="p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-l-8 border-blue-500 pl-4 bg-gray-50 py-2 rounded-r">
              <PlayIcon className="w-5 h-5 text-blue-500" /> 公式PV・ティザームービー
            </h2>
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-gray-100">
              <iframe
                src={data.pvUrl}
                className="w-full h-full"
                allowFullScreen
                title="PV"
              />
            </div>
          </section>
        )}

        {/* 筐体＆リール配列 */}
        {/* 筐体＆リール配列 */}
        {(data.images?.paytable || data.images?.reel) && (
          <section className="p-6">
            <div className="bg-gray-800 text-white px-4 py-2 text-sm font-black flex items-center justify-between shadow-sm">
              <span className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded tracking-wider">画像</span>
                配当表・リール配列
              </span>
              <span className="text-[10px] opacity-70 font-bold tracking-widest">IMAGE DATA</span>
            </div>
            <div className="bg-white p-6 border-x border-b border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.images?.paytable && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 text-center bg-gray-50 py-2 rounded">配当表</h3>
                  <div className="flex justify-center p-4">
                    {data.images.paytable.startsWith("http") || data.images.paytable.startsWith("/") ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={data.images.paytable} alt={`${data.name} 配当表`} className="max-h-96 object-contain" />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center p-4 text-center rounded-lg">
                        <span className="text-red-500 font-bold text-[10px] break-all">
                          {data.images.paytable}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {data.images?.reel && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 text-center bg-gray-50 py-2 rounded">リール配列</h3>
                  <div className="flex justify-center p-4">
                    {data.images.reel.startsWith("http") || data.images.reel.startsWith("/") ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={data.images.reel} alt={`${data.name} リール配列`} className="max-h-96 object-contain" />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center p-4 text-center rounded-lg">
                        <span className="text-red-500 font-bold text-[10px] break-all">
                          {data.images.reel}
                        </span>
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

        {/* アクションボタン */}
        <div className="p-6 mt-10 text-center">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-full shadow-xl hover:shadow-blue-200 transition-all active:scale-95 group"
          >
            この機種の空台状況・投稿を見る
            <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
