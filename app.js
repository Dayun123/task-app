const express = require('express');
const logger = require('morgan');

require('./src/db/connect');

const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use('/user', usersRouter);

module.exports = app;
