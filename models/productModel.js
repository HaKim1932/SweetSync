const db = require("../config/db");

// CREATE
exports.createProduct = (
name,
description,
price,
stock,
category,
image,
callback
) => {


const sql = `
    INSERT INTO products
    (
        name,
        description,
        price,
        stock,
        category,
        image
    )
    VALUES (?, ?, ?, ?, ?, ?)
`;

db.query(
    sql,
    [
        name,
        description,
        price,
        stock,
        category,
        image
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

exports.searchProducts = (
search,
category,
callback
) => {


let sql =
    "SELECT * FROM products WHERE 1=1";

const params = [];

if (
    search &&
    search.trim() !== ""
) {
    sql +=
        " AND name LIKE ?";

    params.push(
        "%" +
        search.trim() +
        "%"
    );
}

if (
    category &&
    category.trim() !== ""
) {
    sql +=
        " AND category = ?";

    params.push(
        category.trim()
    );
}

sql +=
    " ORDER BY name ASC";

db.query(
    sql,
    params,
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

exports.deductStock = (
productId,
quantity,
callback
) => {


const sql = `
    UPDATE products
    SET stock = stock - ?
    WHERE id = ?
    AND stock >= ?
`;

db.query(
    sql,
    [
        quantity,
        productId,
        quantity
    ],
    (
        err,
        result
    ) => {

        if (err) {
            return callback(err);
        }

        callback(
            null,
            result
        );

    }
);


};
