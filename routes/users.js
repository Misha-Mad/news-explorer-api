const usersRouter = require('express').Router();
const { validationGetUser } = require('../middlewares/requestValidation');

const {
  getUser,
} = require('../controllers/users');

usersRouter.get('/users/me', validationGetUser, getUser);

module.exports = usersRouter;
