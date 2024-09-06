package models

import (
	"sync"

	"github.com/gorilla/websocket"
	"github.com/rs/zerolog/log"
)

type Client struct {
	Conn *websocket.Conn
}

type ClientManager struct {
	Clients    map[*Client]bool
	Broadcast  chan []byte
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
			for client := range manager.Clients {
				err := client.Conn.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					client.Conn.Close()
					delete(manager.Clients, client)
				}
			}
			manager.Mutex.Unlock()
			log.Info().Msgf("Broadcasted message to %d clients", len(manager.Clients))
		}
	}
}
