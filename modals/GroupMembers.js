const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const GroupMembers = sequelize.define("GroupMembers", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  role: {
    type: DataTypes.ENUM("admin", "member"),
    defaultValue: "member",
  },
});

module.exports = GroupMembers;
