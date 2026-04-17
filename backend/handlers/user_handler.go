package handlers

import (
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/mobml/sciobox/services"
)

// -----------------------------------
//
//	DTOs
//
// -----------------------------------
type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UpdateProfileRequest struct {
	Name     string `json:"name"`
	Password string `json:"password,omitempty"` // optional value
}

type UserHandler struct {
	svc services.UserService
}

func NewUserHandler(svc services.UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

func (h *UserHandler) Register(c fiber.Ctx) error {
	var req RegisterRequest
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid body request"})
	}

	if err := h.svc.Register(req.Name, req.Email, req.Password); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"message": "User created!"})
}

func (h *UserHandler) Login(c fiber.Ctx) error {
	var req LoginRequest
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid body request"})
	}

	token, err := h.svc.Login(req.Email, req.Password)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"token": token})
}

func (h *UserHandler) GetProfile(c fiber.Ctx) error {
	// we get the id of the user from the context (injected by the middleware)
	userIDStr := c.Locals("user_id").(string)
	id, _ := uuid.Parse(userIDStr)

	user, err := h.svc.GetProfile(id)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}

	return c.JSON(user)
}

func (h *UserHandler) GetAll(c fiber.Ctx) error {
	users, err := h.svc.GetAllUsers()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(users)
}

func (h *UserHandler) UpdateProfile(c fiber.Ctx) error {
	userIDStr := c.Locals("user_id").(string)
	id, _ := uuid.Parse(userIDStr)

	var req UpdateProfileRequest
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}

	if err := h.svc.UpdateUser(id, req.Name, req.Password); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "updating error has ocurred"})
	}

	return c.JSON(fiber.Map{"message": "Profiled Updated successfully"})
}

func (h *UserHandler) DeleteAccount(c fiber.Ctx) error {
	userIDStr := c.Locals("user_id").(string)
	id, _ := uuid.Parse(userIDStr)

	if err := h.svc.RemoveUser(id); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "deleting error has ocurred"})
	}

	return c.JSON(fiber.Map{"message": "account deleted successfully"})
}
