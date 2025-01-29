"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false); // ローディング状態管理

  const handleSignIn = async () => {
    setLoading(true); // ロード開始
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      {loading ? (
        <Button disabled className="flex items-center gap-2">
          <Loader2 className="animate-spin" />
          ログイン中...
        </Button>
      ) : (
        // 通常のログインボタン
        <Button onClick={handleSignIn} className="font-bold">
          Googleでログイン
        </Button>
      )}
    </div>
  );
}
