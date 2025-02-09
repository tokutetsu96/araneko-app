"use client";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { Icon } from "./icon";
import { toast } from "@/hooks/use-toast";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false);
  const [email, setEmail] = useState("");

  // Google 認証処理
  const handleGoogleSignIn = async () => {
    setIsGoogleLoginLoading(true);
    const result = await signIn("google");

    if (result?.error) {
      toast({
        title: "Googleログインに失敗しました。",
        description: "もう一度試してください。",
        variant: "destructive",
      });
    }
  };

  // Magic Link（メール認証）処理
  const handleEmailSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      return toast({
        title: "メールアドレスを入力してください。",
        variant: "destructive",
      });
    }

    setLoading(true);

    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/",
    });

    setLoading(false);

    if (result?.error) {
      toast({
        title: "ログインに失敗しました。",
        description: "メールアドレスを確認してください。",
        variant: "destructive",
      });
    } else {
      toast({
        title: "ログインリンクを送信しました。",
        description: "メールを確認してリンクをクリックしてください。",
      });
    }
  };

  return (
    <div className="grid gap-6">
      {/* メールログインフォーム */}
      <form onSubmit={handleEmailSignIn}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {loading ? (
            <Button disabled className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              送信中...
            </Button>
          ) : (
            <Button type="submit">ログイン</Button>
          )}
        </div>
      </form>

      {/* 区切り線 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="text-muted-foreground px-2 bg-background">
            または
          </span>
        </div>
      </div>

      {/* Googleログインボタン */}
      <div className="flex flex-col gap-3">
        {isGoogleLoginLoading ? (
          <Button disabled className="flex items-center gap-2">
            <Loader2 className="animate-spin" />
            ログイン中...
          </Button>
        ) : (
          <Button
            onClick={handleGoogleSignIn}
            className="flex items-center gap-2"
          >
            <Icon.google className="w-5 h-5" />
            Googleでログイン
          </Button>
        )}
      </div>
    </div>
  );
}
