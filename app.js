const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { Endpoints } = require("./globals");

const app = express();

app.get(Endpoints.TOPICS_END, getTopics);
app.get(Endpoints.ARTICLES_BY_ID_END, getTopics);

module.exports.app = app;
