const express = require("express");
const router = express.Router();
const groupsController = require("../controllers/groupsController");
const auth = require("../middleware/auth");

router.post("/", auth.authenticate, groupsController.postGroups);
router.get("/", auth.authenticate, groupsController.getGroups);
router.post(
  "/:groupId/members",
  auth.authenticate,
  groupsController.postGroupMember
);
router.get("/:groupId/members", auth.authenticate, groupsController.getMembers);
router.delete(
  "/:groupId/members/:memberId",
  auth.authenticate,
  groupsController.deleteMembers
);
router.delete("/:groupId", auth.authenticate, groupsController.deleteGroup);
router.get(
  "/:groupId/messages",
  auth.authenticate,
  groupsController.getGroupMessages
);
router.post(
  "/:groupId/messages",
  auth.authenticate,
  groupsController.postGroupMessages
);
router.post(
  "/:groupId/promote",
  auth.authenticate,
  groupsController.promoteToAdmin
);

module.exports = router;
