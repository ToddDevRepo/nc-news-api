const connection = require("../db/connection");
const { articleNotFoundError } = require("../errors");

const gTableName = "articles";

const gArticlesTable = "articles";
const gArticlesIdField = "article_id";
const gArticlesAuthorField = "author";
const gArticlesCommentCountField = "comment_count";

const gCommentsTable = "comments";
const gCommentsAuthorField = "author";

module.exports.selectArticleById = async (articleId) => {
  const {
    rows: [article],
  } = await connection.query(
    `SELECT ${gArticlesTable}.*, COUNT(comment_id) AS ${gArticlesCommentCountField}
FROM ${gArticlesTable}
RIGHT JOIN ${gCommentsTable} ON ${gCommentsTable}.${gCommentsAuthorField} = ${gArticlesTable}.${gArticlesAuthorField}
WHERE ${gArticlesTable}.${gArticlesIdField} = $1
GROUP BY ${gArticlesTable}.${gArticlesIdField};`,
    [articleId]
  );

  if (!article) return Promise.reject(articleNotFoundError);
  return article;
};
