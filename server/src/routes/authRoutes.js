const express = require("express");
const { userRegisterController, userLoginController } = require("../controllers/authController");

const router = express.Router();

// Register route
router.post("/register", userRegisterController);

// Login route
router.post("/login", userLoginController);

module.exports = router;