package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"time"

	db "github.com/milindmadhukar/dreamteam/db/sqlc"
	"github.com/rs/zerolog/log"

	"github.com/milindmadhukar/dreamteam/models"
	"github.com/milindmadhukar/dreamteam/utils"
	"golang.org/x/oauth2"
)

func GetAuthURLHandler(oauthConf *oauth2.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})
		base_url := oauthConf.AuthCodeURL(models.Config.API.OAuthState, oauth2.AccessTypeOffline)

		URL, err := url.Parse(base_url)
		if err != nil {
			log.Error().Msg(err.Error())
		}

		parameters := URL.Query()
		parameters.Add("login_hint", "martin.garrix1996@vitstudent.ac.in")
		parameters.Add("hd", "vitstudent.ac.in")
		URL.RawQuery = parameters.Encode()
		base_url = URL.String()

		resp["url"] = base_url
		utils.JSON(w, http.StatusOK, resp)
	}
}

func CallbackHandler(queries *db.Queries, oauthConf *oauth2.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})
		state := r.FormValue("state")
		if state != models.Config.API.OAuthState {
			resp["error"] = "Invalid state"
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}
		code := r.FormValue("code")
		googleTokens, err := oauthConf.Exchange(r.Context(),
			code,
			oauth2.SetAuthURLParam("client_id", oauthConf.ClientID),
			oauth2.SetAuthURLParam("client_secret", oauthConf.ClientSecret),
		)
		if err != nil {
			resp["error"] = err.Error()
			resp["message"] = "Failed to exchange code for tokens"
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		now := time.Now().UTC()

		client := oauthConf.Client(r.Context(), googleTokens)
		clientUser, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
		if err != nil {
			resp["error"] = err.Error()
			resp["message"] = "Failed to get user info"
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		var googleUser models.GoogleUser
		if err = json.NewDecoder(clientUser.Body).Decode(&googleUser); err != nil {
			resp["error"] = err.Error()
			resp["message"] = "Failed to decode user info"
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		dbUser, err := queries.CreateOrUpdateUser(
			r.Context(),
			db.CreateOrUpdateUserParams{
				Email:      googleUser.Email,
				Name:       googleUser.Name,
				GivenName:  googleUser.GivenName,
				FamilyName: googleUser.FamilyName,
				Picture:    googleUser.Picture,
			},
		)

		if err != nil {
			resp["error"] = err.Error()
			resp["message"] = "Failed to create or update user"
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		token, err := queries.CreateOrUpdateGoogleTokens(r.Context(), db.CreateOrUpdateGoogleTokensParams{
			UserID:       dbUser.ID,
			CreatedAt:    now,
			RefreshToken: googleTokens.RefreshToken,
			AccessToken:  googleTokens.AccessToken,
			ExpiresAt:    googleTokens.Expiry.UTC(),
			TokenType:    googleTokens.TokenType,
		})

		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		err = utils.SetJWTOnCookie(dbUser.ID, token.ExpiresAt, now, w)

		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		http.Redirect(w, r, models.Config.API.FrontendURL, http.StatusFound)
		return
	}
}

func LogoutHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var resp map[string]interface{} = make(map[string]interface{})

		err := utils.SetJWTOnCookie(69420, time.Now().Add(time.Duration(5)), time.Now(), w)
		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		http.Redirect(w, r, models.Config.API.FrontendURL+"/login", http.StatusFound)
	}
}

func IsAuthenticatedHandler(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})
		jwtToken, err := r.Cookie("token")
		var respStatus int
		if err != nil {
			if errors.Is(err, http.ErrNoCookie) {
				resp["error"] = "No token provided"
				resp["is_authenticated"] = false
				respStatus = http.StatusUnauthorized
			} else {
				resp["error"] = err.Error()
				respStatus = http.StatusInternalServerError
			}
			utils.JSON(w, respStatus, resp)
			return
		}

		userId, errMsg, status := utils.GetUserIdFromJWT(jwtToken.Value)
		if errMsg != "" {
			resp["error"] = errMsg
			utils.JSON(w, status, resp)
			return
		}

		_, err = utils.GetOrUpdateGoogleToken(userId, queries, r.Context(), w)
		if err != nil {
			resp["error"] = err.Error()
			resp["is_authenticated"] = false
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		user, err := queries.GetUser(r.Context(), userId)
		if err != nil {
			resp["error"] = err.Error()
			resp["is_authenticated"] = false
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		resp["is_authenticated"] = true
		resp["user"] = user
		utils.JSON(w, http.StatusOK, resp)
	}
}

func IsAdminHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
	}
}
