import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <nav className="flex flex-col space-y-4">
        <Link href="/posts" className="text-blue-500 hover:underline">
          投稿一覧を見る
        </Link>
        <Link href="/machine" className="text-blue-500 hover:underline">
          機種一覧はこちら
        </Link>
        <Link href="/area" className="text-blue-500 hover:underline">
          エリアから探す
        </Link>
        <Link href="/hall" className="text-blue-500 hover:underline">
          ホールから探す
        </Link>
        <Link href="/post" className="text-blue-500 hover:underline">
          投稿ページへ
        </Link>
      </nav>
    </main>
  );
}
