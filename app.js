const express = require("express");
const { getArticleById } = require("./controllers/articles.controller");
const { getTopics } = require("./controllers/topics.controller");
const { Endpoints } = require("./globals");

const app = express();

app.get(Endpoints.TOPICS_END, getTopics);
app.get(Endpoints.ARTICLES_BY_ID_END, getArticleById);

//// Error Handling ///
app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send(err);
  else next(err);
});

module.exports.app = app;
