const { selectArticleById } = require("../models/articles.model");
const {
  countCommentsByAuthorAsync: countCommentsAsync,
} = require("../models/comments.model");

module.exports.getArticleById = async (request, response, next) => {
  const { article_id } = request.params;
  try {
    const article = await selectArticleById(article_id);
    response.send({ article });
  } catch (error) {
    next(error);
  }
};

module.exports.patchArticleById = (request, response, next) => {
  console.log("Patch article controller");
  response.send({});
};
