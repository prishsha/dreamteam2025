package main

import (
	"fmt"

	"github.com/milindmadhukar/dreamteam/server"
)

func main() {
	fmt.Println("Starting...")
	s := server.New()
	s.RunServer()
}
