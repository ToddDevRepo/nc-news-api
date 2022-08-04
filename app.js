const express = require("express");
const {
  getArticleById,
  updateVotesForArticleId: patchArticleById,
} = require("./controllers/articles.controller");
const { getTopics } = require("./controllers/topics.controller");
const { badRequestError } = require("./errors");
const { Endpoints } = require("./globals");

const app = express();

app.use(express.json());

app.get(Endpoints.TOPICS_END, getTopics);
app.get(Endpoints.ARTICLES_BY_ID_END, getArticleById);
app.patch(Endpoints.ARTICLES_BY_ID_END, patchArticleById);

//// Error Handling ///
app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else if (err.code === "22P02")
    res.status(400).send({ msg: badRequestError.msg });
  else next(err);
});

module.exports.app = app;
