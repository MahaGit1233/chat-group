const jwt = require("jsonwebtoken");
const Users = require("../modals/Users");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log("token:", token);
    const decoded = jwt.verify(token, process.env.TOKEN);
    const dbUser = await Users.findByPk(decoded.id);

    console.log("user:", JSON.stringify(dbUser));
    req.user = dbUser;
    next();
  } catch (error) {
    return res.status(401).json({ success: false });
  }
};

module.exports = {
  authenticate,
};
