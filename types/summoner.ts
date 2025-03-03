export type opggSummoner = {
  id: number;
  summonerName: string;
  opggUrl: string;
  tag: string;
  rankInfo: RankInfo;
};

export type mySummoner = {
  id: number;
  summonerName: string;
  opggUrl: string;
  tag: string;
  rankInfo: RankInfo;
  summonerData: SummonerData;
};

type RankInfo = {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
};

// サモナー情報の型
type SummonerData = {
  accountId: string;
  id: string;
  profileIconId: number;
  puuid: string;
  revisionDate: number;
  summonerLevel: number;
};
