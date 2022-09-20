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

module.exports.selectArticleByIdAsync = async (articleId) => {
  const commentsTable = new CommentsTable(gSqlQueryHelper);
  const articlesTable = new ArticlesTable(gSqlQueryHelper);
  const article = await articlesTable.getArticleByIdWithCommentCountAsync(
    articleId,
    commentsTable
  );

  if (!article) return Promise.reject(articleNotFoundError);
  article[gCommentCountField] = parseInt(article[gCommentCountField]);
  return article;
};

module.exports.updateArticleVotes = async (article_id, incVotes) => {
  if (isNaN(incVotes)) return Promise.reject(unprocessableEntity);
  const {
    rows: [result],
  } = await connection.query(
    `UPDATE ${DBTables.Articles.name}
    SET ${DBTables.Articles.Fields.votes} = votes + $1
    WHERE ${DBTables.Articles.Fields.id} = $2 RETURNING *;`,
    [incVotes, article_id]
  );
  if (!result) return Promise.reject(articleNotFoundError);
  return result;
};

module.exports.selectAllArticles = async (
  topic,
  sortBy = "date",
  order = "desc"
) => {
  const sanitiser = new ArticlesSortBySanitiser();
  sortBy = sanitiser.lookupSortBy(sortBy);
  if (!sortBy || !sanitiser.isValidOrder(order))
    return Promise.reject(badQueryError);
  const sqlQuery = defineGetAllArticlesQuery(topic, sortBy, order);
  const { rows: articles } = await connection.query(
    sqlQuery.str,
    sqlQuery.args
  );
  return articles;
};
function defineGetAllArticlesQuery(topic, sortBy, order) {
  const queryArgs = [];
  let queryStr = `SELECT ${prefixedArticlesId()},
      ${prefixedArticlesTitle()},
      ${prefixedArticlesTopic()},
      ${prefixedArticlesAuthor()},
      ${prefixedArticlesCreatedAt()},
       ${prefixedArticlesVotes()},
       CAST(COUNT(${
         DBTables.Comments.Fields.id
       }) AS INT) AS ${gCommentCountField}
    FROM ${DBTables.Articles.name}
    LEFT JOIN ${prefixedCommentsArticleId()} = ${prefixedArticlesId()}`;
  if (topic) {
    queryStr += ` WHERE ${QueryTypes.topic} = $1`;
    queryArgs.push(topic);
  }
  queryStr += ` GROUP BY ${prefixedArticlesId()}`;
  if (sortBy && order) queryStr += ` ORDER BY ${sortBy} ${order}`;
  queryStr += ";";
  return { str: queryStr, args: queryArgs };
}
