import validator from "email-validator";

const isEmailPasswordValid = (req, res, next) => {
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

  next();
};

export default isEmailPasswordValid;
