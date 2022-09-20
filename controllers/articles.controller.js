const { unprocessableEntity } = require("../errors");
const { Query: QueryArgs, QueryTypes } = require("../globals");
const {
  selectArticleByIdAsync: selectArticleByIdAsync,
  selectAllArticles,
  updateArticleVotesAsync,
} = require("../models/articles.model");
const {
  selectArticleComments,
  insertArticleComment,
} = require("../models/comments.model");

module.exports.getArticleByIdAsync = async (request, response, next) => {
  const { article_id } = request.params;
  try {
    const article = await selectArticleByIdAsync(article_id);
    response.send({ article });
  } catch (error) {
    next(error);
  }
};

module.exports.updateVotesForArticleId = async (request, response, next) => {
  const { article_id } = request.params;
  const { body: incObj } = request;
  try {
    const updated = await updateArticleVotesAsync(article_id, incObj.inc_votes);
    response.send({ updatedArticle: updated });
  } catch (error) {
    next(error);
  }
};

module.exports.getArticles = async (request, response, next) => {
  const { query } = request;
  try {
    const articles = await selectAllArticles(
      query[QueryTypes.topic],
      query[QueryTypes.sortBy],
      query[QueryTypes.order]
    );
    response.send({ articles });
  } catch (error) {
    next(error);
  }
};

module.exports.getArticleComments = async (request, response, next) => {
  const { article_id } = request.params;
  try {
    const comments = await selectArticleComments(article_id);
    response.send({ comments: comments });
  } catch (error) {
    next(error);
  }
};

module.exports.addArticleComment = async (request, response, next) => {
  const { article_id } = request.params;
  const { body: commentData } = request;
  try {
    const newComment = await insertArticleComment(article_id, commentData);
    response.status(201).send({ comment: newComment });
  } catch (error) {
    next(error);
  }
};
