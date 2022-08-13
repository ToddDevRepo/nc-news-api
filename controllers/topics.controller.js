const { response } = require("express");
const { selectAllTopics } = require("../models/topics.model");

module.exports.getTopics = async (request, response) => {
  const topics = await selectAllTopics();
  response.send({ topics });
};
