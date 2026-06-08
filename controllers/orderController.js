const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

// CHECKOUT
exports.checkout = (req, res) => {
    const userId = req.session.user.id;

    Cart.getUserCart(
        userId,
        (err, carts) => {
            if (err) {
                return res.send(err);
            }

            if (carts.length === 0) {
                return res.send(
                    "Cart not found"
                );
            }

            const cartId = carts[0].id;

            Cart.getCartItems(
                cartId,
                (err, items) => {
                    if (err) {
                        return res.send(err);
                    }

                    let total = 0;

                    items.forEach(item => {
                        total +=
                            item.price *
                            item.quantity;
                    });

                    Order.createOrder(
                        userId,
                        total,
                        (err, result) => {
                            if (err) {
                                return res.send(err);
                            }

                            const orderId =
                                result.insertId;

                            let completed = 0;

                            items.forEach(item => {
                                Order.addOrderItem(
                                    orderId,
                                    item.product_id,
                                    item.quantity,
                                    item.price,
                                    () => {
                                        completed++;

                                       if (
    completed ===
    items.length
) {
    Cart.clearCart(
        cartId,
        () => {
            res.redirect(
                "/orders"
            );
        }
    );
}
                                    }
                                );
                            });
                        }
                    );
                }
            );
        }
    );
};

// ORDER HISTORY
exports.orderHistory = (req, res) => {
    const userId =
        req.session.user.id;

    Order.getOrdersByUser(
        userId,
        (err, orders) => {
            if (err) {
                return res.send(err);
            }

            res.render(
                "orders",
                { orders }
            );
        }
    );
};
// ADMIN VIEW ORDERS
exports.adminOrders = (req, res) => {
    Order.getAllOrders(
        (err, orders) => {
            if (err) {
                return res.send(err);
            }

            res.render(
                "admin-orders",
                { orders }
            );
        }
    );
};
// UPDATE ORDER STATUS
exports.updateStatus = (
    req,
    res
) => {
    const orderId =
        req.params.id;

    const status =
        req.body.status;

    Order.updateStatus(
        orderId,
        status,
        (err) => {
            if (err) {
                return res.send(err);
            }

            res.redirect(
                "/admin/orders"
            );
        }
    );
};