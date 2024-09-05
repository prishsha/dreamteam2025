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
	Host            string   `mapstructure:"host"`
	Port            string   `mapstructure:"port"`
}

type Configuration struct {
	API      *APIConf      `mapstructure:"api"`
	Database *DatabaseConf `mapstructure:"database"`
	// Logging     *Logging     `mapstructure:"logging"`
}

// type Logging struct {
// 	Debug          bool `mapstructure:"debug"`
// 	CommandLogging bool `mapstructure:"commandlogging"`
// 	Level          int  `mapstructure:"level"`
// }
