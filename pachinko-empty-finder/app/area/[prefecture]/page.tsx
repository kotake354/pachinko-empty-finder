import { notFound } from "next/navigation";
import { getPrefectureBySlug } from "@/lib/prefectures";
import { getHallsByPrefecture } from "@/lib/firebase/getHall";
import PrefectureView from "@/components/area/PrefectureView";

export const revalidate = 300;

export default async function PrefecturePage({
  params,
}: {
  params: Promise<{ prefecture: string }>;
}) {
  const { prefecture } = await params;
  const info = getPrefectureBySlug(prefecture);
  if (!info) notFound();

  const halls = await getHallsByPrefecture(info.fullName);

  return <PrefectureView info={info} halls={halls} />;
}
