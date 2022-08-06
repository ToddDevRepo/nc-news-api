const { deleteCommentById } = require("../models/comments.model");

module.exports.RemoveCommentById = async (request, response, next) => {
  const { comment_id } = request.params;
  try {
    await deleteCommentById(comment_id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
