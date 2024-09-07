package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/websocket"
	db "github.com/milindmadhukar/dreamteam/db/sqlc"
	"github.com/milindmadhukar/dreamteam/models"
	"github.com/milindmadhukar/dreamteam/utils"
	"github.com/rs/zerolog/log"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func GameStateSocket(clientManger *models.ClientManager, gameState *models.GameState) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Error().Err(err).Msg("Failed to upgrade connection")
			return
		}

		client := &models.Client{Conn: conn}
		clientManger.Register <- client

		defer func() {
			clientManger.Unregister <- client
			conn.Close()
		}()

		serverMessage := models.ServerMessage{
			GameState: gameState,
			Message:   "Welcome to the game",
		}

		jsonData, err := json.Marshal(serverMessage)
		if err != nil {
			log.Error().Err(err).Msg("Failed to marshal message")
			return
		}

		err = conn.WriteMessage(websocket.TextMessage, jsonData)
		if err != nil {
			log.Error().Err(err).Msg("Failed to write message")
			return
		}

		for {
			_, _, err := conn.ReadMessage()
			if err != nil {
				log.Error().Err(err).Msg("Failed to read message")
				return
			}
		}

	}
}

func StartBidding(queries *db.Queries, clientManger *models.ClientManager, gameState *models.GameState) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

		if gameState.IsFinished {
			resp["error"] = "Game is already finished"
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		if gameState.IsBiddingActive {
			resp["error"] = "Bidding is already active"
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		gameState.IsBiddingActive = true

		// NOTE: idk the order as of now so just fetching the first id.
		firstPlayer, err := queries.GetPlayer(r.Context(), 1)
		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		nextPlayer, err := queries.GetPlayer(r.Context(), firstPlayer.ID+1)
		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		gameState.CurrentPlayerInBid = &firstPlayer
		gameState.NextPlayerInBid = &nextPlayer

		gameState.CurrentBidAmount = firstPlayer.BasePrice
		gameState.NextBidAmount = utils.CalculateNextBidAmount(firstPlayer.BasePrice)

		clientManger.Broadcast <- &models.ServerMessage{
			GameState: gameState,
		}

		utils.JSON(w, http.StatusOK, gameState)
	}
}
