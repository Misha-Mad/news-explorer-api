const routes = require('express').Router();
const usersRouter = require('./users');
const articlesRouter = require('./articles');

routes.use(usersRouter);
routes.use(articlesRouter);

module.exports = routes;
