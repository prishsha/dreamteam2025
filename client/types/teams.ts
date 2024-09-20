import { PlayerRole } from "./player";

export interface ParticipatingTeam {
  id: number
  name: string
  balance: number
}

export interface MyTeamPlayer {
  id: number;
  name: string;
  country: string;
  role: PlayerRole;
  rating: number;
  basePrice: number;
  avatarUrl: {
    String: string;
    Valid: boolean;
  }
  teamId: {
    Int64: number;
    Valid: boolean;
  }
  iplTeam: {
    Int64: number;
    Valid: boolean;
  }
  iplTeamName: string;
  teamBalance: number;
  isUnsold: boolean;
  soldForAmount: number;
}


export interface MyTeamStats {
  bowlerCount: number;
  batsmanCount: number;
  allRounderCount: number;
  wicketKeeperCount: number;
  internationalCount: number;
  bowlerCountSatisfied: boolean;
  batsmanCountSatisfied: boolean;
  allRounderCountSatisfied: boolean;
  wicketKeeperCountSatisfied: boolean;
  internationalCountSatisfied: boolean;
}


export interface AllTeamPlayerResponse extends MyTeamStats {
  teamId: number;
  teamBalance: number;
  teamName: string;
  players: MyTeamPlayer[];
}

export interface MyTeamPlayerResponse extends MyTeamStats {
  players: MyTeamPlayer[];
}
