require("dotenv").config();
const { verifyToken } = require("../helper/authFunction");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(400)
      .json({ message: "Token is missing. Access Denied." });
  }

  try {
    const decoded = verifyToken(token, process.env.SECRET_KEY);
    req.user = decoded; // decoded contains {_id, email}
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = authenticate;
