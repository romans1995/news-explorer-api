const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const {
  validateUserBody,
  validateAuthentication,
} = require('../middlewares/validation');
const NotFoundError = require('../errors/NotFoundError');

const userRouter = require('./users');
const articleRouter = require('./articles');

router.post('/signin', validateAuthentication, login);
router.post('/signup', validateUserBody, createUser);

router.use(auth);

router.use('/users', auth, userRouter);
router.use('/articles', auth, articleRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Requested resource not foundd'));
});

module.exports = router;
