"use client";

import { useEffect, useRef, useState } from "react";

interface FeedVideoProps {
  src: string;
  className?: string;
}

/**
 * X(Twitter)風の動画フィード用プレーヤー。
 * - 画面内に入ったら無音で自動再生、外れたら停止
 * - クリックで音アリ/ミュートを切り替え（カードのリンク遷移は抑止）
 * - preload="none" + 画面内のみ再生で、見えていない動画はダウンロードしない（コスト節約）
 */
export default function FeedVideo({ src, className = "" }: FeedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.5] }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // 親のカード(Link)への遷移を止め、音のON/OFFを切り替える
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    setMuted(next);
    video.muted = next;
    if (video.paused) video.play().catch(() => {});
  };

  if (!src) return null;

  return (
    <div
      className={`relative h-full w-full cursor-pointer overflow-hidden ${className}`}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src={src}
        muted={muted}
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      >
        お使いのブラウザは動画の再生に対応していません。
      </video>
      {/* 音のON/OFF表示 */}
      <div className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs leading-none text-white">
        {muted ? "🔇" : "🔊"}
      </div>
    </div>
  );
}
