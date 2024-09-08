package handlers

import (
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	db "github.com/milindmadhukar/dreamteam/db/sqlc"
	"github.com/milindmadhukar/dreamteam/utils"
	"github.com/rs/zerolog/log"
)

func GetParticipatingTeam(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

		participatingTeamIdStr := chi.URLParam(r, "participatingTeamId")
    participatingTeamId, err := strconv.Atoi(participatingTeamIdStr)
    if err != nil {
      resp["error"] = "Invalid participatingTeamId"
      log.Error().Msg("Invalid participatingTeamId")
      utils.JSON(w, http.StatusBadRequest, resp)
      return
    }

		team, err := queries.GetParticipatingTeam(
			r.Context(),
      int32(participatingTeamId),
		)

		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		utils.JSON(w, http.StatusOK, team)
		return
	}
}

func GetAllParticipatingTeams(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

		allTeams, err := queries.GetAllParticipatingTeams(
			r.Context(),
		)

		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		utils.JSON(w, http.StatusOK, allTeams)
		return
	}
}
