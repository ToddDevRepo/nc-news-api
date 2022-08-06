const { json } = require("express");
const { readEndpoints } = require("../models/api.model");

module.exports.getEndpoints = async (request, response, next) => {
  console.log("Endpoints controller");
  try {
    const json = await readEndpoints();
    console.log(json);
    response.send(json);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
