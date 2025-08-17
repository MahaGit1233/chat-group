const { Sequelize } = require("sequelize");
const { Groups, Users, Messages } = require("../modals");
const GroupMembers = require("../modals/GroupMembers");
const sequelize = require("../utils/db-connection");

const postGroups = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: "Group name is require" });
    }

    const group = await Groups.create({ name });

    await GroupMembers.create({
      GroupId: group.id,
      UserId: userId,
      role: "admin",
    });

    res.status(200).json({ message: "Group created successfully", group });
  } catch (error) {
    console.log("post groups error:", error);
    res.status(500).json({ error: "Unable to create a group" });
  }
};

const getGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Groups.findAll({
      include: {
        model: GroupMembers,
        where: { UserId: userId },
        attributes: [],
      },
    });

    res.status(200).json({ message: "Groups fetched successfully", groups });
  } catch (error) {
    console.log("get groups error:", error);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

const postGroupMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { members } = req.body;
    const userId = req.user.id;

    const adminCheck = await GroupMembers.findOne({
      where: { GroupId: groupId, UserId: userId, role: "admin" },
    });

    if (!adminCheck) {
      return res.status(403).json({ error: "Not an admin" });
    }

    for (let memberId of members) {
      await GroupMembers.create({
        GroupId: groupId,
        UserId: memberId,
        role: "member",
      });
    }

    res.status(200).json({ message: "User added to the group successfully" });
  } catch (error) {
    console.log("post group member error:", error);
    res.status(500).json({ error: "Unable to add member to the group" });
  }
};

const getMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const membership = await GroupMembers.findOne({
      where: { GroupId: groupId, UserId: userId },
    });

    if (!membership) {
      return res.status(403).json({ error: "Member is not in the group" });
    }

    const members = await GroupMembers.findAll({
      where: { GroupId: groupId },
      include: {
        model: Users,
        attributes: ["id", "name"],
      },
      attributes: ["role"],
    });

    res.status(200).json({ message: "Members fetched successfully", members });
  } catch (error) {
    console.log("get group member error:", error);
    res.status(500).json({ error: "Unable to fetch members" });
  }
};

const deleteMembers = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const userId = req.user.id;

    const adminCheck = await GroupMembers.findOne({
      where: { GroupId: groupId, UserId: userId, role: "admin" },
    });

    if (!adminCheck) {
      res.status(403).json({ error: "User is not an admin" });
    } else {
      await GroupMembers.destroy({
        where: { GroupId: groupId, UserId: memberId },
      });

      res.status(200).json({ message: "Member deleted successfully" });
    }
  } catch (error) {
    console.log("delete member error:", error);
    res.status(500).json({ error: "unable to remove the member" });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const adminCheck = await GroupMembers.findOne({
      where: { GroupId: groupId, UserId: userId, role: "admin" },
    });

    if (!adminCheck) {
      return res.status(403).json({ error: "User is not an admin" });
    } else {
      await Groups.destroy({ where: { id: groupId } });

      res.status(200).json({ message: "Group deleted successfully" });
    }
  } catch (error) {
    console.log("delete group error:", error);
    res.status(500).json({ error: "Unable to delete the group" });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { afterId } = req.query;
    const userId = req.user.id;

    const membership = await GroupMembers.findOne({
      where: { GroupId: groupId, UserId: userId },
    });

    if (!membership) {
      res.status(403).json({ error: "User is not in the group" });
    } else {
      const whereCondition = { GroupId: groupId };
      if (afterId) {
        whereCondition.id = { [Sequelize.Op.gt]: afterId };
      }

      const messages = await Messages.findAll({
        where: whereCondition,
        include: [{ model: Users, as: "user", attributes: ["id", "name"] }],
        order: [["createdAt", "ASC"]],
        limit: 10,
      });

      res
        .status(200)
        .json({ message: "Messages fetched successfully", messages });
    }
  } catch (error) {
    console.log("get group messages error:", error);
    res.status(500).json({ error: "Unable to fetch the messages" });
  }
};

const postGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const membership = await GroupMembers.findOne({
      where: { GroupId: groupId, UserId: userId },
    });

    if (!membership) {
      return res.status(403).json({ error: "User not in the group" });
    } else {
      const newMessage = await Messages.create({
        message: message,
        GroupId: groupId,
        UserId: userId,
      });

      res
        .status(200)
        .json({ message: "Message sent successfully", data: newMessage });
    }
  } catch (error) {
    console.log("post group messages error:", error);
    res.status(500).json({ error: "Unable to send Message" });
  }
};

const promoteToAdmin = async (req, res) => {
  try {
    const { memberId } = req.body;
    const { groupId } = req.params;
    const requestingUserId = req.user.id;

    const adminCheck = await GroupMembers.findOne({
      where: { GroupId: groupId, UserId: requestingUserId, role: "admin" },
    });

    if (!adminCheck) {
      return res.status(403).json({ error: "Only admins can promote members" });
    } else {
      const member = await GroupMembers.findOne({
        where: { GroupId: groupId, UserId: memberId },
      });

      if (!member) {
        return res.status(404).json({ error: "User is not in this group" });
      }

      member.role = "admin";
      await member.save();

      res.status(200).json({ message: "User promoted to admin successfully" });
    }
  } catch (error) {
    console.log("promote to admin error:", error);
    res.status(500).json({ error: "Unable to promote the user to admin" });
  }
};

module.exports = {
  postGroups,
  getGroups,
  postGroupMember,
  getMembers,
  deleteGroup,
  deleteMembers,
  getGroupMessages,
  postGroupMessages,
  promoteToAdmin,
};
