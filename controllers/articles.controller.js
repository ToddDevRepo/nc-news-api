const { selectArticleById } = require("../models/articles.model");
const {
  countCommentsByAuthorAsync: countCommentsAsync,
} = require("../models/comments.model");

module.exports.getArticleById = async (request, response) => {
  console.log("Controller article by id");
  const { article_id } = request.params;
  const {
    rows: [article],
  } = await selectArticleById(article_id);
  console.log(article);
  const count = await countCommentsAsync(article.author);
  console.log(count);
  article.comment_count = count;
  response.send({ article });
};
