const { unprocessableEntity } = require("../errors");
const { Query: QueryArgs, QueryTypes } = require("../globals");
const {
  selectArticleByIdAsync: selectArticleByIdAsync,
  selectAllArticlesAsync,
  updateArticleVotesAsync,
} = require("../models/articles.model");
const {
  insertArticleComment,
  selectCommentsForArticleAsync,
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

module.exports.updateVotesForArticleIdAsync = async (
  request,
  response,
  next
) => {
  const { article_id } = request.params;
  const { body: incObj } = request;
  try {
    const updated = await updateArticleVotesAsync(article_id, incObj.inc_votes);
    response.send({ updatedArticle: updated });
  } catch (error) {
    next(error);
  }
};

module.exports.getArticlesAsync = async (request, response, next) => {
  const { query } = request;
  try {
    const articles = await selectAllArticlesAsync(
      query[QueryTypes.topic],
      query[QueryTypes.sortBy],
      query[QueryTypes.order]
    );
    response.send({ articles });
  } catch (error) {
    next(error);
  }
};

module.exports.getArticleCommentsAsync = async (request, response, next) => {
  const { article_id } = request.params;
  try {
    const comments = await selectCommentsForArticleAsync(article_id);
    response.send({ comments: comments });
  } catch (error) {
    next(error);
  }
};

module.exports.addArticleCommentAsync = async (request, response, next) => {
  const { article_id } = request.params;
  const { body: commentData } = request;
  try {
    const newComment = await insertArticleComment(article_id, commentData);
    response.status(201).send({ comment: newComment });
  } catch (error) {
    next(error);
  }
};
