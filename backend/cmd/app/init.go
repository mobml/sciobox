package app

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/mobml/sciobox/config"
	"github.com/mobml/sciobox/models"
	"github.com/mobml/sciobox/repository"
	"github.com/mobml/sciobox/routes"
	"github.com/mobml/sciobox/services"
)

func InitializeApp(app *fiber.App) {
	db := config.GetDB()

	log.Println("Running database migrations...")
	err := db.AutoMigrate(
		&models.User{},
		&models.Folder{},
		&models.Resource{},
	)
	if err != nil {
		log.Fatal("Migration failed: ", err)
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET not found in .env file")
	}

	// Initialize layers (Dependency Injection)
	// --- Repositories ---
	userRepo := repository.NewUserRepository(db)

	// --- Services ---
	userSvc := services.NewUserService(userRepo, jwtSecret)

	// 5. Configurar Rutas y Handlers
	routes.SetupRoutes(app, userSvc, jwtSecret)

	log.Println("Application layers initialized successfully")
}
