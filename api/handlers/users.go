package handlers

import (
	"net/http"

	db "github.com/milindmadhukar/dreamteam/db/sqlc"
	"github.com/milindmadhukar/dreamteam/utils"
)

func GetUserteamPlayers(queries *db.Queries) http.HandlerFunc {
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

    if !dbUser.ParticipantTeamID.Valid {
      resp["error"] = "User does not have a team"
      utils.JSON(w, http.StatusBadRequest, resp)
      return
    }

		userTeamPlayers, err := queries.GetTeamPlayers(r.Context(), int64(dbUser.ID))

		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		utils.JSON(w, http.StatusOK, userTeamPlayers)
	}
}
