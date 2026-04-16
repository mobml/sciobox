package repository

import (
	"github.com/google/uuid"
	"github.com/mobml/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *models.User) error
	GetUsers() ([]models.User, error)
	GetUserByID(id uuid.UUID) (*models.User, error)
	GetUserByEmail(email string) (*models.User, error)
	UpdateUser(user *models.User) error
	DeleteUser(id uuid.UUID) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (u *userRepository) Create(user *models.User) error {
	return u.db.Create(user).Error
}

func (u *userRepository) GetUsers() ([]models.User, error) {
	var users []models.User
	err := u.db.Find(&users).Error
	return users, err
}

// GetUserByID retrieves a user by their  ID.
func (u *userRepository) GetUserByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	err := u.db.First(&user, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserByEmail retrieves a user by their email address.
func (u *userRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := u.db.First(&user, "email = ?", email).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// UpdateUser modifies an existing user's record.
func (u *userRepository) UpdateUser(user *models.User) error {
	result := u.db.Updates(user)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// DeleteUser removes a user from the database by their ID.
func (u *userRepository) DeleteUser(id uuid.UUID) error {
	result := u.db.Delete(&models.User{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
