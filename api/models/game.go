package models

import db "github.com/milindmadhukar/dreamteam/db/sqlc"

type GameState struct {
	IsBiddingActive bool 
	IsFinished      bool

	CurrentPlayerInBid *db.GetRandomAvailablePlayerRow
	NextPlayerInBid    *db.GetRandomAvailablePlayerRow
	CurrentBidAmount   int32
	NextBidAmount      int32
}
