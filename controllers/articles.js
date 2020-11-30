const Articles = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const { notFoundArticleMessage, forbiddenMessage } = require('../utils/constants');

module.exports.getArticles = (req, res, next) => {
  const id = req.user._id;
  Articles.find({ owner: id }).select('+owner').sort({ date: -1 })
    .then((articles) => {
      res.send(articles);
    })
    .catch((err) => next(err));
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user;
  Articles.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => {
      res.send(article);
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const { _id: userId } = req.user;
  Articles.findById(articleId)
    .populate('owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError(notFoundArticleMessage);
      }
      const { _id: articleOwnerId } = article.owner;
      if (`${articleOwnerId}` === userId) {
        Articles.findByIdAndRemove(articleId)
          .then((data) => {
            if (!data) {
              throw new NotFoundError(notFoundArticleMessage);
            }
            res.send({ data });
          })
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenMessage);
      }
    })
    .catch(next);
};
