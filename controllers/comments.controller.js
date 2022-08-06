const { deleteCommentById } = require("../models/comments.model");

module.exports.RemoveCommentById = async (request, response, next) => {
  console.log("Comments controller");
  const { comment_id } = request.params;
  try {
    await deleteCommentById(comment_id);
    response.status(204).send();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
