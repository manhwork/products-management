const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../../controllers/admin/products-category.controller");

const upload = multer();

const uploadCloudMiddleware = require("../../middlewares/admin/uploadCloud.middleware");

const productValidate = require("../../validates/admin/products-category.validate");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloudMiddleware.Upload,
  //   productValidate.createPost,
  controller.createPOST
);

router.patch("/change-multi", controller.changeMulti);

module.exports = router;
