const db = require("../config/db");

const findByEmail = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], callback);
};

const createUser = (fullname, email, password, callback) => {
    const sql =
        "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)";

    db.query(
        sql,
        [fullname, email, password],
        callback
    );
};

module.exports = {
    findByEmail,
    createUser
};