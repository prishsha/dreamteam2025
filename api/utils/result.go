package utils

import db "github.com/milindmadhukar/dreamteam/db/sqlc"

func GetTopXPlayers(players []db.GetTeamPlayersRow, X int) []db.GetTeamPlayersRow {
  // Sort players by rating
  // Return top X players

  for i := 0; i < len(players); i++ {
    for j := i + 1; j < len(players); j++ {
      if players[i].Rating < players[j].Rating {
        players[i], players[j] = players[j], players[i]
      }
    }
  }

  return players[:X]
}
