const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoutes");
const accountRouter=require("./routes/accountRoute")
const transactionRoutes=require("./routes/transactionRoute")

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("api/transaction",transactionRoutes)

module.exports = app;