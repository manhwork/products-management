const express = require("express");
const router = express.Router();
const authValidate = require("../../validates/admin/auth.validate");
const controller = require("../../controllers/admin/auth.controller");

router.get("/login", controller.login);

router.post("/login", authValidate.loginPost, controller.loginPost);

module.exports = router;
