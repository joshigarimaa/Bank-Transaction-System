const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const transactionController = require("../controllers/transactionController");

router.post("/", authMiddleware, transactionController.createTransactionController);

module.exports = router;