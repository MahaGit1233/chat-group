const Users = require("../modals/Users");
const Messages = require("../modals/Messages");
const Sequelize = require("../utils/db-connection");

const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    res
      .status(200)
      .json({ users: users, message: "Users fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch the users" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const newMessage = await Messages.create({
      message: message,
    });
    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    res.status(500).json({ message: "Unable to send the message" });
  }
};

module.exports = {
  getUsers,
  sendMessage,
};
