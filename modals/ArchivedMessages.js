const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const ArchivedMessages = sequelize.define("ArchivedMessages", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = ArchivedMessages;
