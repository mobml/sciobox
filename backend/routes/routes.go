package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/mobml/sciobox/handlers"
	"github.com/mobml/sciobox/middleware"
	"github.com/mobml/sciobox/services"
)

func SetupRoutes(app *fiber.App, userSvc services.UserService, folderSrv services.FolderService, resourceSvc services.ResourceService, secret string) {
	userHandler := handlers.NewUserHandler(userSvc)
	folderHandler := handlers.NewFolderHandler(folderSrv)
	resourceHandler := handlers.NewResourceHandler(resourceSvc)

	api := app.Group("/api/v1")

	// Public Routes
	auth := api.Group("/auth")
	auth.Post("/register", userHandler.Register)
	auth.Post("/login", userHandler.Login)

	// Protected Routes
	protected := api.Group("/", middleware.JWTMiddleware(secret))

	//--------------------------------------------------
	//Profile (Any authenticated user)
	//--------------------------------------------------

	// user routes
	protected.Get("/profile", userHandler.GetProfile)
	protected.Put("/profile", userHandler.UpdateProfile)
	protected.Delete("/profile", userHandler.DeleteAccount)

	// folder routes
	folders := protected.Group("/folders")
	folders.Post("/", folderHandler.Create)
	folders.Get("/", folderHandler.GetAll)
	folders.Put("/:id", folderHandler.Update)
	folders.Delete("/:id", folderHandler.Delete)

	// resource route
	res := protected.Group("/resources")
	res.Post("/", resourceHandler.Create)
	res.Get("/", resourceHandler.GetAll)
	res.Get("/folder/:folderId", resourceHandler.GetByFolder)
	res.Put("/:id", resourceHandler.Update)
	res.Delete("/:id", resourceHandler.Delete)

	//--------------------------------------------------
	// Admin (Only users with admin role)
	//--------------------------------------------------
	admin := protected.Group("/admin", middleware.AdminOnly)
	admin.Get("/users", userHandler.GetAll)
}
