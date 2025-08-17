const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Groups = sequelize.define("Groups", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Groups;
