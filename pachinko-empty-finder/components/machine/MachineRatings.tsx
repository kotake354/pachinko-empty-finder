"use client";

import { useEffect, useMemo, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  setDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Rating {
  id: string;
  score: number;
  comment?: string;
  nickname?: string;
  userId?: string;
  createdAt?: any;
}

// 平均値に応じて部分的に塗りつぶす星表示
function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className="relative inline-block whitespace-nowrap leading-none"
      style={{ fontSize: size }}
      aria-label={`${value.toFixed(1)} / 5`}
    >
      <span className="text-slate-300">★★★★★</span>
      <span
        className="absolute left-0 top-0 overflow-hidden text-amber-400"
        style={{ width: `${pct}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}

function useRatings(machineId: string) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  useEffect(() => {
    const q = query(collection(db, "machines", machineId, "ratings"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Rating[];
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setRatings(data);
    });
    return () => unsub();
  }, [machineId]);

  const count = ratings.length;
  const average = count ? ratings.reduce((s, r) => s + (r.score || 0), 0) / count : 0;
  return { ratings, count, average };
}

// ヒーロー内に置くコンパクトな評価サマリー（クリックで評価セクションへ）
export function MachineRatingSummary({ machineId }: { machineId: string }) {
  const { count, average } = useRatings(machineId);
  return (
    <a
      href="#reviews"
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition-colors hover:border-amber-300 hover:bg-amber-50"
    >
      <span className="text-2xl font-black text-slate-800">
        {count ? average.toFixed(1) : "—"}
      </span>
      <span className="flex flex-col">
        <Stars value={average} size={14} />
        <span className="text-[11px] font-bold text-slate-500">
          {count ? `ユーザー評価 ${count}件` : "まだ評価がありません"}
        </span>
      </span>
    </a>
  );
}

// 評価セクション本体（サマリー＋投稿フォーム＋一覧）
export default function MachineRatings({ machineId }: { machineId: string }) {
  const { ratings, count, average } = useRatings(machineId);
  const [uid, setUid] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);
  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUid(user ? user.uid : null));
    return () => unsub();
  }, []);

  // 自分の既存評価があればフォームに反映
  const myRating = useMemo(() => ratings.find((r) => r.id === uid), [ratings, uid]);
  useEffect(() => {
    if (myRating) {
      setScore(myRating.score || 0);
      setNickname(myRating.nickname || "");
      setComment(myRating.comment || "");
    }
  }, [myRating]);

  // 星ごとの件数分布（5→1）
  const distribution = useMemo(() => {
    const d = [0, 0, 0, 0, 0];
    ratings.forEach((r) => {
      const i = Math.round(r.score) - 1;
      if (i >= 0 && i < 5) d[i] += 1;
    });
    return d;
  }, [ratings]);

  const handleSubmit = async () => {
    if (!uid) {
      setError("評価するにはページの再読み込みが必要です。");
      return;
    }
    if (score < 1) {
      setError("星を選んでください。");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await setDoc(
        doc(db, "machines", machineId, "ratings", uid),
        {
          score,
          comment: comment.trim() || null,
          nickname: nickname.trim() || "匿名",
          userId: uid,
          createdAt: myRating?.createdAt ?? serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Error saving rating:", e);
      setError("評価の保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!uid || !myRating) return;
    if (!confirm("あなたの評価を削除しますか？")) return;
    try {
      await deleteDoc(doc(db, "machines", machineId, "ratings", uid));
      setScore(0);
      setNickname("");
      setComment("");
    } catch (e) {
      console.error("Error deleting rating:", e);
    }
  };

  const activeStar = hover || score;

  return (
    <section id="reviews" className="scroll-mt-20 p-6">
      <h2 className="mb-6 flex items-center gap-2 rounded-r border-l-8 border-amber-400 bg-slate-50 py-2 pl-4 text-lg font-bold text-slate-800">
        みんなの評価
      </h2>

      {/* サマリー */}
      <div className="mb-6 flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div className="flex flex-col items-center justify-center sm:w-48 sm:border-r sm:border-slate-100">
          <span className="text-5xl font-black text-slate-900">
            {count ? average.toFixed(1) : "—"}
          </span>
          <Stars value={average} size={20} />
          <span className="mt-1 text-xs font-bold text-slate-500">{count}件の評価</span>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const c = distribution[star - 1];
            const pct = count ? (c / count) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-6 font-bold text-slate-500">{star}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right font-medium text-slate-400">{c}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 投稿フォーム */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-sm font-bold text-slate-600">
          {myRating ? "あなたの評価を編集" : "この機種を評価する"}
        </h3>
        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}
        <div className="mb-3 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((s) => {
            // 各星を0.5刻みで塗りつぶす（左半分=x.5 / 右半分=x.0）
            const fill = activeStar >= s ? 100 : activeStar >= s - 0.5 ? 50 : 0;
            return (
              <span
                key={s}
                className="relative inline-block leading-none"
                style={{ fontSize: "1.875rem", width: "1em", height: "1em" }}
              >
                <span className="text-slate-300">★</span>
                <span
                  className="pointer-events-none absolute left-0 top-0 overflow-hidden text-amber-400"
                  style={{ width: `${fill}%` }}
                >
                  ★
                </span>
                <button
                  type="button"
                  disabled={saving}
                  aria-label={`${s - 0.5}点`}
                  onMouseEnter={() => setHover(s - 0.5)}
                  onClick={() => setScore(s - 0.5)}
                  className="absolute left-0 top-0 z-10 h-full w-1/2 cursor-pointer"
                  style={{ background: "transparent", border: "none", padding: 0 }}
                />
                <button
                  type="button"
                  disabled={saving}
                  aria-label={`${s}点`}
                  onMouseEnter={() => setHover(s)}
                  onClick={() => setScore(s)}
                  className="absolute right-0 top-0 z-10 h-full w-1/2 cursor-pointer"
                  style={{ background: "transparent", border: "none", padding: 0 }}
                />
              </span>
            );
          })}
          {score > 0 && (
            <span className="ml-2 text-sm font-bold text-slate-600">{score.toFixed(1)}</span>
          )}
        </div>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={saving}
          placeholder="ニックネーム（任意・未入力なら匿名）"
          maxLength={20}
          className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={saving}
          rows={3}
          maxLength={300}
          placeholder="感想・レビュー（任意）"
          className="mb-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 font-bold text-white transition-all hover:from-indigo-700 hover:to-violet-700 active:scale-95 disabled:opacity-60"
          >
            {saving ? "送信中..." : myRating ? "評価を更新" : "評価を投稿"}
          </button>
          {myRating && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50"
            >
              削除
            </button>
          )}
        </div>
      </div>

      {/* レビュー一覧 */}
      <div className="space-y-3">
        {ratings.filter((r) => r.comment).length > 0 ? (
          ratings
            .filter((r) => r.comment)
            .map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-1 flex items-center gap-2">
                  <Stars value={r.score} size={14} />
                  <span className="text-sm font-bold text-slate-700">{r.nickname || "匿名"}</span>
                  <span className="ml-auto text-xs text-slate-400">
                    {r.createdAt?.seconds
                      ? new Date(r.createdAt.seconds * 1000).toLocaleDateString("ja-JP")
                      : ""}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                  {r.comment}
                </p>
              </div>
            ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
            まだレビューがありません。最初の評価を投稿してみましょう。
          </div>
        )}
      </div>
    </section>
  );
}
