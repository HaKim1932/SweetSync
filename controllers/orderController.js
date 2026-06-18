const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const EmailService = require("../utils/emailService");

// CHECKOUT
exports.checkout = (req, res) => {
const userId = req.session.user.id;

Cart.getUserCart(userId, (err, carts) => {
    if (err) {
        return res.send(err);
    }

    if (carts.length === 0) {
        return res.send("Cart not found");
    }

    const cartId = carts[0].id;

    Cart.getCartItems(cartId, (err, items) => {
        if (err) {
            return res.send(err);
        }

        // STOCK VALIDATION
        let checkCount = 0;

        items.forEach((item) => {
            Product.getProductById(
                item.product_id,
                (err, results) => {
                    if (err) {
                        return res.send(err);
                    }

                    const product = results[0];

                    if (!product) {
                        return res.send(
                            "Product not found"
                        );
                    }

                    if (
                        product.stock <
                        item.quantity
                    ) {
                        return res.send(
                            `${product.name} is out of stock. Available: ${product.stock}`
                        );
                    }

                    checkCount++;

                    if (
                        checkCount ===
                        items.length
                    ) {
                        proceedCheckout(
                            items,
                            cartId
                        );
                    }
                }
            );
        });

        function proceedCheckout(
            items,
            cartId
        ) {
            let total = 0;

            items.forEach((item) => {
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

                    items.forEach((item) => {
                        Order.addOrderItem(
                            orderId,
                            item.product_id,
                            item.quantity,
                            item.price,
                            (err) => {
                                if (err) {
                                    return res.send(err);
                                }

                                Product.deductStock(
                                    item.product_id,
                                    item.quantity,
                                    (err) => {
                                        if (err) {
                                            return res.send(err);
                                        }

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
                            }
                        );
                    });
                }
            );
        }
    });
});


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

            Order.getOrderWithUser(
                orderId,
                async (
                    err2,
                    results
                ) => {
                    if (err2) {
                        return res.send(err2);
                    }

                    if (results.length === 0) {
                        return res.redirect(
                            "/admin/orders"
                        );
                    }

                    const order =
                        results[0];

                    try {
                        await EmailService.sendOrderStatusEmail(
                            order.email,
                            order.fullname,
                            order.id,
                            status
                        );
                    } catch (emailError) {
                        console.log(
                            "Email send failed:",
                            emailError
                        );
                    }

                    res.redirect(
                        "/admin/orders"
                    );
                }
            );
        }
    );
};

// ORDER DETAILS
exports.orderDetails = (req, res) => {
    const orderId = req.params.id;

    Order.getOrderById(orderId, (err, orderResults) => {
        if (err) {
            return res.send(err);
        }

        if (orderResults.length === 0) {
            return res.send("Order not found");
        }

        Order.getOrderItems(orderId, (err, items) => {
            if (err) {
                return res.send(err);
            }

            res.render("order-details", {
                order: orderResults[0],
                orderId,
                items
            });
        });
    });
};

// UPLOAD PAYMENT PROOF
exports.uploadPaymentProof = (
    req,
    res
) => {
    const orderId =
        req.params.id;

    if (!req.file) {
        return res.send(
            "Please upload a payment proof image."
        );
    }

    const paymentProof =
        "images/" + req.file.filename;

    Order.updatePaymentProof(
        orderId,
        paymentProof,
        (err) => {
            if (err) {
                return res.send(err);
            }

            res.redirect(
                "/orders/" + orderId
            );
        }
    );
};