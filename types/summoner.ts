export type opggSummoner = {
  id: number;
  summonerName: string;
  opggUrl: string;
  tag: string;
  rankInfo: RankInfo;
};

export interface mySummoner {
  opggData: {
    summonerName: string;
    tag: string;
    opggUrl: string;
  };
  summonerData: {
    id: string;
    accountId: string;
    puuid: string;
    name: string;
    profileIconId: number;
    revisionDate: number;
    summonerLevel: number;
  };
  rankInfo: {
    leagueId?: string;
    queueType?: string;
    tier?: string;
    rank?: string;
    summonerId?: string;
    summonerName?: string;
    leaguePoints?: number;
    wins?: number;
    losses?: number;
    veteran?: boolean;
    inactive?: boolean;
    freshBlood?: boolean;
    hotStreak?: boolean;
  };
}

type OpggData = {
  summonerName: string;
  opggUrl: string;
  tag: string;
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
