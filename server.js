//import express.js
const express = require("express");
//import mysql2
const mysql = require("mysql2");
//server configuration
const PORT = process.env.PORT || 3001;
//create new express app
const app = express();

//parse incoming data
//recognize incoming data as string/array. extended:false = use qs library
app.use(express.urlencoded({ extended: false }));
//recognize incoming data as a JSON object
app.use(express.json());

//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'watermelon',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

db.query(`SELECT * FROM candidates`, (err, rows) => {
    // console.log(rows);
});

//GET a single candidate
db.query(`SELECT * FROM candidates WHERE id = 1`, (err, rows) => {
    if(err) {
        console.log(err);
    }
    console.log(rows);
});

//Delete a candidate
// db.query(`DELETE FROM candidates WHERE id=?`, 1, (err, results) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(results);
// });

//Create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
            VALUES(?,?,?,?)`;
const param = [1, 'Ronald', 'Firbank', 1];

db.query(sql, param, (err, result) => {
    if(err) {
        console.log(err);
    }
    console.log(result);
});

//Default response for any other requests (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}/`);
});
