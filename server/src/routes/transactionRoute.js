const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const transactionController = require("../controllers/transactionController");

router.post("/", authMiddleware, transactionController.createTransaction);

module.exports = router;