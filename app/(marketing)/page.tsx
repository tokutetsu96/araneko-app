"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="container mx-auto p-10 flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="p-6 text-center shadow-lg">
          <CardContent>
            <h1 className="text-4xl font-bold mt-6">
              ようこそ！AraNeko APPへ！
            </h1>
            <p className="mt-2 text-lg font-semibold">
              登録したOpggListを簡単に管理できます。
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
