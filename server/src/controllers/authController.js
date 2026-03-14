const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const emailService = require("../services/emailService");

// REGISTER
const userRegisterController = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const emailExists = await userModel.findOne({ email });

    if (emailExists) {
      return res.status(422).json({
        message: "User already exists with this email",
      });
    }

    const userCreated = await userModel.create({
      email,
      password,
      name,
    });

    const token = jwt.sign(
      { userId: userCreated._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // send email
    await emailService.sendRegisterationEmail(
      userCreated.email,
      userCreated.name
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: userCreated,
      token,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// LOGIN
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined;

    return res.status(200).json({
      message: "Login successful",
      user,
      token,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  userRegisterController,
  userLoginController,
};