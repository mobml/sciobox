package services

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/mobml/sciobox/models"
	"github.com/mobml/sciobox/repository"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	// Authentication and Register
	Register(name, email, password string) error
	Login(email, password string) (string, error)

	// Profile management
	GetProfile(id uuid.UUID) (*models.User, error)
	GetAllUsers() ([]models.User, error)
	UpdateUser(id uuid.UUID, name, password string) error
	RemoveUser(id uuid.UUID) error
}

type userService struct {
	repo      repository.UserRepository
	secretKey string
}

func NewUserService(repo repository.UserRepository, secret string) UserService {
	return &userService{
		repo:      repo,
		secretKey: secret,
	}
}

func (s *userService) Register(name, email, password string) error {
	// Verify if the user already exists
	existing, _ := s.repo.GetUserByEmail(email)
	if existing != nil {
		return errors.New("The email already exists!")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &models.User{
		Name:         name,
		Email:        email,
		PasswordHash: string(hashedPassword),
		Role:         models.RoleUser,
	}

	return s.repo.Create(user)
}

// Login validate credentials and return a signed token
func (s *userService) Login(email, password string) (string, error) {
	user, err := s.repo.GetUserByEmail(email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return "", errors.New("invalid crendenctials")
	}

	claims := jwt.MapClaims{
		"sub":  user.ID,
		"role": user.Role,
		"exp":  time.Now().Add(time.Hour * 72).Unix(),
		"iat":  time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.secretKey))
}

func (s *userService) GetProfile(id uuid.UUID) (*models.User, error) {
	return s.repo.GetUserByID(id)
}

func (s *userService) GetAllUsers() ([]models.User, error) {
	return s.repo.GetUsers()
}

func (s *userService) UpdateUser(id uuid.UUID, name string, password string) error {
	user, err := s.repo.GetUserByID(id)
	if err != nil {
		return err
	}

	if name != "" {
		user.Name = name
	}

	// if there is a new password we will hashed it
	if password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		user.PasswordHash = string(hashedPassword)
	}

	return s.repo.UpdateUser(user)
}

func (s *userService) RemoveUser(id uuid.UUID) error {
	return s.repo.DeleteUser(id)
}
