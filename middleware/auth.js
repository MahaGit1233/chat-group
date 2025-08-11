const jwt = require("jsonwebtoken");
const Users = require("../modals/Users");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log("token:", token);
    const user = jwt.verify(token, process.env.TOKEN);
    Users.findByPk(user.id)
      .then((user) => {
        console.log("user", JSON.stringify(user));
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (error) {
    return res.status(401).json({ success: false });
  }
};

module.exports = {
  authenticate,
};
