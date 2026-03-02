import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.slug} 勝率・攻略情報`,
    description: `${params.slug} の勝率や実践データをまとめています`,
  };
}

export default function MachineDetail({ params }: Props) {
  return (
    <main>
      <h1>{params.slug} の詳細ページ</h1>
    </main>
  );
}