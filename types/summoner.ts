export type opggSummoner = {
  id: number;
  summonerName: string;
  opggUrl: string;
  tag: string;
  rankInfo: RankInfo;
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
