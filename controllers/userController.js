const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// REGISTER
exports.register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        const hashedPassword =
            await bcrypt.hash(password, 10);

        User.createUser(
            fullname,
            email,
            hashedPassword,
            (err) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: "Registration failed"
                    });
                }

                res.redirect("/auth/login");
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, async (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Server error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const user = results[0];

        if (user.is_active === 0) {
            return res.status(403).json({
                message: "Your account has been deactivated."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        req.session.user = {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            role: user.role
        };

        res.redirect("/dashboard");
    });
};

// PROFILE
exports.profile = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: "Not logged in"
        });
    }

    res.json(req.session.user);
};

// LOGOUT
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth/login");
    });
};

// ADMIN - LIST USERS
exports.adminUsers = (req, res) => {
    User.getAllUsers((err, users) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.render("admin-users", {
            users
        });
    });
};

// ADMIN - UPDATE USER ROLE
exports.updateUserRole = (req, res) => {
    const userId = req.params.id;
    const role = req.body.role;

    User.updateUserRole(
        userId,
        role,
        (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.redirect("/admin/users");
        }
    );
};

// ADMIN - ACTIVATE / DEACTIVATE USER
exports.updateUserStatus = (req, res) => {
    const userId = req.params.id;
    const isActive = req.body.is_active;

    User.updateUserStatus(
        userId,
        isActive,
        (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.redirect("/admin/users");
        }
    );
};