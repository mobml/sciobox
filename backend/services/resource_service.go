package services

import (
	"errors"
	"net/http"

	"github.com/dyatlov/go-opengraph/opengraph"
	"github.com/google/uuid"
	"github.com/mobml/sciobox/models"
	"github.com/mobml/sciobox/repository"
)

type ResourceService interface {
	CreateResource(url string, folderID *uuid.UUID, userID uuid.UUID) error
	GetUserResources(userID uuid.UUID) ([]models.Resource, error)
	GetResourcesByFolder(folderID, userID uuid.UUID) ([]models.Resource, error)
	UpdateResource(id, userID uuid.UUID, title, url, description string, folderID *uuid.UUID) error
	DeleteResource(id, userID uuid.UUID) error
}

type resourceService struct {
	repo       repository.ResourceRepository
	folderRepo repository.FolderRepository
}

func NewResourceService(repo repository.ResourceRepository, folderRepo repository.FolderRepository) ResourceService {
	return &resourceService{repo: repo, folderRepo: folderRepo}
}

func (s *resourceService) CreateResource(url string, folderID *uuid.UUID, userID uuid.UUID) error {
	//Fetch metadata from URL
	title, desc, image := s.fetchMetadata(url)

	resource := &models.Resource{
		URL:         url,
		Title:       title,
		Description: &desc,
		ImageURL:    &image,
		FolderID:    folderID,
		UserID:      userID,
	}

	return s.repo.Create(resource)
}

func (s *resourceService) fetchMetadata(targetUrl string) (string, string, string) {
	client := &http.Client{}
	req, _ := http.NewRequest("GET", targetUrl, nil)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

	title := "..."
	description := ""
	imageUrl := ""

	res, err := client.Do(req)
	if err != nil {
		return title, description, imageUrl
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return title, description, imageUrl
	}

	og := opengraph.NewOpenGraph()
	err = og.ProcessHTML(res.Body)
	if err != nil {
		return title, description, imageUrl
	}

	title = og.Title
	description = og.Description

	if len(og.Images) > 0 {
		imageUrl = og.Images[0].URL
	}

	return title, description, imageUrl
}

func (s *resourceService) GetUserResources(userID uuid.UUID) ([]models.Resource, error) {
	return s.repo.GetResourcesByUserID(userID)
}

func (s *resourceService) GetResourcesByFolder(folderID, userID uuid.UUID) ([]models.Resource, error) {
	// Logic to ensure user owns the folder should be here or in folder validation
	folder, err := s.folderRepo.GetFolderByID(folderID)
	if err != nil {
		return nil, errors.New("folder not found")
	}

	if folder.UserID != userID {
		return nil, errors.New("unauthorized: this folder does not belong to you")
	}
	return s.repo.GetResourcesByFolderID(folderID)

}

func (s *resourceService) UpdateResource(id, userID uuid.UUID, title, url, description string, folderID *uuid.UUID) error {
	res, err := s.repo.GetResourceByID(id)
	if err != nil {
		return err
	}

	if res.UserID != userID {
		return errors.New("unauthorized: you do not own this resource")
	}

	if title != "" {
		res.Title = title
	}

	if url != "" {
		res.URL = url
	}

	if description != "" {
		res.Description = &description
	}
	res.FolderID = folderID

	return s.repo.UpdateResource(res)
}

func (s *resourceService) DeleteResource(id, userID uuid.UUID) error {
	res, err := s.repo.GetResourceByID(id)
	if err != nil {
		return err
	}

	if res.UserID != userID {
		return errors.New("unauthorized: you do not own this resource")
	}

	return s.repo.DeleteResource(id)
}
