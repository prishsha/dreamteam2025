package models

import (
	"encoding/json"
	"sync"

	"github.com/gorilla/websocket"
	db "github.com/milindmadhukar/dreamteam/db/sqlc"
	"github.com/rs/zerolog/log"
)

type AssignMessage struct {
  Type string `json:"type"`
  ParticipatingTeam db.ParticipantTeam `json:"participatingTeam"`
  Player db.GetRandomAvailablePlayerRow `json:"player"`
  BidAmount int `json:"bidAmount"`
}

type ServerMessage struct {
	Message   json.RawMessage     `json:"message,omitempty"`
	GameState *GameState `json:"gameState,omitempty"`
}

type Client struct {
	Conn *websocket.Conn
}

type ClientManager struct {
	Clients    map[*Client]bool
	Broadcast  chan *ServerMessage
	Register   chan *Client
	Unregister chan *Client
	Mutex      sync.Mutex
}

func (manager *ClientManager) Run() {
	for {
		select {
		case client := <-manager.Register:
			manager.Mutex.Lock()
			manager.Clients[client] = true
			manager.Mutex.Unlock()
			log.Info().Msgf("New client registered. Total clients: %d", len(manager.Clients))
		case client := <-manager.Unregister:
			manager.Mutex.Lock()
			if _, ok := manager.Clients[client]; ok {
				delete(manager.Clients, client)
				client.Conn.Close()
				manager.Mutex.Unlock()
				log.Info().Msgf("Client unregistered. Total clients: %d", len(manager.Clients))
			}
		case message := <-manager.Broadcast:
			manager.Mutex.Lock()
			var wg sync.WaitGroup
			wg.Add(len(manager.Clients))
			go func() {
				for client := range manager.Clients {
					jsonData, err := json.Marshal(message)
					if err != nil {
						log.Error().Err(err).Msg("Failed to marshal game state")
						return
					}

					err = client.Conn.WriteMessage(websocket.TextMessage, jsonData)
					if err != nil {
						client.Conn.Close()
						delete(manager.Clients, client)
					}
					wg.Done()
				}
			}()
			wg.Wait()
			manager.Mutex.Unlock()
			log.Info().Msgf("Broadcasted message to %d clients", len(manager.Clients))
		}
	}
}
