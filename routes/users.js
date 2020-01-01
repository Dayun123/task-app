const express = require('express');
const multer = require('multer');
const upload = multer({ 
  limits: {
    fileSize: 10_000_000,
  },
});
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

router.get('/avatar', (req, res, next) => {
  res.set('Content-Type', 'image/png');
  res.status(200).send(res.locals.user.profileAvatar.avatar);
});

module.exports = router;
