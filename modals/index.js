const Users = require("./Users");
const Messages = require("./Messages");
const Groups = require("./Groups");
const GroupMembers = require("./GroupMembers");

Users.hasMany(Messages, { foreignKey: "UserId", as: "messages" });
Messages.belongsTo(Users, { foreignKey: "UserId", as: "user" });

Groups.hasMany(Messages, { foreignKey: "GroupId", as: "messages" });
Messages.belongsTo(Groups, { foreignKey: "GroupId", as: "group" });

Groups.hasMany(GroupMembers, { foreignKey: "GroupId" });
GroupMembers.belongsTo(Groups, { foreignKey: "GroupId" });

Users.hasMany(GroupMembers, { foreignKey: "UserId" });
GroupMembers.belongsTo(Users, { foreignKey: "UserId" });

module.exports = {
  Users,
  Messages,
  Groups,
  GroupMembers,
};
