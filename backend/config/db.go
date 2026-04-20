package config

import (
	"fmt"
	"log"
	"os"
	"sync"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	db   *gorm.DB
	once sync.Once
)

// This function initializes the database connection. If a connection
// already exists, it returns a reference to the existing connection.
func GetDB() *gorm.DB {
	once.Do(func() {
		fmt.Println("Initializing DB connection...")

		host := os.Getenv("DB_HOST")

		if host == "" {
			host = "localhost"
		}

		port := os.Getenv("DB_PORT")
		user := os.Getenv("DB_USER")
		password := os.Getenv("DB_PASSWORD")
		dbname := os.Getenv("DB_NAME")

		dsn := fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			host, user, password, dbname, port,
		)

		database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatal("Failed to connect to database:", err)
		}

		db = database
		log.Println("Database connected!!")
	})

	return db
}
