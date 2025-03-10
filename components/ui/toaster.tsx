"use client";

// このファイルはSonnerに移行したため、単なるラッパーのみを提供します
// 実際の実装はapp/layout.tsxで<Toaster />コンポーネントを使用しています

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return <SonnerToaster richColors closeButton position="top-right" />;
}
