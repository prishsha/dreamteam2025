package utils

import "github.com/milindmadhukar/dreamteam/models"

func IsAdmin(userEmail string) bool {
	for _, email := range models.Config.API.AdminEmails {
		if userEmail == email {
			return true
		}
	}
	return false
}
