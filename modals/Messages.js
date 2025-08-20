const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Messages = sequelize.define("Messages", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Messages;
