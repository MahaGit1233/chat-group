const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.getUsers);
router.post("/messages", usersController.sendMessage);

module.exports = router;
