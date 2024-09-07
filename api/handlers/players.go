package handlers

import (
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

		if gameState.CurrentPlayerInBid == nil || !gameState.IsBiddingActive || gameState.IsFinished {
			resp["error"] = "No active bid"
			log.Error().Msg("No active bid")
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		var req assignTeamToPlayerRequest
		err := json.NewDecoder(r.Body).Decode(&req)

		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		err = queries.AssignTeamToPlayer(r.Context(),
			db.AssignTeamToPlayerParams{
				ID:      int32(req.TeamId),
				ID_2:    gameState.CurrentPlayerInBid.ID,
				Balance: gameState.CurrentBidAmount,
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
		gameState.CurrentBidAmount = gameState.CurrentPlayerInBid.BasePrice
		gameState.NextBidAmount = utils.CalculateNextBidAmount(gameState.CurrentBidAmount)

		nextPlayer, err := queries.GetPlayer(r.Context(), gameState.CurrentPlayerInBid.ID+1)
    if err != nil {
      resp["error"] = err.Error()
      log.Error().Msg(err.Error())
      utils.JSON(w, http.StatusInternalServerError, resp)
      return
    }

		gameState.NextPlayerInBid = &nextPlayer

		clientManager.Broadcast <- &models.ServerMessage{
      GameState: gameState,
    }

		utils.JSON(w, http.StatusOK, resp)
		return
	}
}

func IncrementBidAmount(clientManager *models.ClientManager, gameState *models.GameState) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

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
