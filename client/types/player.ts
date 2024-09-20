export enum PlayerRole {
  Batsman = "Batsman",
  Bowler = "Bowler",
  AllRounder = "All Rounder",
  WicketKeeper = "Wicket Keeper",
}

export interface Player {
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
  iplTeamName: {
    String: string;
    Valid: boolean;
  }
  isUnsold: boolean;
  soldForAmount: number;
}
