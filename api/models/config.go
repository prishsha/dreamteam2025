package models

import (
	"fmt"
)

var Config Configuration

type DatabaseConf struct {
	Host     string `mapstructure:"host"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	Name     string `mapstructure:"name"`
	Port     string `mapstructure:"port"`
}

func (d *DatabaseConf) URI() string {
	uri := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", d.User, d.Password, d.Host, d.Port, d.Name)
	return uri
}

type APIConf struct {
	Host         string   `mapstructure:"host"`
	Port         string   `mapstructure:"port"`
	JWTSecretKey string   `mapstructure:"jwt_secret"`
	AdminEmails  []string `mapstructure:"admin_emails"`
	OAuthState   string   `mapstructure:"oauth_state"`
	SessionKey   string   `mapstructure:"session_key"`
	IsProd       bool     `mapstructure:"is_prod"`
	FrontendURL  string   `mapstructure:"frontend_url"`
}

type GoogleOAuthConf struct {
	ClientID     string `mapstructure:"client_id"`
	ClientSecret string `mapstructure:"client_secret"`
	RedirectURL  string `mapstructure:"redirect_url"`
}

type Configuration struct {
	API         *APIConf         `mapstructure:"api"`
	Database    *DatabaseConf    `mapstructure:"database"`
	GoogleOAuth *GoogleOAuthConf `mapstructure:"google_oauth"`
	// Logging     *Logging     `mapstructure:"logging"`
}

// type Logging struct {
// 	Debug          bool `mapstructure:"debug"`
// 	CommandLogging bool `mapstructure:"commandlogging"`
// 	Level          int  `mapstructure:"level"`
// }
