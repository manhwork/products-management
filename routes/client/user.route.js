const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/userController");
const registerValidate = require("../../validates/client/registerValidate");

router.get("/register", controller.register);

router.post(
    "/register",
    registerValidate.registerPost,
    controller.registerPost
);

router.get("/login", controller.login);

router.post("/login", registerValidate.loginPost, controller.loginPost);

module.exports = router;
