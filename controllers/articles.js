const Articles = require('../models/article');

module.exports.getArticles = (req, res, next) => {
  Articles.find({}).sort({ date: -1 })
    .then((articles) => {
      res.send(articles);
    })
    .catch((err) => next(err));
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;
  Articles.create({ keyword, title, text, date, source, link, image, owner })
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
      const { _id: articleOwnerId } = article.owner;
      if (`${articleOwnerId}` === userId) {
        Cards.findByIdAndRemove(articleId)
          .then((data) => {
            res.send({ data });
          })
          .catch(next);
      }
    })
    .catch(next);
};