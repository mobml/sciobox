package repository

import (
	"github.com/google/uuid"
	"github.com/mobml/sciobox/models"
	"gorm.io/gorm"
)

type ResourceRepository interface {
	Create(resource *models.Resource) error
	GetResourcesByUserID(userID uuid.UUID) ([]models.Resource, error)
	GetResourceByID(id uuid.UUID) (*models.Resource, error)
	GetResourcesByFolderID(folderID uuid.UUID) ([]models.Resource, error)
	UpdateResource(resource *models.Resource) error
	DeleteResource(id uuid.UUID) error
}

type resourceRepository struct {
	db *gorm.DB
}

func NewResourceRepository(db *gorm.DB) ResourceRepository {
	return &resourceRepository{db: db}
}

func (r *resourceRepository) Create(resource *models.Resource) error {
	return r.db.Create(resource).Error
}

func (r *resourceRepository) GetResourcesByUserID(userID uuid.UUID) ([]models.Resource, error) {
	var resources []models.Resource
	err := r.db.Where("user_id = ?", userID).Find(&resources).Error
	return resources, err
}

func (r *resourceRepository) GetResourceByID(id uuid.UUID) (*models.Resource, error) {
	var resource models.Resource
	err := r.db.First(&resource, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &resource, nil
}

func (r *resourceRepository) GetResourcesByFolderID(folderID uuid.UUID) ([]models.Resource, error) {
	var resources []models.Resource
	err := r.db.Where("folder_id = ?", folderID).Find(&resources).Error
	return resources, err
}

func (r *resourceRepository) UpdateResource(resource *models.Resource) error {
	result := r.db.Model(resource).Updates(resource)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *resourceRepository) DeleteResource(id uuid.UUID) error {
	result := r.db.Delete(&models.Resource{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
