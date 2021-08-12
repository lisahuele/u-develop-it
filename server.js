//import express.js
const express = require("express");
//import mysql2
const mysql = require("mysql2");
const inputCheck = require("./utils/inputCheck");
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

app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//Select a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id=?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

//Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id=?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if(err) {
            res.statusMessage(400).json({error: err.message});
        } else if (!result.affectedRows){
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        };
    });
});

//Create a candidate
app.post('/api/candidate', ({body}, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if(errors) {
        res.status(400).json({error: err.message});
        return;
    };

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                VALUES(?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

//Default response for any other requests (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}/`);
});
