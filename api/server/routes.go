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

	mainRouter.Get("/players/all", handlers.GetAllPlayers(s.Queries))
	mainRouter.Post("/players/assign-team", handlers.AssignTeamToPlayer(s.Queries, s.ClientManager, s.GameState))
  mainRouter.Post("/players/unsold", handlers.AssignUnsoldToPlayers(s.Queries, s.ClientManager, s.GameState))
	mainRouter.Post("/players/increment-bid", handlers.IncrementBidAmount(s.Queries, s.ClientManager, s.GameState))
	mainRouter.Post("/players/decrement-bid", handlers.DecrementBidAmount(s.Queries, s.ClientManager, s.GameState))

	mainRouter.Get("/participatingteam/{participatingTeamId}", handlers.GetParticipatingTeam(s.Queries))
	mainRouter.Get("/participatingteam/all", handlers.GetAllParticipatingTeams(s.Queries))

	mainRouter.Get("/game/ws", handlers.GameStateSocket(s.ClientManager, s.GameState))
	mainRouter.Post("/game/start", handlers.StartBidding(s.Queries, s.ClientManager, s.GameState))
  mainRouter.Post("/game/end", handlers.EndBidding(s.Queries, s.ClientManager, s.GameState))

	mainRouter.Get("/auth/login", handlers.GetAuthURLHandler(s.OauthConf))
	mainRouter.Get("/auth/callback", handlers.CallbackHandler(s.Queries, s.OauthConf))
	mainRouter.Get("/auth/logout", handlers.LogoutHandler())
	mainRouter.Get("/auth/is-authenticated", handlers.IsAuthenticatedHandler(s.Queries))

  mainRouter.Get("/user/team/", handlers.GetUserTeamPlayers(s.Queries))
  mainRouter.Get("/user/team/all", handlers.GetAllUserTeamPlayers(s.Queries))

	fileRouter := chi.NewRouter()
	handlers.FileServer(fileRouter, "/", http.Dir("./assets/"))

	mainRouter.Mount("/admin", adminRouter)
	mainRouter.Mount("/assets", fileRouter)
}
