import validator from "email-validator";

const isEmailValid = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  if (email && !validator.validate(email)) {
    return res.status(400).json({ error: "This email is not valid." });
  }

  next();
};

const isPasswordValid = (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }

  if (password && password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password should be at least 6 characters." });
  }

  if (confirmPassword && password && confirmPassword !== password) {
    return res.status(400).json({ error: "Passwords are not the same." });
  }

  next();
};

const checkNewPassword = (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (oldPassword && newPassword && confirmNewPassword) {
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password should be at least 6 chatacters." });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        error: "New Password and Confirm Passwords are not the same.",
      });
    }
  } else {
    return res.status(400).json({ error: "Please fill the passwords boxes." });
  }
  next();
};

export { isEmailValid, isPasswordValid, checkNewPassword };
