const { unprocessableEntity, commentNotFoundError } = require('../errors');
const { selectArticleByIdAsync } = require('./articles.model');
const { ArticlesTable } = require('./support/sql/ArticlesTable');
const { CommentsTable } = require('./support/sql/CommentsTable');
const { gSqlQueryHelper } = require('./support/sql/sql-utils');

const gCommentsTable = new CommentsTable(gSqlQueryHelper);

module.exports.selectCommentsForArticleAsync = async (articleId) => {
  const articleExistsPending = selectArticleByIdAsync(articleId);
  const selectCommentsPending =
    gCommentsTable.selectCommentsByArticleId(articleId);

  const result = await Promise.all([
    selectCommentsPending,
    articleExistsPending,
  ]);
  const comments = result[0];
  return comments;
};

module.exports.insertArticleCommentAsync = async (articleId, commentData) => {
  if (!commentData.username || !commentData.body)
    return Promise.reject(unprocessableEntity);
  const comment = await gCommentsTable.insertCommentForArticle(
    articleId,
    commentData
  );
  return comment;
};

module.exports.deleteCommentByIdAsync = async (commentId) => {
  const wasDeleted = await gCommentsTable.deleteCommentByIdAsync(commentId);
  if (!wasDeleted) return Promise.reject(commentNotFoundError);
  return wasDeleted;
};
