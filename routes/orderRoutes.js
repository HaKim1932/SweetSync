const express = require("express");
const router = express.Router();

const orderController =
    require("../controllers/orderController");

const {
    requireAuth
} = require("../middleware/auth");

router.get(
    "/",
    requireAuth,
    orderController.orderHistory
);

router.get(
    "/checkout",
    requireAuth,
    orderController.checkout
);

module.exports = router;