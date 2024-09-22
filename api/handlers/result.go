package handlers

import (
	"fmt"
	"net/http"
	"sort"

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

			// Sort players in descending order of rating
			sort.Slice(teamPlayers, func(i, j int) bool {
				return teamPlayers[i].Rating > teamPlayers[j].Rating
			})

      var remainingPlayers []db.GetTeamPlayersRow

			top11 := teamPlayers
			if len(teamPlayers) > 11 {
				top11 = teamPlayers[:11]
				remainingPlayers = teamPlayers[11:]
			} else {
				remainingPlayers = []db.GetTeamPlayersRow{}
			}

			// Check and adjust for foreign players limit
			foreignCount := 0
			for _, player := range top11 {
				if player.Country != "India" {
					foreignCount++
				}
			}

			for foreignCount > 4 && len(remainingPlayers) > 0 {
				// Find the lowest rated foreign player in top11
				lowestForeignIndex := -1
				lowestForeignRating := int32(1000000)
				for i, player := range top11 {
					if player.Country != "India" && player.Rating < lowestForeignRating {
						lowestForeignIndex = i
						lowestForeignRating = player.Rating
					}
				}

				// Find the highest rated Indian player in remainingPlayers
				highestIndianIndex := -1
				highestIndianRating := int32(0)
				for i, player := range remainingPlayers {
					if !(player.Country != "India") && player.Rating > highestIndianRating {
						highestIndianIndex = i
						highestIndianRating = player.Rating
					}
				}

				if lowestForeignIndex != -1 && highestIndianIndex != -1 {
					// Swap players
					top11[lowestForeignIndex], remainingPlayers[highestIndianIndex] = remainingPlayers[highestIndianIndex], top11[lowestForeignIndex]
					foreignCount--
				} else {
					break
				}
			}

			// Check and adjust for role requirements
			bowlerCount := 0
			batsmanCount := 0
			allrounderCount := 0
			wicketkeeperCount := 0

			for _, player := range top11 {
				switch player.Role {
				case "Bowler":
					bowlerCount++
				case "Batsman":
					batsmanCount++
				case "All-rounder":
					allrounderCount++
				case "Wicket-keeper":
					wicketkeeperCount++
				}
			}

			teamResult.ValidTeam = bowlerCount >= 4 && batsmanCount >= 4 && allrounderCount >= 2 && wicketkeeperCount >= 1 && foreignCount <= 4

			if teamResult.ValidTeam {
				teamResult.Players = top11
				// Calculate total rating
				for _, player := range top11 {
					teamResult.TotalRating += player.Rating
				}
			} else {
				teamResult.Players = nil
				teamResult.TotalRating = 0
			}

			// Calculate total rating
			for _, player := range top11 {
				teamResult.TotalRating += player.Rating
			}

			TeamResultResponse = append(TeamResultResponse, teamResult)

			fmt.Println("TeamResultResponse: ", TeamResultResponse)

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
