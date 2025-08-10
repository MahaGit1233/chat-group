const Users = require("../modals/Users");
const sequelize = require("../utils/db-connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN);
};

const signedUpUsers = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await Users.findOne({
      where: { email },
      transaction: transaction,
    });

    if (existingUser) {
      await transaction.rollback();
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create(
      {
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone,
      },
      { transaction: transaction }
    );

    await transaction.commit();
    res.status(200).json({ message: `User with name: ${name} is added` });
  } catch (error) {
    await transaction.rollback();
    console.log("signedup error:", error);
    res.status(500).json({ message: "Unable to add the user" });
  }
};

const loginUsers = async (req, res) => {
  const transaction = await sequelize.transaction();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All the fields are require" });
  }

  try {
    const user = await Users.findOne({
      where: { email },
      transaction: transaction,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await transaction.commit();
    res.status(200).json({
      message: "Login successful",
      token: generateAccessToken(user.id),
      user: user,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signedUpUsers,
  loginUsers,
};
