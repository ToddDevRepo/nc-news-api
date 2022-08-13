const { json } = require("express");
const {
  readEndpointsAsync: readEndpointsAsync,
} = require("../models/api.model");

module.exports.getEndpointsAsync = async (request, response, next) => {
  try {
    const json = await readEndpointsAsync();
    response.send(json);
  } catch (error) {
    next(error);
  }
};
