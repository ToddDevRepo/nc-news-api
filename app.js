const express = require("express");
const { getEndpoints } = require("./controllers/api.controller");
const {
  getArticleById,
  updateVotesForArticleId: patchArticleById,
  getArticles,
  getArticleComments,
  addArticleComment,
} = require("./controllers/articles.controller");
const { RemoveCommentById } = require("./controllers/comments.controller");
const { getTopics } = require("./controllers/topics.controller");
const { badRequestError, unprocessableEntity } = require("./errors");
const { Endpoints } = require("./globals");

const app = express();

app.use(express.json());

app.get(Endpoints.API_END, getEndpoints);

app.get(Endpoints.TOPICS_END, getTopics);
app.get(Endpoints.ARTICLES_END, getArticles);

app.get(Endpoints.ARTICLES_BY_ID_END, getArticleById);
app.patch(Endpoints.ARTICLES_BY_ID_END, patchArticleById);

app.get(Endpoints.ARTICLE_COMMENTS, getArticleComments);
app.post(Endpoints.ARTICLE_COMMENTS, addArticleComment);

app.delete(Endpoints.COMMENTS_BY_ID_END, RemoveCommentById);

//// Error Handling ///
app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else if (err.code === "22P02")
    res.status(400).send({ msg: badRequestError.msg });
  else if (err.code === "23503")
    res.status(422).send({ msg: unprocessableEntity.msg });
  else next(err);
});

module.exports.app = app;
