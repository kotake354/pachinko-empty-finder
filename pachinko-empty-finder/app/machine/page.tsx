import { getAllMachines } from "@/lib/firebase/getMachine";
import MachineBrowser from "@/components/machine/MachineBrowser";

export const revalidate = 3600; // 1時間ごとに再生成

export default async function MachinePage() {
  // Firestoreから機種を取得（発売日の新しい順）
  const machines = await getAllMachines(60);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヒーロー（ダークスレート＋ゴールドアクセントの独自トーン） */}
      <header className="border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-sm bg-amber-400" />
            <span className="text-xs font-black tracking-[0.2em] text-amber-400">
              MACHINE DATABASE
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            機種スペック・<span className="text-amber-400">解析</span>データベース
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            新台のスペック・払い出し・打ち方・解析情報をまとめてチェック。気になる機種を探して、最新の攻略情報を手に入れよう。
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
            <span className="text-amber-400">●</span>
            掲載機種 {machines.length} 台
          </div>
        </div>
      </header>

      {/* 本体 */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <MachineBrowser machines={machines} />
      </main>
    </div>
  );
}
