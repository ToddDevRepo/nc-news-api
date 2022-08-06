const { Connection } = require("pg");
const connection = require("../db/connection");
const { unprocessableEntity } = require("../errors");
const { DBTables, Endpoints } = require("../globals");
const { selectArticleById } = require("./articles.model");

module.exports.selectArticleComments = async (articleId) => {
  const articleExistsPending = selectArticleById(articleId);
  const getCommentsPending = connection.query(
    `SELECT *
    FROM ${DBTables.Comments.name}
    WHERE ${DBTables.Comments.Fields.article_id} = $1;`,
    [articleId]
  );
  const result = await Promise.all([getCommentsPending, articleExistsPending]);
  const { rows: comments } = result[0];
  return comments;
};

module.exports.insertArticleComment = async (articleId, commentData) => {
  if (!commentData.username || !commentData.body)
    return Promise.reject(unprocessableEntity);
  const {
    rows: [comment],
  } = await connection.query(
    `INSERT INTO ${DBTables.Comments.name} 
        (${DBTables.Comments.Fields.author}, ${DBTables.Comments.Fields.body}, ${DBTables.Comments.Fields.article_id}) 
        VALUES 
        ($1, $2, $3)
        RETURNING *;`,
    [commentData.username, commentData.body, articleId]
  );
  return comment;
};

module.exports.deleteCommentById = (commentId) => {
  console.log("Delete comment model");
};
