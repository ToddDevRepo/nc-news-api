const { response } = require("express");

module.exports.getTopics = (request, response) => {
  console.log("Controller get topics");
  response.send();
};
