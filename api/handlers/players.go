package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	db "github.com/milindmadhukar/dreamteam/db/sqlc"
	"github.com/milindmadhukar/dreamteam/models"
	"github.com/milindmadhukar/dreamteam/utils"
	"github.com/rs/zerolog/log"
)

func GetAllPlayers(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

		// TODO: Maybe add pagination support
		allPlayers, err := queries.GetAllPlayers(
			r.Context(),
			db.GetAllPlayersParams{
				Limit:  300,
				Offset: 0,
			},
		)

		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		utils.JSON(w, http.StatusOK, allPlayers)
		return
	}
}

type assignTeamToPlayerRequest struct {
	TeamId int `json:"teamId"`
}

func AssignTeamToPlayer(queries *db.Queries, clientManager *models.ClientManager, gameState *models.GameState) http.HandlerFunc {
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

		if gameState.CurrentPlayerInBid == nil || !gameState.IsBiddingActive || gameState.IsFinished {
			resp["error"] = "No active bid"
			log.Error().Msg("No active bid")
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		var req assignTeamToPlayerRequest
		err = json.NewDecoder(r.Body).Decode(&req)

		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		participatingTeam, err := queries.GetParticipatingTeam(r.Context(), int32(req.TeamId))
		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		currentPlayer := gameState.CurrentPlayerInBid
		currentBidAmount := gameState.CurrentBidAmount

		err = queries.AssignTeamToPlayer(r.Context(),
			db.AssignTeamToPlayerParams{
				ID:      participatingTeam.ID,
				Balance: currentBidAmount,
				ID_2:    currentPlayer.ID,
			})

		if err != nil {
			if db.ErrorCode(err) == db.CheckViolation {
				resp["error"] = "Insufficient balance"
				log.Error().Msg("Insufficient balance")
				utils.JSON(w, http.StatusBadRequest, resp)
				return
			}

			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		gameState.CurrentPlayerInBid = gameState.NextPlayerInBid
		gameState.CurrentBidAmount = gameState.NextPlayerInBid.BasePrice
		gameState.NextBidAmount = utils.CalculateNextBidAmount(gameState.NextPlayerInBid.BasePrice)

		nextPlayer, err := queries.GetRandomAvailablePlayer(r.Context())

		if err != nil {
			if err == sql.ErrNoRows {
				gameState.NextPlayerInBid = nil
			} else {
				resp["error"] = err.Error()
				log.Error().Msg(err.Error())
				utils.JSON(w, http.StatusInternalServerError, resp)
				return
			}
		} else {
			gameState.NextPlayerInBid = &nextPlayer
		}

		message := models.AssignMessage{
			Type:              "assignPlayer",
			ParticipatingTeam: participatingTeam,
			Player:            *currentPlayer,
			BidAmount:         int(currentBidAmount),
		}

		jsonData, err := json.Marshal(message)

		clientManager.Broadcast <- &models.ServerMessage{
			Message:   jsonData,
			GameState: gameState,
		}

		utils.JSON(w, http.StatusOK, resp)
		return
	}
}

func IncrementBidAmount(queries *db.Queries, clientManager *models.ClientManager, gameState *models.GameState) http.HandlerFunc {
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

		if gameState.CurrentPlayerInBid == nil || !gameState.IsBiddingActive || gameState.IsFinished {
			resp["error"] = "No active bid"
			log.Error().Msg("No active bid")
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		gameState.CurrentBidAmount = gameState.NextBidAmount
		gameState.NextBidAmount = utils.CalculateNextBidAmount(gameState.CurrentBidAmount)

		clientManager.Broadcast <- &models.ServerMessage{
			GameState: gameState,
		}

		utils.JSON(w, http.StatusOK, resp)
		return
	}
}

func DecrementBidAmount(queries *db.Queries, clientManager *models.ClientManager, gameState *models.GameState) http.HandlerFunc {
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

		if gameState.CurrentPlayerInBid == nil || !gameState.IsBiddingActive || gameState.IsFinished {
			resp["error"] = "No active bid"
			log.Error().Msg("No active bid")
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		if utils.CalculatePreviousBidAmount(gameState.CurrentBidAmount) < 0 {
			resp["error"] = "Minimum bid amount reached"
			log.Error().Msg("Minimum bid amount reached")
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		gameState.NextBidAmount = gameState.CurrentBidAmount
		gameState.CurrentBidAmount = utils.CalculatePreviousBidAmount(gameState.CurrentBidAmount)

		clientManager.Broadcast <- &models.ServerMessage{
			GameState: gameState,
		}

		utils.JSON(w, http.StatusOK, resp)
		return
	}
}
