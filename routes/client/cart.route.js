const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller.js");

router.post("/add/:productId", controller.addPost);

router.get("/", controller.index);

router.get("/delete/:id", controller.delete);

router.get("/update/:productId/:quantity", controller.update);

module.exports = router;
