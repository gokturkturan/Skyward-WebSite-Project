import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export { isAuth };
