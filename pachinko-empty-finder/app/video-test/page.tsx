'use client';

import React, { useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import Link from 'next/link';

export default function VideoTestPage() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>('');

  const handleTestPlay = () => {
    setVideoUrl(inputUrl);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-neutral-800">🎥 外部動画の表示テスト</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            ← ホームに戻る
          </Link>
        </div>
        
        <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-blue-800">📝 Cloudflare等からの動画テスト手順</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-700">
            <li>Cloudflareなどにアップロードした動画の「パブリックURL」を下の入力欄に貼り付けてください。</li>
            <li>「再生テスト」ボタンを押すと、下のプレイヤーに動画が読み込まれ、正常に再生されるか確認できます。</li>
            <li>（例：<code>https://example.com/test-video.mp4</code> など）</li>
          </ul>
        </div>

        {/* URL入力フォーム */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="ここに動画のURLを貼り付けてください"
            className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleTestPlay}
            disabled={!inputUrl}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            再生テスト
          </button>
        </div>

        {/* テスト用の動画プレイヤー */}
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-neutral-800 relative flex items-center justify-center">
          {videoUrl ? (
            <VideoPlayer 
              src={videoUrl} 
              controls={true}
              autoPlay={true}
              muted={true}
              loop={true}
            />
          ) : (
            <p className="text-neutral-500 font-medium">↑ URLを入力して「再生テスト」を押してください</p>
          )}
        </div>
      </div>
    </div>
  );
}
