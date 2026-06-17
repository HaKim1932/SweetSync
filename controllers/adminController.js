const Product = require("../models/productModel");
const Order = require("../models/orderModel");

exports.dashboard = (req, res) => {
  Product.countProducts((err, products) => {
    if (err) {
      console.error("dashboard - countProducts error:", err);
      return res.status(500).send(err);
    }

    Order.countOrders((err, orders) => {
      if (err) {
        console.error("dashboard - countOrders error:", err);
        return res.status(500).send(err);
      }

      Order.getSalesReport((err, report) => {
        if (err) {
          console.error("dashboard - getSalesReport error:", err);
          return res.status(500).send(err);
        }

        Order.getTopSellingProducts((err, topProducts) => {
          if (err) {
            console.error(
              "dashboard - getTopSellingProducts error:",
              err
            );
            return res.status(500).send(err);
          }

          res.render("admin-dashboard", {
            user:          req.session.user,
            totalProducts: products[0].total,
            totalOrders:   orders[0].total,
            report:        report[0],
            topProducts:   topProducts
          });
        });
      });
    });
  });
};