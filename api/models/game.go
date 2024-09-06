package models

import db "github.com/milindmadhukar/dreamteam/db/sqlc"

type GameState struct {
	IsBiddingActive bool
	IsFinished      bool

	CurrentPlayerInBid *db.Player
  // NextPlayerInBid
	CurrentBidAmount   int32
  // NextBidAmount
}
