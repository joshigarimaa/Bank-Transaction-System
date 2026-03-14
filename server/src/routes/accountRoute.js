const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const createAccountController = require("../controllers/accountController");

const router = express.Router();

router.post("/", authMiddleware, createAccountController);

module.exports = router;