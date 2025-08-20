const Users = require("../modals/Users");
const Messages = require("../modals/Messages");
const Sequelize = require("sequelize");
const sequelize = require("../utils/db-connection");
const AWS = require("aws-sdk");

function uploadToS3(data, filename) {
  const BUCKET_NAME = "group-chat1";
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  console.log("iam user key:", IAM_USER_KEY);
  console.log("iam secret key", IAM_USER_SECRET);

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("s3 upload failed", err);
        reject(err);
      } else {
        console.log("s3 upload success", s3response);
        resolve(s3response.Location);
      }
    });
  });
}

const uploadMessages = async (req, res) => {
  try {
    const { file, filename } = req.body;

    if (!file || !filename) {
      return res.status(400).json({ message: "File and filename are required" });
    }
    
    const buffer = Buffer.from(file, "base64");

    const fileName = `chat/${Date.now()}_${filename}`;
    const fileUrl = await uploadToS3(buffer, fileName);

    const newMessage = await Messages.create({
      message: "[File]",
      fileUrl,
      UserId: req.user.id,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Uploadmessages error:", error);
    res.status(500).json({ message: "Unable to upload file" });
  }
};

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
  uploadMessages,
};
