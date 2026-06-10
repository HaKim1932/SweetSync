const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const Order = require("../models/orderModel");

router.get("/", requireAuth, (req, res) => {
  const userId = req.session.user.id;

  // Step 1: get order counts (total, pending, completed)
  Order.getOrderCountByUser(userId, (err, counts) => {
    if (err) {
      console.error("dashboard - getOrderCountByUser error:", err);
      return res.redirect("/");
    }

    // Step 2: get last 5 orders for recent orders table
    Order.getRecentOrdersByUser(userId, (err, recentOrders) => {
      if (err) {
        console.error("dashboard - getRecentOrdersByUser error:", err);
        return res.redirect("/");
      }

      res.render("dashboard", {
        user:         req.session.user,
        counts:       counts,
        recentOrders: recentOrders
      });
    });
  });
});

module.exports = router;