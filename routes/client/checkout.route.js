const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/checkout.controller");

router.get("/", controller.index);

router.post("/order", controller.orderPost);

router.get("/order/success/:orderId", controller.orderSuccess);

module.exports = router;
