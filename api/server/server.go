package server

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/httplog"
	"github.com/milindmadhukar/dreamteam/models"
	"github.com/milindmadhukar/dreamteam/utils"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"

	db "github.com/milindmadhukar/dreamteam/db/sqlc"

	_ "github.com/jackc/pgx/v5/stdlib"
)

type Server struct {
	Router        *chi.Mux
	Queries       *db.Queries
	DB            *sql.DB
	GameState     *models.GameState
	ClientManager *models.ClientManager
	Logger        zerolog.Logger
	OauthConf     *oauth2.Config
}

func New() *Server {
	s := &Server{}
	configFromFile, err := utils.LoadConfig("./configs", "config", "yml")
	if err != nil {
		log.Fatal().Msg(err.Error())
	}
	models.Config = *configFromFile

	s.PrepareLogger()

	if err := s.PrepareDB(); err != nil {
		log.Fatal().Msg(err.Error())
	}

	s.PrepareOauth2()
	s.PrepareRouter()
	s.InitalizeGameState()

	return s
}

func (s *Server) PrepareLogger() {
	file, err := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to open log file")
	}

	consoleWriter := zerolog.ConsoleWriter{Out: os.Stdout}
	multi := zerolog.MultiLevelWriter(consoleWriter, file)

	logger := zerolog.New(multi).With().Timestamp().Logger()
	log.Logger = logger
	s.Logger = logger
}

func (s *Server) PrepareDB() error {
	tries := 5
	DB, err := sql.Open("pgx", models.Config.Database.URI())
	if err != nil {
		return nil
	}

	for tries > 0 {
		log.Info().Msg("Attempting to make a connection to the dreamteam database...")
		err = DB.Ping()
		if err != nil {
			tries -= 1
			log.Info().Msg(err.Error() + "\nCould not connect. Retrying...")
			time.Sleep(8 * time.Second)
			continue
		}
		s.Queries = db.New(DB)
		s.DB = DB
		log.Info().Msg("Connection to the dreamteam database established.")
		return nil
	}
	return errors.New("Could not make a connection to the database.")
}

func (s *Server) PrepareRouter() {

	r := chi.NewRouter()

	r.Use(httplog.RequestLogger(s.Logger))
	r.Use(middleware.Heartbeat("/ping"))

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "PUT", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	s.Router = r
}

func (s *Server) PrepareOauth2() {
	s.OauthConf = &oauth2.Config{
		RedirectURL:  models.Config.GoogleOAuth.RedirectURL,
		ClientID:     models.Config.GoogleOAuth.ClientID,
		ClientSecret: models.Config.GoogleOAuth.ClientSecret,
		Scopes:       []string{"email", "profile"},
		Endpoint:     google.Endpoint,
	}
}

func (s *Server) InitalizeGameState() {

	// TODO: Should I persist the game state in case of server shutdown?

	s.GameState = &models.GameState{
		IsBiddingActive:    false,
		IsFinished:         false,
		CurrentPlayerInBid: nil,
		CurrentBidAmount:   0,
	}

	s.ClientManager = &models.ClientManager{
		Clients:    make(map[*models.Client]bool),
		Broadcast:  make(chan *models.ServerMessage),
		Register:   make(chan *models.Client),
		Unregister: make(chan *models.Client),
	}

	go s.ClientManager.Run()

	log.Info().Msg("Game State Initialized")
}

func (s *Server) RunServer() (err error) {
	apiRouter := chi.NewRouter()
	s.HandleRoutes(apiRouter)
	s.Router.Mount("/", apiRouter)
	log.Info().Msg(fmt.Sprintf("Starting Server at %s:%s", models.Config.API.Host, models.Config.API.Port))
	err = http.ListenAndServe(fmt.Sprintf("%s:%s", models.Config.API.Host, models.Config.API.Port), s.Router)
	if err != nil {
		log.Fatal().Msg(err.Error())
	}

	return
}
