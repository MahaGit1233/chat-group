const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middleware/auth");

router.get("/", auth.authenticate, usersController.getUsers);
router.post("/messages", auth.authenticate, usersController.sendMessage);
router.get("/messages", auth.authenticate, usersController.getMessages);
router.post("/upload", auth.authenticate, usersController.uploadMessages);

module.exports = router;
