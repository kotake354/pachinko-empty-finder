export default function MachineDetail({ params }: { params: { slug: string } }) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">機種詳細ページ</h1>
      <p className="bg-gray-100 p-4 rounded">機種ID: <span className="font-mono font-bold">{params.slug}</span></p>
      <div className="mt-4">
        <a href="/machine" className="text-sm text-blue-500 hover:underline">← 機種一覧に戻る</a>
      </div>
    </main>
  );
}