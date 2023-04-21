const { PORT = 3000 } = process.env;
require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
mongoose.set('strictQuery', false);
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');

mongoose.connect('mongodb://127.0.0.1:27017/newsexplorer');
mongoose.set('strictQuery', false);

const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(requestLogger);


app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, userRoutes);
app.use('/articles', auth, articleRoutes);

app.use((req, res, next) => {
    next(new NotFoundError('The requested resource was not found'));
});
app.use(errorLogger);
app.listen(PORT, () => {
    console.log('Server listening on port 3000');
});