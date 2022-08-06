const { json } = require("express");
const { readEndpoints } = require("../models/api.model");

module.exports.getEndpoints = async (request, response, next) => {
  try {
    const json = await readEndpoints();
    response.send(json);
  } catch (error) {
    next(error);
  }
};
