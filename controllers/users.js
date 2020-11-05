const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const RegAuthError = require('../errors/reg-auth-err');
const ConflictError = require('../errors/conflict-err');
const {
  notFoundUserMessage,
  succesfulyRegMessage,
  regAuthMessage,
  uniqueEmailErrorMessage,
} = require('../utils/constants');
const { JWT_SECRET_DEV } = require('../utils/config');

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  Users.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundUserMessage);
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => {
      Users.create({
        name,
        email,
        password: hash,
      })
        .then(() => {
          res.status(200).send({ message: succesfulyRegMessage });
        })
        .catch((err) => {
          if (err.name === 'MongoError' && err.code === 11000) {
            next(new ConflictError(uniqueEmailErrorMessage));
          }
          next(err);
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      if (!user.email) {
        throw new RegAuthError(regAuthMessage);
      }
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : JWT_SECRET_DEV, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
