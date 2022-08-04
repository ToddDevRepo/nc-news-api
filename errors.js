module.exports.articleNotFoundError = {
  status: 404,
  msg: "No article was found with the given id.",
};

module.exports.badRequestError = {
  status: 400,
  msg: "Bad request!",
};

module.exports.unprocessableEntity = {
  status: 422,
  msg: "Could not process send data!",
};
