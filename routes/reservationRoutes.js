const express = require("express");
const router = express.Router();

const reservationController =
    require("../controllers/reservationController");

const {
    requireAuth
} = require("../middleware/auth");

// CUSTOMER RESERVATION FORM
router.get(
    "/new",
    requireAuth,
    reservationController.showReservationForm
);

// CREATE RESERVATION
router.post(
    "/new",
    requireAuth,
    reservationController.createReservation
);

// CUSTOMER RESERVATION HISTORY
router.get(
    "/",
    requireAuth,
    reservationController.myReservations
);

module.exports = router;