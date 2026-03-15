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
  const videoRef = useRef<HTMLVideoElement>(null);

  // iOS Safari等でのインライン自動再生のための対策
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("動画の自動再生がブロックされました:", error);
      });
    }
  }, [autoPlay, src]);

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
