package utils

import (
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/milindmadhukar/dreamteam/models"
)

func IsJWTValid(jwtToken string) (valid bool, claims jwt.MapClaims, err error) {
	token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(models.Config.API.JWTSecretKey), nil
	})

	if err != nil {
		return false, nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return true, claims, nil
	} else {
		return false, nil, err
	}
}

func GetUserIdFromJWT(jwtToken string) (userId int64, errMsg string, status int) {
	if jwtToken == "" {
		return -1, "No token provided", http.StatusBadRequest
	}

	valid, claims, err := IsJWTValid(jwtToken)

	if err != nil {
		return -1, err.Error(), http.StatusBadRequest
	}

	if !valid {
		return -1, "Invalid token as not valid", http.StatusUnauthorized
	}

  userIdFloat, ok := claims["id"].(float64)
  if !ok {
    return -1, "Invalid token as id not found", http.StatusUnauthorized
  }

  return int64(userIdFloat), "", http.StatusOK
}

func SetJWTOnCookie(id int64, tokenExpiry, now time.Time, w http.ResponseWriter) error {
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  id,
		"exp": tokenExpiry.Unix(),
		"iat": now.Unix(),
	})

	signedToken, err := jwtToken.SignedString([]byte(models.Config.API.JWTSecretKey))
	if err != nil {
		return err
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    signedToken,
		Path:     "/",
		Expires:  tokenExpiry,
		Secure:   false,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	return nil
}

func GetTokenJWT(id int64, tokenExpiry, now time.Time, w http.ResponseWriter) (string, error) {
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  id,
		"exp": tokenExpiry.Unix(),
		"iat": now.Unix(),
	})

	signedToken, err := jwtToken.SignedString([]byte(models.Config.API.JWTSecretKey))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}
