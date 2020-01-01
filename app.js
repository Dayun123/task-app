const express = require('express');
const logger = require('morgan');

require('./src/db/connect');

const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');
const loginRouter = require('./routes/login');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use('/', loginRouter);
app.use('/user', usersRouter);
app.use('/tasks', tasksRouter);

app.use((err, req, res, next) => {
  if (err.message.includes('too large')) {
    return res.status(413).json({ msg: err.message });
  }
  if (isNaN(err.status)) return res.status(500).json({ msg: err.message });
  res.status(err.status).json({ msg: err.message });
});

module.exports = app;
