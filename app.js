const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/newsexplorer');
mongoose.set('strictQuery', true);

app.use(express.json());
app.listen(PORT, () => {
    console.log('Server listening on port 3000');
});