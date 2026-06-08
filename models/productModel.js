const db = require("../config/db");

// CREATE
exports.createProduct = (
    name,
    description,
    price,
    stock,
    category,
    callback
) => {
    const sql = `
        INSERT INTO products
        (name, description, price, stock, category)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            description,
            price,
            stock,
            category
        ],
        callback
    );
};

// READ ALL
exports.getAllProducts = (callback) => {
    db.query(
        "SELECT * FROM products",
        callback
    );
};

// READ ONE
exports.getProductById = (
    id,
    callback
) => {
    db.query(
        "SELECT * FROM products WHERE id = ?",
        [id],
        callback
    );
};

// UPDATE
exports.updateProduct = (
    id,
    name,
    description,
    price,
    stock,
    category,
    callback
) => {
    const sql = `
        UPDATE products
        SET
            name = ?,
            description = ?,
            price = ?,
            stock = ?,
            category = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            description,
            price,
            stock,
            category,
            id
        ],
        callback
    );
};

// DELETE
exports.deleteProduct = (
    id,
    callback
) => {
    db.query(
        "DELETE FROM products WHERE id = ?",
        [id],
        callback
    );
};
exports.countProducts = (
    callback
) => {
    db.query(
        "SELECT COUNT(*) AS total FROM products",
        callback
    );
};