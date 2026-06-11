const db = require("../config/db");

exports.createOrder = (userId, total, callback) => {
    const sql = `
        INSERT INTO orders
        (user_id, total)
        VALUES (?, ?)
    `;

    db.query(sql, [userId, total], callback);
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
        [orderId, productId, quantity, price],
        callback
    );
};

exports.getOrderCountByUser = (userId, callback) => {
    const sql = `
        SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
            SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed
        FROM orders
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

exports.getRecentOrdersByUser = (userId, callback) => {
    const sql = `
        SELECT
            id,
            total,
            status,
            created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 5
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

exports.getOrdersByUser = (userId, callback) => {
    db.query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
        [userId],
        callback
    );
};

exports.getAllOrders = (callback) => {
    const sql = `
        SELECT
            orders.*,
            users.fullname
        FROM orders
        JOIN users
        ON orders.user_id = users.id
        ORDER BY orders.id DESC
    `;

    db.query(sql, callback);
};

exports.updateStatus = (orderId, status, callback) => {
    db.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, orderId],
        callback
    );
};

exports.countOrders = (callback) => {
    db.query(
        "SELECT COUNT(*) AS total FROM orders",
        callback
    );
};

exports.totalRevenue = (callback) => {
    db.query(
        `
        SELECT
            IFNULL(SUM(total), 0) AS revenue
        FROM orders
        `,
        callback
    );
};
exports.getOrderItems = (
    orderId,
    callback
) => {
    const sql = `
        SELECT
            order_items.*,
            products.name
        FROM order_items
        JOIN products
        ON order_items.product_id = products.id
        WHERE order_items.order_id = ?
    `;

    db.query(
        sql,
        [orderId],
        callback
    );
};