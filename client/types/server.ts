import { GameState } from "./game";

export interface ServerMessage {
  message?: string;
  gameState?: GameState;
}
