const Product =
    require("../models/productModel");

const Order =
    require("../models/orderModel");

exports.dashboard = (
    req,
    res
) => {

    Product.countProducts(
        (err, products) => {

            Order.countOrders(
                (err2, orders) => {

                    Order.totalRevenue(
                        (
                            err3,
                            revenue
                        ) => {

                            res.render(
                                "admin-dashboard",
                                {
                                    user:
                                        req.session.user,

                                    totalProducts:
                                        products[0].total,

                                    totalOrders:
                                        orders[0].total,

                                    revenue:
                                        revenue[0].revenue
                                }
                            );

                        }
                    );

                }
            );

        }
    );

};