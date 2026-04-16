package main

import (
	"github.com/gofiber/fiber/v3"
	"github.com/mobml/config"
	"github.com/mobml/models"
)

func main() {
	app := fiber.New()
	db := config.GetDB()

	db.AutoMigrate(
		&models.User{},
		&models.Folder{},
		&models.Resource{},
	)

	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Listen(":3000")
}
