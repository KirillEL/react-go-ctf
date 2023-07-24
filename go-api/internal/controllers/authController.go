package controllers

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"go-api/internal/database"
	"go-api/internal/models"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

var SecretKey string = os.Getenv("SECRET_KEY")

func Register(ctx *fiber.Ctx) error {
	userModel := models.UserRegister{}
	err := ctx.BodyParser(&userModel)

	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": fmt.Sprintf("error: %s", err.Error()),
		})
	}

	if userModel.Password != userModel.PasswordRepeat {
		return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "password are not equal",
			"data":    userModel,
		})
	}

	hasher := md5.New()
	hasher.Write([]byte(userModel.Password))
	hashedPassword := hex.EncodeToString(hasher.Sum(nil))
	userModel.Password = hashedPassword

	user := models.User{
		Name:     userModel.Name,
		Email:    userModel.Email,
		Password: userModel.Password,
	}

	err = database.DB.Create(&user).Error

	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"error": fmt.Sprintf("%v", err),
		})
	}

	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "success registration",
		"data":    user,
	})
}

func Login(ctx *fiber.Ctx) error {
	userLoginModel := models.UserLogin{}
	err := ctx.BodyParser(&userLoginModel)

	if err != nil {
		return err
	}

	var user models.User

	database.DB.Where("email = ?", userLoginModel.Email).First(&user)

	if user.ID == 0 {
		return ctx.Status(404).JSON(&fiber.Map{
			"message": "user not found",
		})
	}

	hasher := md5.New()
	hasher.Write([]byte(userLoginModel.Password))
	hashedPassword := hex.EncodeToString(hasher.Sum(nil))

	if hashedPassword != user.Password {
		return ctx.Status(500).JSON(&fiber.Map{
			"message": "incorrect password",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		ctx.Status(fiber.StatusInternalServerError)
		return ctx.JSON(&fiber.Map{
			"message": "could not login",
		})
	}

	ctx.Cookie(&fiber.Cookie{
		Name:     "SECRET",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	})

	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "success login",
		"data":    token,
	})
}

func GetUser(ctx *fiber.Ctx) error {
	cookies := ctx.Cookies("SECRET")

	token, err := jwt.ParseWithClaims(cookies, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		return ctx.JSON(&fiber.Map{
			"message": "unauthenticated",
		})
	}

	var user models.User

	claims := token.Claims.(*jwt.StandardClaims)

	database.DB.Where("id = ?", claims.Issuer).First(&user)

	return ctx.JSON(&fiber.Map{
		"message": "authenticated",
		"data":    user,
	})
}

func Logout(ctx *fiber.Ctx) error {

	usersData, ok := ctx.Locals("usersData").(fiber.Map)

	if !ok {
		return fiber.NewError(500, "Failed to get usersData")
	}

	cookie := fiber.Cookie{
		Name:     "SECRET",
		Value:    "",
		MaxAge:   -1,
		HTTPOnly: true,
	}
	ctx.Cookie(&cookie)
	return ctx.JSON(&fiber.Map{
		"message": "success logout",
		"data":    usersData,
	})
}

func PostLogout(ctx *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "SECRET",
		Value:    "",
		MaxAge:   -1,
		HTTPOnly: true,
	}
	ctx.Cookie(&cookie)
	return ctx.JSON(&fiber.Map{
		"message": "success logout",
	})
}

func Search(ctx *fiber.Ctx) error {
	id := ctx.Query("id")

	var users []models.User
	if id == "" {
		ctx.Status(404)
		return ctx.JSON(&fiber.Map{
			"message": "not found",
		})
	}
	str := fmt.Sprintf("SELECT * FROM users where id=%s", id)

	database.DB.Raw(str).Scan(&users)

	// Подготовить данные пользователей для JSON-ответа
	usersData := fiber.Map{
		"message": "success search",
		"data":    users,
	}

	ctx.Locals("usersData", usersData)
	return ctx.Next()
}
