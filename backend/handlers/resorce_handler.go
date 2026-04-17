package handlers

import (
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/mobml/sciobox/services"
)

type CreateResourceRequest struct {
	URL      string     `json:"url"`
	FolderID *uuid.UUID `json:"folder_id"`
}

type UpdateResourceRequest struct {
	Title       string     `json:"title"`
	URL         string     `json:"url"`
	Description string     `json:"description"`
	FolderID    *uuid.UUID `json:"folder_id"`
}

type ResourceHandler struct {
	svc services.ResourceService
}

func NewResourceHandler(svc services.ResourceService) *ResourceHandler {
	return &ResourceHandler{svc: svc}
}

func (h *ResourceHandler) Create(c fiber.Ctx) error {
	userID := uuid.MustParse(c.Locals("user_id").(string))

	var req CreateResourceRequest
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	if err := h.svc.CreateResource(req.URL, req.FolderID, userID); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"message": "resource created successfully"})
}

func (h *ResourceHandler) GetAll(c fiber.Ctx) error {
	userID := uuid.MustParse(c.Locals("user_id").(string))

	resources, err := h.svc.GetUserResources(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(resources)
}

func (h *ResourceHandler) GetByFolder(c fiber.Ctx) error {
	userID := uuid.MustParse(c.Locals("user_id").(string))
	folderID, err := uuid.Parse(c.Params("folderId"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid folder id"})
	}

	resources, err := h.svc.GetResourcesByFolder(folderID, userID)
	if err != nil {
		// This will catch the "unauthorized" error from service
		return c.Status(403).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(resources)
}

func (h *ResourceHandler) Update(c fiber.Ctx) error {
	userID := uuid.MustParse(c.Locals("user_id").(string))
	resID, _ := uuid.Parse(c.Params("id"))

	var req UpdateResourceRequest
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	if err := h.svc.UpdateResource(resID, userID, req.Title, req.URL, req.Description, req.FolderID); err != nil {
		return c.Status(403).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "resource updated successfully"})
}

func (h *ResourceHandler) Delete(c fiber.Ctx) error {
	userID := uuid.MustParse(c.Locals("user_id").(string))
	resID, _ := uuid.Parse(c.Params("id"))

	if err := h.svc.DeleteResource(resID, userID); err != nil {
		return c.Status(403).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "resource deleted successfully"})
}
