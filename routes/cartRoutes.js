const express = require("express");
const router = express.Router();

const cartController =
    require("../controllers/cartController");

const {
    requireAuth
} = require("../middleware/auth");

router.get(
    "/",
    requireAuth,
    cartController.viewCart
);

router.get(
    "/add/:productId",
    requireAuth,
    cartController.addToCart
);

// NEW ROUTES

router.post(
    "/increase/:cartItemId",
    requireAuth,
    cartController.increaseQuantity
);

router.post(
    "/decrease/:cartItemId",
    requireAuth,
    cartController.decreaseQuantity
);

router.post(
    "/remove/:cartItemId",
    requireAuth,
    cartController.removeCartItem
);

module.exports = router;