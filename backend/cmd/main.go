package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/joho/godotenv"
	"github.com/mobml/sciobox/cmd/app"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
		log.Println("PORT not found in .env, defaulting to 3000")
	}

	server := fiber.New(fiber.Config{
		AppName: "sciobox API v1.0",
	})

	app.InitializeApp(server)

	log.Printf("Server running on port %s", port)
	log.Fatal(server.Listen(":" + port))
}
