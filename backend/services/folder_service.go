package services

import (
	"errors"
	"github.com/google/uuid"
	"github.com/mobml/sciobox/models"
	"github.com/mobml/sciobox/repository"
)

type FolderService interface {
	CreateFolder(name string, userID uuid.UUID) error
	GetUserFolders(userID uuid.UUID) ([]models.Folder, error)
	GetFolderDetails(folderID, userID uuid.UUID) (*models.Folder, error)
	UpdateFolderName(folderID, userID uuid.UUID, newName string) error
	DeleteFolder(folderID, userID uuid.UUID) error
}

type folderService struct {
	repo repository.FolderRepository
}

func NewFolderService(repo repository.FolderRepository) FolderService {
	return &folderService{repo: repo}
}

func (s *folderService) CreateFolder(name string, userID uuid.UUID) error {
	folder := &models.Folder{
		Name:   name,
		UserID: userID,
	}
	return s.repo.Create(folder)
}

func (s *folderService) GetUserFolders(userID uuid.UUID) ([]models.Folder, error) {
	return s.repo.GetFoldersByUserID(userID)
}

func (s *folderService) GetFolderDetails(folderID, userID uuid.UUID) (*models.Folder, error) {
	folder, err := s.repo.GetFolderByID(folderID)
	if err != nil {
		return nil, err
	}

	// Validate user
	if folder.UserID != userID {
		return nil, errors.New("You do not have permission to view this folder")
	}

	return folder, nil
}

func (s *folderService) UpdateFolderName(folderID, userID uuid.UUID, newName string) error {
	folder, err := s.repo.GetFolderByID(folderID)
	if err != nil {
		return err
	}

	if folder.UserID != userID {
		return errors.New("You do not have permission to modify this folder")
	}

	folder.Name = newName
	return s.repo.UpdateFolder(folder)
}

func (s *folderService) DeleteFolder(folderID, userID uuid.UUID) error {
	folder, err := s.repo.GetFolderByID(folderID)
	if err != nil {
		return err
	}

	if folder.UserID != userID {
		return errors.New("You do not have permission to delete this folder")
	}

	return s.repo.DeleteFolder(folderID)
}
