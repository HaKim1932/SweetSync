const express = require("express");
const router = express.Router();

const adminController =
    require("../controllers/adminController");

const orderController =
    require("../controllers/orderController");

const reservationController =
    require("../controllers/reservationController");

const userController =
    require("../controllers/userController");

const {
    requireAuth,
    requireAdmin
} = require("../middleware/auth");

// ADMIN DASHBOARD
router.get(
    "/",
    requireAuth,
    requireAdmin,
    adminController.dashboard
);

// ADMIN ORDERS
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

// ADMIN RESERVATIONS
router.get(
    "/reservations",
    requireAuth,
    requireAdmin,
    reservationController.adminReservations
);

router.post(
    "/reservations/:id/status",
    requireAuth,
    requireAdmin,
    reservationController.updateStatus
);

// ADMIN USERS
router.get(
    "/users",
    requireAuth,
    requireAdmin,
    userController.adminUsers
);

router.post(
    "/users/:id/role",
    requireAuth,
    requireAdmin,
    userController.updateUserRole
);

router.post(
    "/users/:id/status",
    requireAuth,
    requireAdmin,
    userController.updateUserStatus
);

module.exports = router;