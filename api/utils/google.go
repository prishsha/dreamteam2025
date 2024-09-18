package utils

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	db "github.com/milindmadhukar/dreamteam/db/sqlc"
	"github.com/milindmadhukar/dreamteam/models"
	"github.com/rs/zerolog/log"
)

func GetGoogleProfile(accessToken, tokenType string) (*models.GoogleAuthResponse, error) {
	req, err := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v4/userinfo", nil)
	if err != nil {
		return nil, err
	}

	var googleUser models.GoogleAuthResponse

	req.Header.Set("Authorization", tokenType+" "+accessToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("bad status: %s", resp.Status)
	}

	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		return nil, err
	}

	return &googleUser, nil
}

func RefreshGoogleToken(refresh_token string) (*db.CreateOrUpdateGoogleTokensParams, error) {
	reqBody := url.Values{
		"grant_type":    {"refresh_token"},
		"refresh_token": {refresh_token},
		"client_id":     {models.Config.GoogleOAuth.ClientID},
		"client_secret": {models.Config.GoogleOAuth.ClientSecret},
	}

	req, err := http.NewRequest("POST", "https://www.googleapis.com/oauth2/v4/token", strings.NewReader(reqBody.Encode()))

	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	googleResp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer googleResp.Body.Close()

	// Convert to string and print
	body, err := io.ReadAll(googleResp.Body)
	fmt.Println(string(body))

	return nil, nil

}

func GetOrUpdateGoogleToken(id int64, queries *db.Queries, ctx context.Context, w http.ResponseWriter) (*db.GoogleToken, error) {
	token, err := queries.GetGoogleToken(ctx, id)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, errors.New("No such user exists.")
	}
	if err != nil {
		return nil, err
	}

	if time.Now().UTC().After(token.ExpiresAt) {
		if token.RefreshToken == "" {
			log.Warn().Msg("Refresh token is empty.")
			return nil, errors.New("Refresh token is empty.")
		}

		updateParams, err := RefreshGoogleToken(token.RefreshToken)
		if err != nil {
			return nil, err
		}
		updateParams.UserID = id

		token, err = queries.CreateOrUpdateGoogleTokens(
			ctx,
			*updateParams,
		)

		if err != nil {
			return nil, err
		}
	}

	return &token, nil
}
