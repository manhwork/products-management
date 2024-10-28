const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/userController");
const registerValidate = require("../../validates/client/registerValidate");
const forgotPasswordValidate = require("../../validates/client/forgotPasswordValidate");

router.get("/register", controller.register);

router.post(
    "/register",
    registerValidate.registerPost,
    controller.registerPost
);

router.get("/login", controller.login);

router.post("/login", registerValidate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.passwordForgot);

router.post(
    "/password/forgot",
    forgotPasswordValidate.forgotPassword,
    controller.passwordForgotPost
);

module.exports = router;
