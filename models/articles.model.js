const {
  articleNotFoundError,
  badRequestError,
  unprocessableEntity,
  topicNotFoundError,
  badQueryError,
} = require('../errors');
const { ArticlesTable } = require('./support/sql/ArticlesTable');
const { CommentsTable } = require('./support/sql/CommentsTable');
const { gSqlQueryHelper } = require('./support/sql/sql-utils');

const gArticlesTable = new ArticlesTable(gSqlQueryHelper);

module.exports.selectArticleByIdAsync = async (articleId) => {
  const commentsTable = new CommentsTable(gSqlQueryHelper);
  const article = await gArticlesTable.getArticleByIdWithCommentCountAsync(
    articleId,
    commentsTable
  );

  if (!article) return Promise.reject(articleNotFoundError);
  return article;
};

module.exports.incrementArticleVotesByAsync = async (
  article_id,
  numberOfVotes
) => {
  if (isNaN(numberOfVotes)) return Promise.reject(unprocessableEntity);
  const wasUpdated = await gArticlesTable.incrementArticleVotesAsync(
    article_id,
    numberOfVotes
  );

  if (!wasUpdated) return Promise.reject(articleNotFoundError);
  return wasUpdated;
};

module.exports.selectAllArticlesAsync = async (
  topic,
  sortByField = 'date',
  order = 'desc'
) => {
  sortByField = gArticlesTable.sortSanitizer.sanitiseSortByField(sortByField);
  if (!sortByField || !gArticlesTable.sortSanitizer.isValidOrder(order))
    return Promise.reject(badQueryError);
  const commentsTable = new CommentsTable(gSqlQueryHelper);
  const articles = await gArticlesTable.selectSortedArticlesByFilterAsync(
    topic,
    sortByField,
    order,
    commentsTable
  );
  return articles;
};
