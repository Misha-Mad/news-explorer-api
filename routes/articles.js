const articlesRouter = require('express').Router();
const { validationGetArticles, validationCreateArticle, validationDeleteArticle } = require('../middlewares/requestValidation');

const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/articles');

articlesRouter.get('/articles', validationGetArticles, getArticles);

articlesRouter.post('/articles', validationCreateArticle, createArticle);

articlesRouter.delete('/articles/:articleId', validationDeleteArticle, deleteArticle);

module.exports = articlesRouter;
