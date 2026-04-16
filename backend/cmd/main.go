package main

import (
	"github.com/gofiber/fiber/v3"
	"github.com/mobml/config"
)

func main() {
	app := fiber.New()
	config.ConnectDB()
	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Listen(":3000")
}
