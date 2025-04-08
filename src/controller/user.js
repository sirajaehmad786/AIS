const User = require("../models/user");
const { comparePassword } = require("../../utils/hashPassword");
const message = require("../../config/message.json");
const { generateToken } = require("../../utils/jwt");


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: message.USER.EMAIL_AND_PASSWORD,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        message: message.USER.EMAIL_INVALID,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: message.USER.INVALID_CREDENCIAL });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, message: message.USER.INVALID_PASSWORD });
    }

    const token = generateToken(user);
    res.status(200).json({
      status: true,
      message: message.USER.LOGIN_SUCCESS,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: message.ERRORS.GENERAL,
      error: error.message,
    });
  }
};