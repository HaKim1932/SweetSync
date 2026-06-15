const db = require("../config/db");

// GET USER CART
exports.getUserCart = (
    userId,
    callback
) => {
    db.query(
        "SELECT * FROM cart WHERE user_id = ?",
        [userId],
        callback
    );
};

// CREATE CART
exports.createCart = (
    userId,
    callback
) => {
    db.query(
        "INSERT INTO cart (user_id) VALUES (?)",
        [userId],
        callback
    );
};

// ADD ITEM TO CART
exports.addToCart = (
    cartId,
    productId,
    quantity,
    callback
) => {
    db.query(
        `
        INSERT INTO cart_items
        (cart_id, product_id, quantity)
        VALUES (?, ?, ?)
        `,
        [
            cartId,
            productId,
            quantity
        ],
        callback
    );
};

// GET CART ITEMS
exports.getCartItems = (cartId, callback) => {
  db.query(
    `
    SELECT
      cart_items.id,
      cart_items.product_id,
      cart_items.quantity,
      products.name,
      products.price
    FROM cart_items
    JOIN products
      ON products.id = cart_items.product_id
    WHERE cart_items.cart_id = ?
    `,
    [cartId],
    callback
  );
};

exports.clearCart = (
    cartId,
    callback
) => {
    db.query(
        "DELETE FROM cart_items WHERE cart_id = ?",
        [cartId],
        callback
    );
};

exports.updateCartItemQuantity = (
cartItemId,
quantity,
callback
) => {
db.query(
"UPDATE cart_items SET quantity = ? WHERE id = ?",
[quantity, cartItemId],
callback
);
};

exports.removeCartItem = (
cartItemId,
callback
) => {
db.query(
"DELETE FROM cart_items WHERE id = ?",
[cartItemId],
callback
);
};

exports.getCartTotal = (
    cartId,
    callback
) => {
    db.query(
        `
        SELECT
            cart_items.id AS cart_item_id,
            products.name,
            products.price,
            cart_items.quantity,
            (products.price * cart_items.quantity)
            AS subtotal
        FROM cart_items
        JOIN products
            ON products.id =
               cart_items.product_id
        WHERE cart_items.cart_id = ?
        `,
        [cartId],
        (err, rows) => {
            if (err) {
                return callback(err);
            }

            let grandTotal = 0;

            rows.forEach((row) => {
                grandTotal +=
                    parseFloat(
                        row.subtotal
                    );
            });

            callback(
                null,
                {
                    items: rows,
                    grandTotal
                }
            );
        }
    );
};
exports.getCartItemById = (
    cartItemId,
    callback
) => {
    db.query(
        "SELECT * FROM cart_items WHERE id = ?",
        [cartItemId],
        (err, results) => {
            if (err) {
                return callback(err);
            }

            callback(
                null,
                results[0]
            );
        }
    );
};
