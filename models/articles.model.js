const connection = require("../db/connection");
const {
  articleNotFoundError,
  badRequestError,
  unprocessableEntity,
} = require("../errors");
const { DBTables } = require("../globals");
const {
  prefixedArticlesId,
  prefixedArticlesTitle,
  prefixedArticlesTopic,
  prefixedArticlesAuthor,
  prefixedArticlesCreatedAt,
  prefixedArticlesVotes,
} = require("./support/utils");

const gCommentCountField = "comment_count";

module.exports.selectArticleById = async (articleId) => {
  const {
    rows: [article],
  } = await connection.query(
    `SELECT ${DBTables.Articles.name}.*, COUNT(${DBTables.Comments.Fields.id}) AS ${gCommentCountField}
FROM ${DBTables.Articles.name}
RIGHT JOIN ${DBTables.Comments.name} ON ${DBTables.Comments.name}.${DBTables.Comments.Fields.author} = ${DBTables.Articles.name}.${DBTables.Articles.Fields.author}
WHERE ${DBTables.Articles.name}.${DBTables.Articles.Fields.id} = $1
GROUP BY ${DBTables.Articles.name}.${DBTables.Articles.Fields.id};`,
    [articleId]
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

module.exports.selectAllArticles = async () => {
  console.log("Select all articles model");
  const { rows: articles } = await connection.query(
    `SELECT ${prefixedArticlesId()},
      ${prefixedArticlesTitle()},
      ${prefixedArticlesTopic()},
      ${prefixedArticlesAuthor()},
      ${prefixedArticlesCreatedAt()},
       ${prefixedArticlesVotes()},
       CAST(COUNT(${
         DBTables.Comments.Fields.id
       }) AS INT) AS ${gCommentCountField}
    FROM ${DBTables.Articles.name}
    LEFT JOIN ${DBTables.Comments.name} ON ${DBTables.Comments.name}.${
      DBTables.Comments.Fields.article_id
    } = ${DBTables.Articles.name}.${DBTables.Articles.Fields.id}
    GROUP BY ${DBTables.Articles.name}.${DBTables.Articles.Fields.id};`
  );
  console.log(articles);
  return articles;
};
