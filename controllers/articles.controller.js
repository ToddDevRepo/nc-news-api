const { unprocessableEntity } = require("../errors");
const { Query: QueryArgs, QueryTypes } = require("../globals");
const {
  selectArticleById,
  updateArticleVotes: incrementArticleVotes,
  selectAllArticles,
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

module.exports.getArticles = async (request, response, next) => {
  console.log("Get articles controller");
  const { query } = request;
  console.log(query);
  try {
    const articles = await selectAllArticles(
      query[QueryTypes.topic],
      query[QueryTypes.sortBy],
      query[QueryTypes.order]
    );
    response.send({ articles });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
