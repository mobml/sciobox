package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/static"
	"github.com/joho/godotenv"
	"github.com/mobml/sciobox/cmd/app"
)

func main() {
	err := godotenv.Load("../.env")
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

	if os.Getenv("ENV") == "development" {
		log.Println("Running in development mode, enabling CORS for all origins")
		server.Use(cors.New(cors.Config{
			AllowOrigins: []string{"*"},
			AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
			AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		}))
	}

	if os.Getenv("ENV") == "production" {
		server.Use("/", static.New("./dist"))
	}

	app.InitializeApp(server)

	log.Printf("Server running on port %s", port)
	log.Fatal(server.Listen(":" + port))
}
