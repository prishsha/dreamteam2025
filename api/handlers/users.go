package handlers

import (
	"net/http"

	db "github.com/milindmadhukar/dreamteam/db/sqlc"
	"github.com/milindmadhukar/dreamteam/utils"
)

func GetUserTeamPlayers(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

		jwtTokenCookie, err := r.Cookie("token")

		if err != nil {
			resp["error"] = "No token found"
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		userId, errMsg, status := utils.GetUserIdFromJWT(jwtTokenCookie.Value)
		if errMsg != "" {
			resp["error"] = errMsg
			utils.JSON(w, status, resp)
			return
		}

		dbUser, err := queries.GetUser(r.Context(), userId)
		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		if !dbUser.ParticipantTeamID.Valid {
			resp["error"] = "You have not been assigned a team. A team will be assigned to you soon."
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		userTeamPlayers, err := queries.GetTeamPlayers(r.Context(), int64(dbUser.ID))

		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		bowlerCount := 0
		batsmanCount := 0
		allRounderCount := 0
		wicketKeeperCount := 0
		internationalCount := 0

		for _, player := range userTeamPlayers {
			if player.Role == "Bowler" {
				bowlerCount++
			}
			if player.Role == "Batsman" {
				batsmanCount++
			}
			if player.Role == "All Rounder" {
				allRounderCount++
			}
			if player.Role == "Wicket Keeper" {
				wicketKeeperCount++
			}
			if player.Country != "India" {
				internationalCount++
			}
		}

		resp["players"] = userTeamPlayers
		resp["bowlerCount"] = bowlerCount
		resp["batsmanCount"] = batsmanCount
		resp["allRounderCount"] = allRounderCount
		resp["wicketKeeperCount"] = wicketKeeperCount
		resp["internationalCount"] = internationalCount

		bowlerCountSatisfied := bowlerCount >= 4
		batsmanCountSatisfied := batsmanCount >= 4
		allRounderCountSatisfied := allRounderCount >= 2
		wicketKeeperCountSatisfied := wicketKeeperCount >= 1
		internationalCountSatsisfied := internationalCount >= 4

		resp["bowlerCountSatisfied"] = bowlerCountSatisfied
		resp["batsmanCountSatisfied"] = batsmanCountSatisfied
		resp["allRounderCountSatisfied"] = allRounderCountSatisfied
		resp["wicketKeeperCountSatisfied"] = wicketKeeperCountSatisfied
		resp["internationalCountSatsisfied"] = internationalCountSatsisfied

		utils.JSON(w, http.StatusOK, resp)
	}
}
