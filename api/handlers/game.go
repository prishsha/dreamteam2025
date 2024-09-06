package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/milindmadhukar/dreamteam/models"
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

		jsonData, err := json.Marshal(gameState)
		if err != nil {
			log.Error().Err(err).Msg("Failed to marshal game state")
			return
		}

		conn.WriteMessage(websocket.TextMessage, jsonData)
	}
}
