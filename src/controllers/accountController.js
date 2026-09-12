const accountModel = require("../models/accountModel");

async function createAccount(req, res) {
  const user = req.user;
  const account = await accountModel.create({
    user: user._id,
    status: "ACTIVE",
    currency: "INR",
  });
  res.status(201).json({ message: "Account created successfully", account });
}

module.exports = { createAccount };
