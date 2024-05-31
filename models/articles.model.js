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

module.exports.updateArticleVotesAsync = async (article_id, incVotes) => {
  if (isNaN(incVotes)) return Promise.reject(unprocessableEntity);
  const updated = await gArticlesTable.updateArticleVotesAsync(
    article_id,
    incVotes
  );

  if (!updated) return Promise.reject(articleNotFoundError);
  return updated;
};

module.exports.selectAllArticlesAsync = async (
  topic,
  sortBy = 'date',
  order = 'desc'
) => {
  sortBy = gArticlesTable.sortSanitizer.sanitiseSortByField(sortBy);
  if (!sortBy || !gArticlesTable.sortSanitizer.isValidOrder(order))
    return Promise.reject(badQueryError);
  const commentsTable = new CommentsTable(gSqlQueryHelper);
  const articles = await gArticlesTable.selectSortedArticlesByFilterAsync(
    topic,
    sortBy,
    order,
    commentsTable
  );
  return articles;
};
