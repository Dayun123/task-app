const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
  res.status(201).json({ msg: 'Task' });
});

module.exports = router;