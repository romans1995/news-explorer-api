require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const { limiter } = require('./constants/limiter');

const router = require('./routes');

const app = express();
mongoose.set('strictQuery', false);

const errorHandler = require('./middlewares/errorHandler');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_DB = 'mongodb://127.0.0.1:27017/newsexplorer', PORT } = require('./constants/config');

mongoose.connect(MONGO_DB);

app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.use(cors());
app.options('*', cors());

app.use(express.json());

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(3000 || PORT);
