const { deleteCommentByIdAsync } = require("../models/comments.model");

module.exports.RemoveCommentByIdAsync = async (request, response, next) => {
  const { comment_id } = request.params;
  try {
    await deleteCommentByIdAsync(comment_id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
