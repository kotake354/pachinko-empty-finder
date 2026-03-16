'use client';

import { useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export default function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // ユーザーがログインしていない場合、匿名ログインを実行
        signInAnonymously(auth).catch((error) => {
          console.error("匿名ログインに失敗しました:", error);
        });
      } else {
        console.log("ログインユーザー:", user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
