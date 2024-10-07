const pool = require('../config/db')
const asyncFunctionHandler = require('../middlewares/asyncFunctionHandler')

const createUser = asyncFunctionHandler(async (username, password) => {
    const user = await pool.query(`INSERT INTO users(username, password) VALUES($1, $2) RETURNING * `, [username, password])
    return user.rows[0]
})

const getAllUsers = asyncFunctionHandler(async () => {
    const users = await pool.query(`SELECT * FROM users WHERE isdeleted = false`)
    return users.rows
})

const getUserByUsername = asyncFunctionHandler(async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND isdeleted = false', [username]);
    return result.rows[0]
})

const getUserById = asyncFunctionHandler(async (id) => {
    const result = await pool.query('SELECT id, username FROM users WHERE id = $1 AND isdeleted = false', [id]);
    return result.rows[0]
})

const getPasswordById = asyncFunctionHandler(async (id) => {
    const result = await pool.query('SELECT password FROM users WHERE id = $1 AND isdeleted = false', [id]);
    return result.rows[0]
})

const updateUser = asyncFunctionHandler(async (username, password, id) => {
    const result = await pool.query(`UPDATE users 
        SET username = $1, password = $2 
        WHERE id = $3 RETURNING *
    `, [username, password, id]);
    return result.rows[0]
})


module.exports = {
    createUser,
    getAllUsers,
    getUserByUsername,
    getUserById,
    updateUser,
    getPasswordById
}