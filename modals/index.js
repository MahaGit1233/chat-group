const Users = require("./Users");
const Messages = require("./Messages");

Users.hasMany(Messages, { foreignKey: "UserId", as: "messages" });
Messages.belongsTo(Users, { foreignKey: "UserId", as: "user" });

module.exports = {
  Users,
  Messages,
};
