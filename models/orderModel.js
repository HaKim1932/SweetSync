const db = require("../config/db");

exports.createOrder = (
    userId,
    total,
    callback
) => {
    const sql = `
        INSERT INTO orders
        (user_id, total)
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [userId, total],
        callback
    );
};

exports.addOrderItem = (
    orderId,
    productId,
    quantity,
    price,
    callback
) => {
    const sql = `
        INSERT INTO order_items
        (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            orderId,
            productId,
            quantity,
            price
        ],
        callback
    );
};

exports.getOrdersByUser = (
    userId,
    callback
) => {
    db.query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
        [userId],
        callback
    );
};
exports.getAllOrders = (
    callback
) => {
    const sql = `
        SELECT
            orders.*,
            users.fullname
        FROM orders
        JOIN users
        ON orders.user_id = users.id
        ORDER BY orders.id DESC
    `;

    db.query(
        sql,
        callback
    );
};
exports.updateStatus = (
    orderId,
    status,
    callback
) => {
    db.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, orderId],
        callback
    );
};
exports.countOrders = (
    callback
) => {
    db.query(
        "SELECT COUNT(*) AS total FROM orders",
        callback
    );
};

exports.totalRevenue = (
    callback
) => {
    db.query(
        `
        SELECT
        IFNULL(
            SUM(total),
            0
        ) AS revenue
        FROM orders
        `,
        callback
    );
};