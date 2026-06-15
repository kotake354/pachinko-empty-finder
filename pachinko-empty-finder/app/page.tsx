import Link from "next/link";
import { getAllMachines } from "@/lib/firebase/getMachine";
import PostFeed from "@/components/home/PostFeed";

export const revalidate = 3600; // 1時間ごとに再生成

// 検索導線カードの定義
const searchCards = [
  {
    href: "/area",
    title: "エリアから探す",
    desc: "地図から近くのホールをチェック",
    icon: "📍",
    glow: "hover:border-cyan-400/60 hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)]",
    accent: "text-cyan-300",
  },
  {
    href: "/machine",
    title: "機種から探す",
    desc: "スペック・解析・演出情報",
    icon: "🎰",
    glow: "hover:border-violet-400/60 hover:shadow-[0_0_24px_-6px_rgba(167,139,250,0.5)]",
    accent: "text-violet-300",
  },
];

export default async function Home() {
  const machines = await getAllMachines(12);

  return (
    <div className="min-h-screen bg-[#181824] text-zinc-100">
      {/* ===== ヒーロー ===== */}
      <section className="relative overflow-hidden border-b border-zinc-700">
        {/* ネオンの光彩 */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center">
          <span className="mb-4 inline-block rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-bold tracking-widest text-cyan-300">
            PACHINKO EMPTY FINDER
          </span>
          <h1 className="mb-4 text-4xl font-black leading-tight sm:text-5xl">
            空いてる台が、
            <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
              すぐ見つかる。
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            近くのホールの空き台・稼働状況をユーザー同士でリアルタイム共有。
            無駄な待ち時間を減らして、もっと効率よく立ち回ろう。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/area"
              className="rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-500 px-6 py-3 text-sm font-bold text-black shadow-[0_0_20px_-4px_rgba(34,211,238,0.6)] transition-all hover:shadow-[0_0_28px_-2px_rgba(34,211,238,0.8)] active:scale-95"
            >
              エリアから探す
            </Link>
            <Link
              href="/post"
              className="rounded-lg border border-fuchsia-400/60 bg-fuchsia-500/10 px-6 py-3 text-sm font-bold text-fuchsia-200 transition-all hover:bg-fuchsia-500/20 active:scale-95"
            >
              空き台を投稿する
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-6 py-14">
        {/* ===== 検索導線カード ===== */}
        <section className="grid gap-4 sm:grid-cols-2">
          {searchCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group rounded-xl border border-zinc-700 bg-zinc-800/60 p-6 transition-all ${card.glow}`}
            >
              <div className="mb-3 text-3xl">{card.icon}</div>
              <h3 className={`mb-1 font-bold ${card.accent}`}>{card.title}</h3>
              <p className="text-xs text-zinc-400">{card.desc}</p>
            </Link>
          ))}
        </section>

        {/* ===== 新着・注目の機種 ===== */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <span className="h-5 w-1 rounded bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.8)]" />
              新着・注目の機種
            </h2>
            <Link href="/machine" className="text-xs font-bold text-fuchsia-300 hover:underline">
              機種一覧へ →
            </Link>
          </div>
          {machines.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {machines.map((machine) => (
                <Link
                  key={machine.id}
                  href={`/machine/${machine.id}`}
                  className="group w-32 flex-shrink-0"
                >
                  <div className="relative aspect-[11/18] overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 transition-all group-hover:border-violet-400/60 group-hover:shadow-[0_0_20px_-4px_rgba(167,139,250,0.5)]">
                    {machine.images?.main ? (
                      <img
                        src={machine.images.main}
                        alt={machine.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] font-bold italic text-zinc-600">
                        NO IMAGE
                      </div>
                    )}
                    <span className="absolute left-0 top-0 bg-fuchsia-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      {machine.category === "slot" ? "SLOT" : "PACHI"}
                    </span>
                  </div>
                  <span className="mt-2 line-clamp-2 block text-center text-[11px] font-bold leading-tight text-zinc-300 group-hover:text-violet-300">
                    {machine.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-10 text-center text-sm text-zinc-500">
              機種データが登録されていません。
            </div>
          )}
        </section>

        {/* ===== 人気投稿 ===== */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <span className="h-5 w-1 rounded bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
              人気の投稿
            </h2>
            <Link href="/posts" className="text-xs font-bold text-pink-300 hover:underline">
              すべて見る →
            </Link>
          </div>
          <PostFeed orderField="likes" emptyText="まだ人気の投稿がありません。いいねが付くとここに表示されます。" />
        </section>

        {/* ===== 最新投稿 ===== */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <span className="h-5 w-1 rounded bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              最新の投稿
            </h2>
            <Link href="/posts" className="text-xs font-bold text-cyan-300 hover:underline">
              すべて見る →
            </Link>
          </div>
          <PostFeed orderField="createdAt" />
        </section>
      </div>
    </div>
  );
}
