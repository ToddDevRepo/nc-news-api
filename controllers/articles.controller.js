const {
  selectArticleById,
  updateArticleVotes: incrementArticleVotes,
} = require("../models/articles.model");

module.exports.getArticleById = async (request, response, next) => {
  const { article_id } = request.params;
  try {
    const article = await selectArticleById(article_id);
    response.send({ article });
  } catch (error) {
    next(error);
  }
};

module.exports.updateVotesForArticleId = async (request, response, next) => {
  const { article_id } = request.params;
  const { body: incObj } = request;
  try {
    const updated = await incrementArticleVotes(article_id, incObj.inc_votes);
    response.send({ updatedArticle: updated });
  } catch (error) {
    next(error);
  }
};
