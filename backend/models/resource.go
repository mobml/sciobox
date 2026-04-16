package models

import (
	"time"

	"github.com/google/uuid"
)

type Resource struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Title       string    `gorm:"type:varchar(255);not null"`
	URL         string    `gorm:"type:text;not null"`
	Description *string   `gorm:"type:text"`
	ImageURL    *string   `gorm:"type:text"`

	FolderID *uuid.UUID `gorm:"type:uuid"`
	UserID   uuid.UUID  `gorm:"type:uuid;not null"`

	CreatedAt time.Time
	UpdatedAt time.Time

	User   User    `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	Folder *Folder `gorm:"foreignKey:FolderID;constraint:OnDelete:SET NULL"`
}
