const express = require('express');
const multer = require('multer');
const upload = multer();
const User = require('../src/models/user');
const validateContentType = require('../src/middleware/validateContentType');
const auth = require('../src/middleware/auth');
const processAvatar = require('../src/middleware/processAvatar');
const ResponseError = require('../src/utils/responseError');

const router = express.Router();

router.post('/', validateContentType, async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user.profile);
  } catch (e) {
    next(new ResponseError(400, e.message));
  }
});

router.use(auth);

router.get('/', (req, res, next) => {
  res.status(200).json(res.locals.user.profile);
});

router.post('/avatar', upload.single('avatar'), processAvatar, (req, res, next) => {

  res.status(201).json(res.locals.user.profileAvatar);
});

module.exports = router;
