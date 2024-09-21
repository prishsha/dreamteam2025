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
		internationalCountSatsisfied := internationalCount <= 4

		resp["bowlerCountSatisfied"] = bowlerCountSatisfied
		resp["batsmanCountSatisfied"] = batsmanCountSatisfied
		resp["allRounderCountSatisfied"] = allRounderCountSatisfied
		resp["wicketKeeperCountSatisfied"] = wicketKeeperCountSatisfied
		resp["internationalCountSatisfied"] = internationalCountSatsisfied

		utils.JSON(w, http.StatusOK, resp)
	}
}

func GetAllUserTeamPlayers(queries *db.Queries) http.HandlerFunc {
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
			resp["error"] = "Only admins are allowed to view all user team players"
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		allUserTeamPlayers, err := queries.GetAllTeamPlayers(r.Context())

		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		type AllTeamPlayers struct {
			TeamId                       int         `json:"teamId"`
			TeamBalance                  int         `json:"teamBalance"`
			TeamName                     string      `json:"teamName"`
			Players                      []db.Player `json:"players"`
			BowlerCount                  int         `json:"bowlerCount"`
			BatsmanCount                 int         `json:"batsmanCount"`
			AllRounderCount              int         `json:"allRounderCount"`
			WicketKeeperCount            int         `json:"wicketKeeperCount"`
			InternationalCount           int         `json:"internationalCount"`
			BowlerCountSatisfied         bool        `json:"bowlerCountSatisfied"`
			BatsmanCountSatisfied        bool        `json:"batsmanCountSatisfied"`
			AllRounderCountSatisfied     bool        `json:"allRounderCountSatisfied"`
			WicketKeeperCountSatisfied   bool        `json:"wicketKeeperCountSatisfied"`
			InternationalCountSatsisfied bool        `json:"internationalCountSatisfied"`
		}

		var allTeamPlayersResponse []AllTeamPlayers
		allTeamPlayersResponse = make([]AllTeamPlayers, 0)

		for _, userTeamPlayer := range allUserTeamPlayers {
			var teamExists bool = false
			for i, team := range allTeamPlayersResponse {
				if team.TeamId == int(userTeamPlayer.TeamID) {
					if userTeamPlayer.ID.Valid {

						allTeamPlayersResponse[i].Players = append(allTeamPlayersResponse[i].Players,
							db.Player{
								ID:            userTeamPlayer.ID.Int32,
								Name:          userTeamPlayer.Name.String,
								Country:       userTeamPlayer.Country.String,
								Role:          userTeamPlayer.Role.String,
								Rating:        userTeamPlayer.Rating.Int32,
								BasePrice:     userTeamPlayer.BasePrice.Int32,
								AvatarUrl:     userTeamPlayer.AvatarUrl,
								TeamID:        userTeamPlayer.TeamID_2,
								IplTeam:       userTeamPlayer.IplTeam,
								IsUnsold:      userTeamPlayer.IsUnsold.Bool,
								SoldForAmount: userTeamPlayer.SoldForAmount.Int32,
							})
					}
					teamExists = true
					break
				}
			}

			if !teamExists {
				var allTeamPlayers AllTeamPlayers
				allTeamPlayers.TeamId = int(userTeamPlayer.TeamID)
				allTeamPlayers.TeamBalance = int(userTeamPlayer.TeamBalance)
				allTeamPlayers.TeamName = userTeamPlayer.IplTeamName
				allTeamPlayers.Players = make([]db.Player, 0)

				if userTeamPlayer.ID.Valid {
					allTeamPlayers.Players = append(allTeamPlayers.Players, db.Player{
						ID:            userTeamPlayer.ID.Int32,
						Name:          userTeamPlayer.Name.String,
						Country:       userTeamPlayer.Country.String,
						Role:          userTeamPlayer.Role.String,
						Rating:        userTeamPlayer.Rating.Int32,
						BasePrice:     userTeamPlayer.BasePrice.Int32,
						AvatarUrl:     userTeamPlayer.AvatarUrl,
						TeamID:        userTeamPlayer.TeamID_2,
						IplTeam:       userTeamPlayer.IplTeam,
						IsUnsold:      userTeamPlayer.IsUnsold.Bool,
						SoldForAmount: userTeamPlayer.SoldForAmount.Int32,
					})
				}

				allTeamPlayersResponse = append(allTeamPlayersResponse, allTeamPlayers)
			}
		}

		for i, team := range allTeamPlayersResponse {
			bowlerCount := 0
			batsmanCount := 0
			allRounderCount := 0
			wicketKeeperCount := 0
			internationalCount := 0

			for _, player := range team.Players {

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

			allTeamPlayersResponse[i].BowlerCount = bowlerCount
			allTeamPlayersResponse[i].BatsmanCount = batsmanCount
			allTeamPlayersResponse[i].AllRounderCount = allRounderCount
			allTeamPlayersResponse[i].WicketKeeperCount = wicketKeeperCount
			allTeamPlayersResponse[i].InternationalCount = internationalCount

			allTeamPlayersResponse[i].BowlerCountSatisfied = bowlerCount >= 4
			allTeamPlayersResponse[i].BatsmanCountSatisfied = batsmanCount >= 4
			allTeamPlayersResponse[i].AllRounderCountSatisfied = allRounderCount >= 2
			allTeamPlayersResponse[i].WicketKeeperCountSatisfied = wicketKeeperCount >= 1
			allTeamPlayersResponse[i].InternationalCountSatsisfied = internationalCount <= 4
		}

		utils.JSON(w, http.StatusOK, allTeamPlayersResponse)
	}
}
