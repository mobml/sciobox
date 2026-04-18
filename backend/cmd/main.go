package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
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

	server.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
	}))

	app.InitializeApp(server)

	log.Printf("Server running on port %s", port)
	log.Fatal(server.Listen(":" + port))
}
