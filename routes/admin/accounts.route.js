const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../../controllers/admin/accounts.controller");
const upload = multer();

const uploadCloudMiddleware = require("../../middlewares/admin/uploadCloud.middleware");

const accountsValidate = require("../../validates/admin/accounts.validate");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("avatar"),
    uploadCloudMiddleware.Upload,
    accountsValidate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.delete("/delete/:id", controller.delete);

router.get("/detail/:id", controller.detail);

router.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadCloudMiddleware.Upload,
    accountsValidate.editPatch,
    controller.editPatch
);

module.exports = router;
