'use client';

import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  poster?: string;
}

export default function VideoPlayer({
  src,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  className = '',
  poster,
}: VideoPlayerProps) {
  if (!src) return null;
  const videoRef = useRef<HTMLVideoElement>(null);

  // iOS Safari等でのインライン自動再生のための対策
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;

    // 動画のメタデータが読み込まれたら再生を開始する関数
    const handleCanPlay = async () => {
      try {
        video.muted = muted; // 再度明示的にミュート
        await video.play();
      } catch (error) {
        console.error("動画の自動再生がブロックされました:", error);
      }
    };

    // すでに準備ができていれば即実行、そうでなければイベントを待つ
    if (video.readyState >= 3) {
      handleCanPlay();
    } else {
      video.addEventListener('canplay', handleCanPlay);
    }

    return () => video.removeEventListener('canplay', handleCanPlay);
  }, [autoPlay, muted, src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline // モバイルブラウザでのインライン再生に必須
        className="w-full h-full object-cover"
      >
        お使いのブラウザは動画の再生に対応していません。
      </video>
    </div>
  );
}
