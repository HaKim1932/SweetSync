const express = require("express");
const router = express.Router();

const orderController =
    require("../controllers/orderController");

const {
    requireAuth
} = require("../middleware/auth");

// ORDER HISTORY
router.get(
    "/",
    requireAuth,
    orderController.orderHistory
);

// CHECKOUT
router.get(
    "/checkout",
    requireAuth,
    orderController.checkout
);

// ORDER DETAILS
router.get(
    "/:id",
    requireAuth,
    orderController.orderDetails
);

module.exports = router;