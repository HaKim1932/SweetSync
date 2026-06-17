const express = require("express");
const router = express.Router();

const orderController =
    require("../controllers/orderController");

const upload =
    require("../middleware/upload");

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

// UPLOAD PAYMENT PROOF
router.post(
    "/:id/upload-proof",
    requireAuth,
    upload.single("payment_proof"),
    orderController.uploadPaymentProof
);

// ORDER DETAILS
router.get(
    "/:id",
    requireAuth,
    orderController.orderDetails
);

module.exports = router;