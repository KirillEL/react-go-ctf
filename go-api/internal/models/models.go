package models

type User struct {
	ID       uint   `gorm:"primary key;autoIncrement" json:"id"`
	Name     string `gorm:"unique" json:"name"`
	Email    string `gorm:"unique" json:"email"`
	Password string `json:"password"`
	IsAdmin  bool   `gorm:"default:false" json:"is_admin"`
}

type UserRegister struct {
	ID             uint   `gorm:"primary key;autoIncrement" json:"id"`
	Name           string `gorm:"unique" json:"name"`
	Email          string `gorm:"unique" json:"email"`
	Password       string `json:"password"`
	PasswordRepeat string `json:"passwordRepeat"`
}

type UserLogin struct {
	Email    string `gorm:"unique" json:"email"`
	Password string `json:"password"`
}
