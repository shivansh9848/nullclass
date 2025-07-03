import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decodedata = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedata?.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Authentication failed" });
  }
};
export default auth;
