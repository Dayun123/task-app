const express = require('express');
const Task = require('../src/models/task');
const router = express.Router();

router.post('/', (req, res, next) => {
  res.status(201).json(new Task(req.body));
});

module.exports = router;