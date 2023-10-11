import SES from "aws-sdk/clients/ses.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import jwt from "jsonwebtoken";
import emailTemplate from "../helpers/email.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import validator from "email-validator";

const preRegister = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!validator.validate(email)) {
    res.status(400);
    throw new Error("This email is not valid.");
  }

  if (!password) {
    res.status(400);
    throw new Error("Password is required.");
  }

  if (password && password.length < 6) {
    res.status(400);
    throw new Error("Password should be at least 6 characters.");
  }

  const user = await User.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error("This email is already in use.");
  }

  const token = jwt.sign({ email, password }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
    region: "eu-north-1",
    apiVersion: "2010-12-01",
  };

  const awsSes = new SES(awsConfig);

  awsSes.sendEmail(
    emailTemplate(
      email,
      `<p>Please click the link below to activate your account.</p>
    <a href="${process.env.CLIENT_URL}/users/account-activate/${token}"}>Activate my account</a>`,
      process.env.EMAIL_TO,
      `Activate Your Account`
    ),
    (err, data) => {
      if (err) {
        res.status(400);
        throw new Error("Mail sending failed.");
      } else {
        return res.status(200).json({ message: "Mail sending successful." });
      }
    }
  );
});

const register = asyncHandler(async (req, res) => {
  const { email, password } = jwt.verify(
    req.body.token,
    process.env.JWT_SECRET
  );

  const user = await new User({
    username: nanoid(6),
    email,
    password,
  }).save();

  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    user.resetCode = undefined;

    res.status(200).json({
      token,
      refreshToken,
      user,
    });
  } else {
    res.status(400);
    throw new Error("Registration failed.");
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.checkPassword(password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    user.password = undefined;
    user.resetCode = undefined;

    res.status(200).json({ token, refreshToken, user });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const userController = {
  login,
  preRegister,
  register,
};

export default userController;
