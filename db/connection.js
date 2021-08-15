//import mysql2
const mysql = require("mysql2");

//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'watermelon',
        database: 'election'
    },
);

module.exports = db;