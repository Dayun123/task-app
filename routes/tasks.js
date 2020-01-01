const express = require('express');
const Task = require('../src/models/task');
const auth = require('../src/middleware/auth');
const parseQuery = require('../src/middleware/parseQuery');
const ResponseError = require('../src/utils/responseError');

const router = express.Router();

router.use(auth);

router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create(req.body, res.locals.user);
    res.status(201).json(task.profile);
  } catch (e) {
    next(new ResponseError(400, e.message));
  }
});

router.get('/', parseQuery, async (req, res, next) => {
  console.log(res.locals.user._id);
  const tasks = await Task.find(req.filter, 'description completed _id').skip(req.skip).limit(req.numResults);
  res.status(200).json(tasks);
});

module.exports = router;