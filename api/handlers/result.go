package handlers

import (
	"fmt"
	"net/http"

	db "github.com/milindmadhukar/dreamteam/db/sqlc"
	"github.com/milindmadhukar/dreamteam/utils"
)

func CalculateResult(queries *db.Queries) http.HandlerFunc {
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

		if !utils.IsAdmin(dbUser.Email) {
			resp["error"] = "Unauthorized"
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		participantTeams, err := queries.GetAllParticipatingTeams(r.Context())
		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		type TeamResult struct {
			TeamName    string                 `json:"teamName"`
			TeamId      int32                  `json:"teamId"`
			TotalRating int32                  `json:"totalRating"`
			Players     []db.GetTeamPlayersRow `json:"players"`
			ValidTeam   bool                   `json:"validTeam"`
		}

		var TeamResultResponse []TeamResult

		for _, participantTeam := range participantTeams {

			var teamResult TeamResult
			teamResult.TeamName = participantTeam.Name
			teamResult.TeamId = participantTeam.ID

			teamPlayers, err := queries.GetTeamPlayers(r.Context(), participantTeam.ID)
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

			for _, player := range teamPlayers {
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

			bowlerCountSatisfied := bowlerCount >= 4
			batsmanCountSatisfied := batsmanCount >= 4
			allRounderCountSatisfied := allRounderCount >= 2
			wicketKeeperCountSatisfied := wicketKeeperCount >= 1
			internationalCountSatsisfied := internationalCount <= 4

			teamResult.ValidTeam = bowlerCountSatisfied && batsmanCountSatisfied && allRounderCountSatisfied && wicketKeeperCountSatisfied && internationalCountSatsisfied

			if !teamResult.ValidTeam {
				TeamResultResponse = append(TeamResultResponse, teamResult)
				continue
			}

			bowlers := make([]db.GetTeamPlayersRow, 0)
			batsmen := make([]db.GetTeamPlayersRow, 0)
			wicketKeepers := make([]db.GetTeamPlayersRow, 0)
			allRounders := make([]db.GetTeamPlayersRow, 0)

			for _, player := range teamPlayers {
				if player.Role == "Bowler" {
					bowlers = append(bowlers, player)
				}
				if player.Role == "Batsman" {
					batsmen = append(batsmen, player)
				}
				if player.Role == "Wicket Keeper" {
					wicketKeepers = append(wicketKeepers, player)
				}
				if player.Role == "All Rounder" {
					allRounders = append(allRounders, player)
				}
			}

			top4Bowlers := utils.GetTopXPlayers(bowlers, 4)
			top4Batsmen := utils.GetTopXPlayers(batsmen, 4)
			top2AllRounders := utils.GetTopXPlayers(allRounders, 2)
			top1WicketKeeper := utils.GetTopXPlayers(wicketKeepers, 1)

			for _, player := range top4Bowlers {
				teamResult.TotalRating += player.Rating
			}
			for _, player := range top4Batsmen {
				teamResult.TotalRating += player.Rating
			}
			for _, player := range top2AllRounders {
				teamResult.TotalRating += player.Rating
			}
			for _, player := range top1WicketKeeper {
				teamResult.TotalRating += player.Rating
			}

			teamResult.Players = append(teamResult.Players, top4Bowlers...)
			teamResult.Players = append(teamResult.Players, top4Batsmen...)
			teamResult.Players = append(teamResult.Players, top2AllRounders...)
			teamResult.Players = append(teamResult.Players, top1WicketKeeper...)

			TeamResultResponse = append(TeamResultResponse, teamResult)

			fmt.Println("TeamResultResponse: ", TeamResultResponse)
		}

		// Sort the slice in descending order of totalRating
		for i := 0; i < len(TeamResultResponse); i++ {
			for j := i + 1; j < len(TeamResultResponse); j++ {
				if TeamResultResponse[i].TotalRating < TeamResultResponse[j].TotalRating {
					TeamResultResponse[i], TeamResultResponse[j] = TeamResultResponse[j], TeamResultResponse[i]
				}
			}
		}

		utils.JSON(w, http.StatusOK, TeamResultResponse)
		return
	}
}
