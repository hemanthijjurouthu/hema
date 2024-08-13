const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyparser=require("body-parser");
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_NAME:', process.env.DB_NAME);

// Create a database connection using environment variables

const db = mysql.createConnection({
  host: process.env.DB_HOST ||'localhost',
  user: process.env.DB_USER ||'root',
  password: process.env.DB_PASS ||'Ram@1234#',
  database: process.env.DB_NAME ||'flashcards',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.get('/api/flashcards', (req, res) => {
  db.query('SELECT * FROM flashcards', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/flashcards', (req, res) => {
  const { question, answer } = req.body;
  db.query('INSERT INTO flashcards (question, answer) VALUES (?, ?)', [question, answer], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.put('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  db.query('UPDATE flashcards SET question = ?, answer = ? WHERE id = ?', [question, answer, id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.delete('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM flashcards WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Remove the duplicate PUT route
// app.put('/api/flashcards/:id', (req, res) => { ... });

const PORT = process.env.PORT || 50000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
