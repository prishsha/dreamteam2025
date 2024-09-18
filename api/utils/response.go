package utils

import (
	"encoding/json"
	"net/http"

	"github.com/rs/zerolog/log"
)

// JSON returns a well formated response with a status code
func JSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.WriteHeader(statusCode)
	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		log.Warn().Err(err).Msg("Failed to encode response")
		w.WriteHeader(500)
		er := json.NewEncoder(w).Encode(map[string]interface{}{"error": "something unexpected occurred.", "message": err.Error()})
		if er != nil {
			return
		}
	}
}
