package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

func JWTMiddleware(secret string) fiber.Handler {
	return func(c fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(401).JSON(fiber.Map{"error": "authorization token missing"})
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			return c.Status(401).JSON(fiber.Map{"error": "invalid or expired token"})
		}

		claims := token.Claims.(jwt.MapClaims)
		c.Locals("user_id", claims["sub"])
		c.Locals("role", claims["role"])

		return c.Next()
	}
}

// AdminOnly is an additional middleware for restricted routes
func AdminOnly(c fiber.Ctx) error {
	role := c.Locals("role").(string)
	if role != "admin" {
		return c.Status(403).JSON(fiber.Map{"error": "Access denied: Administrator permissions required"})
	}
	return c.Next()
}
