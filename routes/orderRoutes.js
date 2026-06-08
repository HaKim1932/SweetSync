const express = require("express");
const router = express.Router();

const orderController =
    require("../controllers/orderController");

router.get(
    "/",
    orderController.orderHistory
);

router.get(
    "/checkout",
    orderController.checkout
);

module.exports = router;