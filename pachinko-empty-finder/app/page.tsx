import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <nav>
        <Link href="/machine" className="text-blue-500 hover:underline">
          機種一覧はこちら
        </Link>
      </nav>
    </main>
  );
}
