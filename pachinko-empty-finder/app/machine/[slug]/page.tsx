import { notFound } from 'next/navigation';
import { getMachineData, getAllMachines } from '@/lib/firebase/getMachine';
import MachineDetail from '@/components/machine/MachineDetail';

export default async function MachineDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Firestoreからデータを取得
  const data = await getMachineData(slug);
  
  if (!data) {
    notFound();
  }

  return <MachineDetail data={data} />;
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