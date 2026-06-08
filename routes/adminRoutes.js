const adminController =
    require("../controllers/adminController");
const express = require("express");
const router = express.Router();

const {
    requireAuth,
    requireAdmin
} = require("../middleware/auth");

const orderController =
    require("../controllers/orderController");

router.get(
    "/",
    requireAuth,
    requireAdmin,
    adminController.dashboard
);

router.get(
    "/orders",
    requireAuth,
    requireAdmin,
    orderController.adminOrders
);
router.post(
    "/orders/:id/status",
    requireAuth,
    requireAdmin,
    orderController.updateStatus
);
module.exports = router;