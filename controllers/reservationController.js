const Reservation = require("../models/reservationModel");

// SHOW CUSTOMER RESERVATION FORM
exports.showReservationForm = (req, res) => {
    res.render("reservations/new-reservation");
};

// CREATE RESERVATION
exports.createReservation = (req, res) => {
    const userId = req.session.user.id;

    const {
        cake_name,
        pickup_date,
        pickup_time,
        message_on_cake,
        instructions
    } = req.body;

    Reservation.createReservation(
        userId,
        cake_name,
        pickup_date,
        pickup_time,
        message_on_cake,
        instructions,
        (err) => {
            if (err) {
                return res.send(err);
            }

            res.redirect("/reservations");
        }
    );
};

// CUSTOMER RESERVATION HISTORY
exports.myReservations = (req, res) => {
    const userId = req.session.user.id;

    Reservation.getReservationsByUser(
        userId,
        (err, reservations) => {
            if (err) {
                return res.send(err);
            }

            res.render(
                "reservations/my-reservations",
                { reservations }
            );
        }
    );
};

// ADMIN VIEW ALL RESERVATIONS
exports.adminReservations = (req, res) => {
    Reservation.getAllReservations(
        (err, reservations) => {
            if (err) {
                return res.send(err);
            }

            res.render(
                "admin-reservations",
                { reservations }
            );
        }
    );
};

// ADMIN UPDATE RESERVATION STATUS
exports.updateStatus = (req, res) => {
    const reservationId = req.params.id;
    const status = req.body.status;

    Reservation.updateStatus(
        reservationId,
        status,
        (err) => {
            if (err) {
                return res.send(err);
            }

            res.redirect("/admin/reservations");
        }
    );
};