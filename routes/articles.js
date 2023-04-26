const router = require('express').Router();
const {
  getArticles,
  createArticle,
  deleteArticleById,
} = require('../controllers/articles');
const {
  validateArticle,
  validateObjectId,
} = require('../middlewares/validation');

router.get('/', getArticles);
router.post('/', validateArticle, createArticle);
router.delete('/:_id', validateObjectId, deleteArticleById);

module.exports = router;
