const transactionModel = require("../models/transactionModel");
const ledgerModel = require("../models/ledgerModel");
const accountModel = require("../models/accountModel");
const emailService = require("../services/emailService");
const mongoose = require("mongoose");

async function createTransaction(req, res) {
  let session;

  try {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        message: "FromAccount, ToAccount, Amount & IdempotencyKey are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const fromUserAccount = await accountModel.findById(fromAccount);
    const toUserAccount = await accountModel.findById(toAccount);

    if (!fromUserAccount || !toUserAccount) {
      return res.status(400).json({
        message: "Invalid fromAccount or toAccount",
      });
    }

    const isTransactionAlreadyExists = await transactionModel.findOne({
      idempotencyKey,
    });

    if (isTransactionAlreadyExists) {
      if (isTransactionAlreadyExists.status === "COMPLETED") {
        return res.status(200).json({
          message: "Transaction already processed",
          transaction: isTransactionAlreadyExists,
        });
      }

      if (isTransactionAlreadyExists.status === "PENDING") {
        return res.status(200).json({
          message: "Transaction is still processing",
        });
      }

      if (isTransactionAlreadyExists.status === "FAILED") {
        return res.status(500).json({
          message: "Transaction processing failed, please retry",
          transaction: isTransactionAlreadyExists,
        });
      }

      if (isTransactionAlreadyExists.status === "REVERSED") {
        return res.status(500).json({
          message: "Transaction was reversed, please retry",
          transaction: isTransactionAlreadyExists,
        });
      }
    }

    if (
      fromUserAccount.status !== "ACTIVE" ||
      toUserAccount.status !== "ACTIVE"
    ) {
      return res.status(400).json({
        message:
          "Both fromAccount and toAccount must be ACTIVE to process transaction",
      });
    }

    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
      return res.status(400).json({
        message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`,
      });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const [transaction] = await transactionModel.create(
      [
        {
          fromAccount,
          toAccount,
          amount,
          idempotencyKey,
          status: "PENDING",
        },
      ],
      { session }
    );

    await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
        {
          account: toAccount,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session }
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    await emailService.sendTransactionEmail(
      req.user.email,
      req.user.name,
      amount,
      toAccount
    );

    return res.status(201).json({
      message: "Transaction completed successfully",
      transaction,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = { createTransaction };