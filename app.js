const express = require('express');
const logger = require('morgan');

const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use('/users', usersRouter);

module.exports = app;
