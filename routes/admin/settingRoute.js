const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/settingController");
const multer = require("multer");
const uploadCloudMiddleware = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();

router.get("/general", controller.index);

router.patch(
    "/general",
    upload.single("logo"),
    uploadCloudMiddleware.Upload,
    controller.settingPatch
);

module.exports = router;
