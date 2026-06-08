const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    if (req.session.user.role !== "admin") {
        return res.status(403).send("Admin Access Only");
    }

    next();
};

module.exports = {
    requireAuth,
    requireAdmin
};