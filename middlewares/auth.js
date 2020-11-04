const jwt = require('jsonwebtoken');
const RegAuthError = require('../errors/reg-auth-err');
const { wrongHeaderMessage, needAuthMessage } = require('../utils/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new RegAuthError(wrongHeaderMessage);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret');
  } catch (err) {
    return res
      .status(401)
      .send({ message: needAuthMessage });
  }
  req.user = payload;
  next();
};
