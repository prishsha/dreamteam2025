package models

import db "github.com/milindmadhukar/dreamteam/db/sqlc"

type GameState struct {
	IsBiddingActive bool 
	IsFinished      bool

	CurrentPlayerInBid *db.GetPlayerRow
	NextPlayerInBid    *db.GetPlayerRow
	CurrentBidAmount   int32
	NextBidAmount      int32
}
