// app.js
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const db = require('./database'); // This points to the ONE file we just made

const app = express();

app.use(cors());
app.use(express.json());

// Initialize the tables
db.init(); 

app.use('/api', apiRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));