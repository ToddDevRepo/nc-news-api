const { response } = require("express");
const { selectAllTopics } = require("../models/topics.model");

module.exports.getTopics = (request, response) => {
  selectAllTopics().then(({ rows: topics }) => {
    response.send({ topics });
  });
};
