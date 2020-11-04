const {
  validationMessage,
  wrongIdMessage,
  uniqueEmailErrorMessage,
  serverErrorMessage,
} = require('../utils/constants');

module.exports.errorsHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = validationMessage;
  }
  if (err.name === 'CastError') {
    statusCode = 400;
    message = wrongIdMessage;
  }
  if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 409;
    message = uniqueEmailErrorMessage;
  }
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? serverErrorMessage
        : message,
    });
  next();
};
