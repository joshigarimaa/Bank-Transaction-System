const accountModel = require("../models/accountModel");

async function createAccountController(req, res) {
  try {
    const user = req.user;
    const existingAccount = await accountModel.findOne({ user: user._id });
    if (existingAccount) {
      return res.status(400).json({
        message: "User already has an account",
      });
    }
    const account = await accountModel.create({
      user: user._id,
    });
    res.status(201).json({
      message: "Account created successfully",
      account,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = createAccountController;