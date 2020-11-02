const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const RegAuthError = require('../errors/reg-auth-err');

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  Users.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
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
          res.status(200).send({ message: 'Успешная регистрация' });
        })
        .catch(next);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      if (!user.email) {
        throw new RegAuthError('Неправильные почта или пароль');
      }
      // eslint-disable-next-line no-undef
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
