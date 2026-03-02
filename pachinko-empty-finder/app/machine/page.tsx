import Link from "next/link";

const machines = [
  { slug: "eva15", name: "エヴァ15" },
  { slug: "hokuto", name: "北斗の拳" },
];

export default function MachinePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">機種一覧</h1>
      <ul className="list-disc pl-5">
        {machines.map((m) => (
          <li key={m.slug} className="mb-2">
            <Link href={`/machine/${m.slug}`} className="text-blue-500 hover:underline">
              {m.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}