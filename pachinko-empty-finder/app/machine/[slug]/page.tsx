import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMachineData, getAllMachines } from '@/lib/firebase/getMachine';
import MachineDetail from '@/components/machine/MachineDetail';
import FilteredPosts from '@/components/posts/FilteredPosts';

export default async function MachineDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Firestoreからデータを取得
  const data = await getMachineData(slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      <MachineDetail data={data} />

      {/* スクロール中も常に表示されるフローティング投稿ボタン（TOPボタンと被らないよう左下） */}
      <Link
        href={`/post?machine=${data.id}`}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
      >
        <span>✏️</span>
        <span>この機種に投稿</span>
      </Link>

      {/* この機種の投稿 */}
      <div className="mx-auto max-w-4xl px-4 pb-12">
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between bg-blue-900 px-4 py-2 text-sm font-bold text-white">
            <span>この機種の投稿</span>
            <Link
              href={`/post?machine=${data.id}`}
              className="rounded bg-white/20 px-2 py-0.5 text-xs hover:bg-white/30"
            >
              投稿する
            </Link>
          </div>
          <FilteredPosts
            field="machineId"
            value={data.id}
            emptyText="この機種の投稿はまだありません。"
          />
        </section>
      </div>
    </>
  );
}

// 静的パスの生成 (ビルド時および実行時に利用)
// 初期状態としていくつかの有名なスラグを返しておくか、
// またはFirestoreから全件取得してSSG対象にする
export async function generateStaticParams() {
  const machines = await getAllMachines();
  return machines.map((machine) => ({
    slug: machine.id,
  }));
}

// ISRの設定（例えば1時間ごとに再生成）
export const revalidate = 3600;