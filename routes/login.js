const express = require('express');

const router = express.Router();

router.post('/', async (req, res, next) => {
  res.status(200).send();
});

module.exports = router;