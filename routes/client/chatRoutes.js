const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/chatController");

router.get("/", controller.index);
module.exports = router;
