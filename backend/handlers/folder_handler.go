package handlers

import (
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/mobml/sciobox/services"
)

type FolderRequest struct {
	Name string `json:"name"`
}

type FolderHandler struct {
	svc services.FolderService
}

func NewFolderHandler(svc services.FolderService) *FolderHandler {
	return &FolderHandler{svc: svc}
}

func (h *FolderHandler) Create(c fiber.Ctx) error {
	userID := uuid.MustParse(c.Locals("user_id").(string))

	var req FolderRequest
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid data"})
	}

	if err := h.svc.CreateFolder(req.Name, userID); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"message": "folder created"})
}

func (h *FolderHandler) GetAll(c fiber.Ctx) error {
	userID := uuid.MustParse(c.Locals("user_id").(string))

	folders, err := h.svc.GetUserFolders(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(folders)
}

func (h *FolderHandler) Update(c fiber.Ctx) error {
	userID := uuid.MustParse(c.Locals("user_id").(string))
	folderID, _ := uuid.Parse(c.Params("id"))

	var req FolderRequest
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid data"})
	}

	if err := h.svc.UpdateFolderName(folderID, userID, req.Name); err != nil {
		return c.Status(403).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "The folder has been updated"})
}

func (h *FolderHandler) Delete(c fiber.Ctx) error {
	userID := uuid.MustParse(c.Locals("user_id").(string))
	folderID, _ := uuid.Parse(c.Params("id"))

	if err := h.svc.DeleteFolder(folderID, userID); err != nil {
		return c.Status(403).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "The folder has been deleted"})
}
