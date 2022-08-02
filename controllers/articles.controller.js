const { selectArticleById } = require("../models/articles.model");
const {
  countCommentsByAuthorAsync: countCommentsAsync,
} = require("../models/comments.model");

module.exports.getArticleById = async (request, response) => {
  const { article_id } = request.params;
  const {
    rows: [article],
  } = await selectArticleById(article_id);
  const count = await countCommentsAsync(article.author);
  article.comment_count = count;
  response.send({ article });
};
