import SES from "aws-sdk/clients/ses.js";
import S3 from "aws-sdk/clients/s3.js";
import jwt from "jsonwebtoken";
import emailTemplate from "../helpers/email.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import { comparePasswords, hashPassword } from "../helpers/auth.js";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: "eu-north-1",
  apiVersion: "2010-12-01",
};

const awsSes = new SES(awsConfig);
const awsS3 = new S3(awsConfig);

const tokenAndUserResponse = (req, res, user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  user.password = undefined;
  user.resetCode = undefined;

  return res.status(200).json({
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
      return res.status(400).json({ error: "This email is already in use." });
    }

    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    awsSes.sendEmail(
      emailTemplate(
        email,
        `<p>Please click the link below to activate your account.</p>
    <a href="${process.env.CLIENT_URL}/account-activate/${token}"}>Activate my account</a>`,
        process.env.EMAIL_FROM,
        `Activate Your Account`
      ),
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: "Mail sending failed." });
        } else {
          return res.status(200).json({ message: "Mail sending successful." });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Try again." });
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
      return res.status(400).json({ error: "This email is already in use." });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new User({
      username: nanoid(6),
      email,
      password: hashedPassword,
    }).save();

    tokenAndUserResponse(req, res, user);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isPasswordCorrect = await comparePasswords(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Password is wrong." });
    }

    tokenAndUserResponse(req, res, user);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ error: "No registered users were found with this email." });
    }

    const resetCode = nanoid();
    user.resetCode = resetCode;
    await user.save();

    const resetToken = jwt.sign({ resetCode }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    awsSes.sendEmail(
      emailTemplate(
        email,
        `<p>Please click the link below to access your account.</p>
      <a href="${process.env.CLIENT_URL}/account-access/${resetToken}"}>Access my account</a>`,
        process.env.EMAIL_FROM,
        `Access Your Account`
      ),
      (err, data) => {
        if (err) {
          return res.status(400).json({ error: "Mail sending failed." });
        } else {
          return res.status(200).json({ message: "Mail sending successful." });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const accessAccount = async (req, res) => {
  try {
    const { resetToken } = req.body;
    const { resetCode } = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findOne({ resetCode });
    if (!user) {
      return res
        .status(404)
        .json({ error: "No registered users were found with this email." });
    }
    user.resetCode = "";
    const updatedUser = await user.save();
    tokenAndUserResponse(req, res, updatedUser);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { userId } = jwt.verify(req.headers.refresh, process.env.JWT_SECRET);

    const user = await User.findById(userId);

    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Refresh token failed" });
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isOldPasswordCorrect = await comparePasswords(
      oldPassword,
      user.password
    );

    if (!isOldPasswordCorrect) {
      return res.status(400).json({ error: "Old Password is wrong." });
    }

    user.password = await hashPassword(newPassword);
    await user.save();
    return res.status(200).json({ message: "Password is updated." });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    user.username = req.body.username;
    user.name = req.body.name;
    user.company = req.body.company;
    user.phone = req.body.phone;
    user.about = req.body.about;
    user.photo = req.body.photo;
    user.homeAddress.address = req.body.address;
    user.homeAddress.city = req.body.city;
    user.homeAddress.postalCode = req.body.postalCode;
    user.homeAddress.country = req.body.country;

    const updatedUser = await user.save();

    updatedUser.password = undefined;
    updatedUser.resetCode = undefined;

    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error.codeName === "DuplicateKey") {
      return res
        .status(400)
        .json({ error: "The username or email is already used." });
    } else {
      return res
        .status(500)
        .json({ error: "Something went wrong. Try again." });
    }
  }
};

const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;

    const base64Image = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = image.split(";")[0].split("/")[1];

    const params = {
      Bucket: "skywards3",
      Key: `${nanoid()}.${type}`,
      Body: base64Image,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    awsS3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Upload failed. Try again." });
      } else {
        res.status(200).json(data);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { Key, Bucket } = req.body;
    awsS3.deleteObject({ Bucket, Key }, (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Deletion failed. Try again." });
      } else {
        res.status(200).json({ message: "Deletion successful." });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong. Try again." });
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
  getProfile,
  updatePassword,
  updateProfile,
  uploadImage,
  deleteImage,
};

export default userController;
