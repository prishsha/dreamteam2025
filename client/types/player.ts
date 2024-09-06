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
}
