const transactionModel = require("../models/transactionModel");
const ledgerModel = require("../models/ledgerModel");
const accountModel = require("../models/accountModel");
const emailService = require("../services/emailService");

async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "FromAccount,ToAccount,Amount & IdempotencyKey are required",
    });
  }
  const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });
  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }
}
