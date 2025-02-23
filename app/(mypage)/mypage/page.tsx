"use client";

import { useCallback, useEffect } from "react";

export default function MyPage() {
  const fetchMySummonerInfo = useCallback(async () => {
    try {
      const response = await fetch("api/fetch-mysummoner-info");
    } catch (error) {}
  }, []);

  // 初期表示処理
  useEffect(() => {
    fetchMySummonerInfo();
  }, [fetchMySummonerInfo]);
  return <div className="container">MyPage</div>;
}
