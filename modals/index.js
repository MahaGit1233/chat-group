const Users = require("./Users");
const Messages = require("./Messages");

Users.hasMany(Messages);
Messages.belongsTo(Users);

module.exports = {
  Users,
  Messages,
};
