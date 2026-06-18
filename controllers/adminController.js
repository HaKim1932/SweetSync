const Product = require("../models/productModel");
const Order = require("../models/orderModel");

exports.dashboard = (req, res) => {
  Product.countProducts((err, products) => {
    if (err) return res.status(500).send(err);

    Order.countOrders((err, orders) => {
      if (err) return res.status(500).send(err);

      Order.getSalesReport((err, report) => {
        if (err) return res.status(500).send(err);

        Order.getTopSellingProducts((err, topProducts) => {
          if (err) return res.status(500).send(err);

          Product.getLowStockProducts((err, lowStockProducts) => {
            if (err) return res.status(500).send(err);

            Order.getMonthlyRevenue((err, monthlyRevenue) => {
              if (err) return res.status(500).send(err);

              Order.getMonthlyOrders((err, monthlyOrders) => {
                if (err) return res.status(500).send(err);

                Order.getProductSalesPie((err, productSalesPie) => {
                  if (err) return res.status(500).send(err);

                  res.render("admin-dashboard", {
                    user: req.session.user,
                    totalProducts: products[0].total,
                    totalOrders: orders[0].total,
                    report: report[0],
                    topProducts: topProducts,
                    lowStockProducts: lowStockProducts,
                    monthlyRevenue: monthlyRevenue,
                    monthlyOrders: monthlyOrders,
                    productSalesPie: productSalesPie
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};