const jwt = require('jsonwebtoken');
const RegAuthError = require('../errors/reg-auth-err');
const { wrongHeaderMessage, needAuthMessage } = require('../utils/constants');
const { JWT_SECRET_DEV } = require('../utils/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new RegAuthError(wrongHeaderMessage);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    next(new RegAuthError(needAuthMessage));
  }
  req.user = payload;
  next();
};
