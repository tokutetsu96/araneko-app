"use client";

import { motion } from "framer-motion";

export default function MotionLabel() {
  return (
    <div className="mx-auto p-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mt-6">ようこそ！AraNeko APPへ！</h1>
        </div>
      </motion.div>
    </div>
  );
}
