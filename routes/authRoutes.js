const express = require("express");
const router = express.Router();

const userController =
    require("../controllers/userController");

// LOGIN PAGE
router.get("/login", (req, res) => {
    res.render("auth/login");
});

// REGISTER PAGE
router.get("/register", (req, res) => {
    res.render("auth/register");
});

// LOGOUT
router.post(
    "/logout",
    userController.logout
);

module.exports = router;