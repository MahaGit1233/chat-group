const Users = require("../modals/Users");
const Messages = require("../modals/Messages");
const Sequelize = require("sequelize");
const sequelize = require("../utils/db-connection");

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
      UserId: req.user.id,
    });
    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    res.status(500).json({ message: "Unable to send the message" });
  }
};

const getMessages = async (req, res) => {
  try {
    const afterId = parseInt(req.query.afterId, 10);

    let whereCondition = {};
    if (!isNaN(afterId) && afterId > 0) {
      whereCondition = { id: { [Sequelize.Op.gt]: afterId } };
    }

    const messages = await Messages.findAll({
      where: whereCondition,
      include: [{ model: Users, as: "user", attributes: ["id", "name"] }],
      order: [["id", "Asc"]],
    });
    res
      .status(200)
      .json({ messages: messages, message: "Messages fetched successfuly" });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch the messages" });
  }
};

module.exports = {
  getUsers,
  sendMessage,
  getMessages,
};
