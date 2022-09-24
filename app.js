const cors = require("cors");
const express = require("express");
const {
  getEndpointsAsync: getEndpointsAsync,
} = require("./controllers/api.controller");
const {
  getArticleByIdAsync: getArticleByIdAsync,
  updateVotesForArticleIdAsync,
  getArticlesAsync,
  getArticleCommentsAsync,
  addArticleCommentAsync,
} = require("./controllers/articles.controller");
const { RemoveCommentByIdAsync } = require("./controllers/comments.controller");
const { getTopicsAsync } = require("./controllers/topics.controller");
const { badRequestError, unprocessableEntity } = require("./errors");
const { Endpoints } = require("./globals");

const app = express();

app.use(cors());
app.use(express.json());

app.get(Endpoints.API_END, getEndpointsAsync);

app.get(Endpoints.TOPICS_END, getTopicsAsync);
app.get(Endpoints.ARTICLES_END, getArticlesAsync);

app.get(Endpoints.ARTICLES_BY_ID_END, getArticleByIdAsync);
app.patch(Endpoints.ARTICLES_BY_ID_END, updateVotesForArticleIdAsync);

app.get(Endpoints.ARTICLE_COMMENTS, getArticleCommentsAsync);
app.post(Endpoints.ARTICLE_COMMENTS, addArticleCommentAsync);

app.delete(Endpoints.COMMENTS_BY_ID_END, RemoveCommentByIdAsync);

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
