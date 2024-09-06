package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/milindmadhukar/dreamteam/handlers"
)

// Function to handle routes
func (s *Server) HandleRoutes(mainRouter *chi.Mux) {

	mainRouter.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Dream Team API!"))
	})

	// TODO: Maybe could add a middleware to check if admin or not
	adminRouter := chi.NewRouter()

	playersRouter := chi.NewRouter()
	playersRouter.Get("/all", handlers.GetAllPlayers(s.Queries))

	fileRouter := chi.NewRouter()
	handlers.FileServer(fileRouter, "/", http.Dir("./assets/"))

  mainRouter.Mount("/game/ws", handlers.GameStateSocket(s.ClientManager, s.GameState))

	mainRouter.Mount("/admin", adminRouter)
	mainRouter.Mount("/players", playersRouter)
	mainRouter.Mount("/assets", fileRouter)
}
