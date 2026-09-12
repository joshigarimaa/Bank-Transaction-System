const express = require("express");
const app = express();
const authRouter = require("./routes/authRoute");
const cookieParser = require("cookie-parser");
const accountRouter = require("./routes/accountRoute");

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);

module.exports = app;
