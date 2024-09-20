import { GameState } from "./game";
import { Player } from "./player";
import { ParticipatingTeam } from "./teams";


// TODO  Structure is very weird
export interface ServerMessage {
  message?: string
  gameState?: GameState;
}

export interface AssignPlayerMessage {
  assignPlayerMessage(playerName: any, amount: any): unknown;
  type: string;
  participatingTeam: ParticipatingTeam;
  player: Player;
  bidAmount: number;
}


export interface UnsoldPlayerMessage {
  unsoldPlayerMessage(playerName: any): unknown;
  type: string;
  player: Player;
}
