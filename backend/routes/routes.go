package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/mobml/sciobox/handlers"
	"github.com/mobml/sciobox/middleware"
	"github.com/mobml/sciobox/services"
)

func SetupRoutes(app *fiber.App, userSvc services.UserService, secret string) {
	userHandler := handlers.NewUserHandler(userSvc)

	api := app.Group("/api/v1")

	// Public Routes
	auth := api.Group("/auth")
	auth.Post("/register", userHandler.Register)
	auth.Post("/login", userHandler.Login)

	// Protected Routes
	protected := api.Group("/", middleware.JWTMiddleware(secret))

	//Profile (Any authenticated user)
	protected.Get("/profile", userHandler.GetProfile)
	protected.Put("/profile", userHandler.UpdateProfile)
	protected.Delete("/profile", userHandler.DeleteAccount)

	// Admin (Only users with admin role)
	admin := protected.Group("/admin", middleware.AdminOnly)
	admin.Get("/users", userHandler.GetAll)
}
