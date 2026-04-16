package repository

import (
	"github.com/google/uuid"
	"github.com/mobml/models"
	"gorm.io/gorm"
)

type FolderRepository interface {
	Create(folder *models.Folder) error
	GetFoldersByUserID(userID uuid.UUID) ([]models.Folder, error)
	GetFolderByID(id uuid.UUID) (*models.Folder, error)
	UpdateFolder(folder *models.Folder) error
	DeleteFolder(id uuid.UUID) error
}

type folderRepository struct {
	db *gorm.DB
}

func NewFolderRepository(db *gorm.DB) FolderRepository {
	return &folderRepository{db: db}
}

func (f *folderRepository) Create(folder *models.Folder) error {
	return f.db.Create(folder).Error
}

func (f *folderRepository) GetFoldersByUserID(userID uuid.UUID) ([]models.Folder, error) {
	var folders []models.Folder
	err := f.db.Where("user_id = ?", userID).Find(&folders).Error
	return folders, err
}

func (f *folderRepository) GetFolderByID(id uuid.UUID) (*models.Folder, error) {
	var folder models.Folder
	err := f.db.First(&folder, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &folder, nil
}

func (f *folderRepository) UpdateFolder(folder *models.Folder) error {
	result := f.db.Model(folder).Updates(folder)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (f *folderRepository) DeleteFolder(id uuid.UUID) error {
	result := f.db.Delete(&models.Folder{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
