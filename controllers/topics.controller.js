const { response } = require("express");
const {
  selectAllTopicsAsync: selectAllTopicsAsync,
} = require("../models/topics.model");

module.exports.getTopicsAsync = async (request, response) => {
  const topics = await selectAllTopicsAsync();
  response.send({ topics });
};
