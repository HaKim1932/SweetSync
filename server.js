require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");

require("./config/db");

const userRoutes =
    require("./routes/users");

const authRoutes =
    require("./routes/authRoutes");

const dashboardRoutes =
    require("./routes/dashboardRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const cartRoutes =
    require("./routes/cartRoutes");

const productRoutes =
    require("./routes/productRoutes");

const orderRoutes =
    require("./routes/orderRoutes");

const reservationRoutes =
    require("./routes/reservationRoutes");

const app = express();

app.set("view engine", "ejs");

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    express.static("public")
);

app.use(
    session({
        secret: "sweetsync_secret_key",
        resave: false,
        saveUninitialized: false
    })
);

// Make session user available in every EJS view
app.use((req, res, next) => {
    res.locals.user =
        req.session.user || null;

    next();
});

app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/admin", adminRoutes);
app.use("/cart", cartRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/reservations", reservationRoutes);

app.get("/", (req, res) => {
    res.redirect("/auth/login");
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "SweetSync API is working"
    });
});

app.use((req, res) => {
    res.status(404).render("errors/404");
});

app.listen(process.env.PORT, () => {
    console.log(
        `Server running on port ${process.env.PORT}`
    );
});