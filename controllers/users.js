const Users = require('../models/user');

module.exports.getUser = (req, res, next) => {
  Users.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};