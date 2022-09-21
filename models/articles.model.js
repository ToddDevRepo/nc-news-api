const connection = require("../db/connection");
const {
  articleNotFoundError,
  badRequestError,
  unprocessableEntity,
  topicNotFoundError,
  badQueryError,
} = require("../errors");
const { DBTables, QueryTypes } = require("../globals");
const {
  ArticlesSortBySanitiser,
} = require("./support/articles-sort-by-sanitiser");
const { SqlSanitiser, SortBySanitiser } = require("./support/sql-sanitiser");
const { ArticlesTable } = require("./support/sql/ArticlesTable");
const { CommentsTable } = require("./support/sql/CommentsTable");
const { gSqlQueryHelper } = require("./support/sql/sql-utils");
const {
  prefixedArticlesId,
  prefixedArticlesTitle,
  prefixedArticlesTopic,
  prefixedArticlesAuthor,
  prefixedArticlesCreatedAt,
  prefixedArticlesVotes,
  prefixedCommentsArticleId,
} = require("./support/utils");

const gCommentCountField = "comment_count";

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
  sortBy = "date",
  order = "desc"
) => {
  const sanitiser = new ArticlesSortBySanitiser();
  sortBy = sanitiser.lookupSortBy(sortBy);
  if (!sortBy || !sanitiser.isValidOrder(order))
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
