require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const {
  validateUserBody,
  validateAuthentication,
} = require('./middlewares/validation');
const limiter = require('./constants/limiter');

const app = express();
mongoose.set('strictQuery', false);

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const { MONGO_DB, PORT } = require('./constants/config');

mongoose.connect(MONGO_DB);
mongoose.set('strictQuery', false);

app.use(helmet());
app.use(limiter);

const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(requestLogger);

app.post('/signin', validateAuthentication, login);
app.post('/signup', validateUserBody, createUser);

app.use('/users', auth, userRoutes);
app.use('/articles', auth, articleRoutes);

app.use((req, res, next) => {
  next(new NotFoundError('The requested resource was not found'));
});
app.use(errorLogger);
app.use(errors());
app.listen(PORT);
