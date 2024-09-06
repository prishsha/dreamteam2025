import { Player } from "./player"

export interface GameState {
  IsBiddingActive: boolean
  IsFinished: boolean

  CurrentPlayerInBid?: Player
  CurrentBidAmount: number
}
