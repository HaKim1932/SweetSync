const db = require("../config/db");

// CREATE RESERVATION
exports.createReservation = (
    userId,
    cakeName,
    pickupDate,
    pickupTime,
    messageOnCake,
    instructions,
    callback
) => {
    const sql = `
        INSERT INTO reservations
        (
            user_id,
            cake_name,
            pickup_date,
            pickup_time,
            message_on_cake,
            instructions
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            userId,
            cakeName,
            pickupDate,
            pickupTime,
            messageOnCake,
            instructions
        ],
        callback
    );
};

// CUSTOMER RESERVATIONS
exports.getReservationsByUser = (
    userId,
    callback
) => {
    db.query(
        `
        SELECT *
        FROM reservations
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId],
        callback
    );
};

// ADMIN VIEW ALL RESERVATIONS
exports.getAllReservations = (
    callback
) => {
    db.query(
        `
        SELECT
            reservations.*,
            users.fullname
        FROM reservations
        JOIN users
        ON reservations.user_id = users.id
        ORDER BY reservations.created_at DESC
        `,
        callback
    );
};

// UPDATE RESERVATION STATUS
exports.updateStatus = (
    reservationId,
    status,
    callback
) => {
    db.query(
        `
        UPDATE reservations
        SET status = ?
        WHERE id = ?
        `,
        [
            status,
            reservationId
        ],
        callback
    );
};