const db = require("../config/db");

const findByEmail = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(
        sql,
        [email],
        callback
    );
};

const createUser = (
    fullname,
    email,
    password,
    callback
) => {
    const sql = `
        INSERT INTO users
        (fullname, email, password)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            fullname,
            email,
            password
        ],
        callback
    );
};

// ADMIN - GET ALL USERS
const getAllUsers = (callback) => {
    const sql = `
        SELECT
            id,
            fullname,
            email,
            role,
            is_active,
            created_at
        FROM users
        ORDER BY id DESC
    `;

    db.query(
        sql,
        callback
    );
};

// ADMIN - UPDATE USER ROLE
const updateUserRole = (
    userId,
    role,
    callback
) => {
    const sql = `
        UPDATE users
        SET role = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            role,
            userId
        ],
        callback
    );
};

// ADMIN - ACTIVATE / DEACTIVATE USER
const updateUserStatus = (
    userId,
    isActive,
    callback
) => {
    const sql = `
        UPDATE users
        SET is_active = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            isActive,
            userId
        ],
        callback
    );
};

module.exports = {
    findByEmail,
    createUser,
    getAllUsers,
    updateUserRole,
    updateUserStatus
};