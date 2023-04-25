const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const ERROR_CODE = require('../errors/ERROR_CODE');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  NOT_FOUND_ERROR,
} = require('../constants/utils');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

// # keyword, title, text, date, source, link, and image in the body
module.exports.createArticle = async (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  try {
    const newArticle = await Article.create({
      keyword, title, text, date, source, link, image, owner,
    });
    res.send(newArticle);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ERROR_CODE('Invalid Article id'));
    } else if (err.statusCode === NotFoundError) {
      next(new NotFoundError(' bad request'));
    } else {
      next(err);
    }
  }
};
module.exports.deleteArticleById = async (req, res, next) => {
  Article.findById({ _id: req.params._id }).select('owner').orFail(() => { throw new NotFoundError('Article not found'); })
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        return next(new ForbiddenError('You are not the the owner of the Article'));
      }
      return article.deleteOne()
        .then(() => res.send({ message: 'Article delete' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ERROR_CODE('Invalid card id'));
      } else if (err.statusCode === NOT_FOUND_ERROR) {
        next(new NotFoundError('user not found'));
      } else {
        next(err);
      }
    });
};
