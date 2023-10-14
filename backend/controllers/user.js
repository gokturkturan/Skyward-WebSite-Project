import SES from "aws-sdk/clients/ses.js";
import jwt from "jsonwebtoken";
import emailTemplate from "../helpers/email.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import { comparePasswords, hashPassword } from "../helpers/auth.js";

const tokenAndUserResponse = (req, res, user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  user.password = undefined;
  user.resetCode = undefined;

  res.status(200).json({
    token,
    refreshToken,
    user,
  });
};

const preRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

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
        process.env.EMAIL_FROM,
        `Activate Your Account`
      ),
      (err, data) => {
        if (err) {
          res.status(400);
          console.log(err);
          throw new Error("Mail sending failed.");
        } else {
          res.status(200).json({ message: "Mail sending successful." });
        }
      }
    );
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong. Try again.");
  }
};

const register = async (req, res) => {
  try {
    const { email, password } = jwt.verify(
      req.body.token,
      process.env.JWT_SECRET
    );

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      res.status(400);
      throw new Error("This email is already in use.");
    }

    const hashedPassword = await hashPassword(password);

    const user = await new User({
      username: nanoid(6),
      email,
      password: hashedPassword,
    }).save();

    tokenAndUserResponse(req, res, user);
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong. Try again.");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    const isPasswordCorrect = await comparePasswords(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400);
      throw new Error("Password is wrong.");
    }

    tokenAndUserResponse(req, res, user);
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong. Try again.");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("No registered users were found with this email.");
    }

    const resetCode = nanoid();
    user.resetCode = resetCode;
    await user.save();

    const resetToken = jwt.sign({ resetCode }, process.env.JWT_SECRET, {
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
        `<p>Please click the link below to access your account.</p>
      <a href="${process.env.CLIENT_URL}/users/access-account/${resetToken}"}>Access my account</a>`,
        process.env.EMAIL_FROM,
        `Access Your Account`
      ),
      (err, data) => {
        if (err) {
          res.status(400);
          console.log(err);
          throw new Error("Mail sending failed.");
        } else {
          res.status(200).json({ message: "Mail sending successful." });
        }
      }
    );
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong. Try again.");
  }
};

const accessAccount = async (req, res) => {
  try {
    const { resetToken } = req.body;
    const { resetCode } = jwt.verify(resetToken, process.env.JWT_SECRET);

    const user = await User.findOneAndUpdate({ resetCode }, { resetCode: "" });

    tokenAndUserResponse(req, res, user);
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong. Try again.");
  }
};

const refreshToken = async (req, res) => {
  try {
    const { userId } = jwt.verify(
      req.headers.refreshtoken,
      process.env.JWT_SECRET
    );

    const user = await User.findById(userId).select("-password");

    tokenAndUserResponse(req, res, user);
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong. Try again.");
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -resetCode"
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong. Try again.");
  }
};

const userController = {
  preRegister,
  register,
  login,
  forgotPassword,
  accessAccount,
  refreshToken,
  currentUser,
};

export default userController;
