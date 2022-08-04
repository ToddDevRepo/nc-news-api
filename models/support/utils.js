const { DBTables } = require("../../globals");

module.exports.prefixedArticlesId = () => {
  return `${DBTables.Articles.name}.${DBTables.Articles.Fields.id}`;
};

module.exports.prefixedArticlesTopic = () => {
  return `${DBTables.Articles.name}.${DBTables.Articles.Fields.topic}`;
};

module.exports.prefixedArticlesTitle = () => {
  return `${DBTables.Articles.name}.${DBTables.Articles.Fields.title}`;
};

module.exports.prefixedArticlesAuthor = () => {
  return `${DBTables.Articles.name}.${DBTables.Articles.Fields.author}`;
};

module.exports.prefixedArticlesCreatedAt = () => {
  return `${DBTables.Articles.name}.${DBTables.Articles.Fields.created_at}`;
};

module.exports.prefixedArticlesVotes = () => {
  return `${DBTables.Articles.name}.${DBTables.Articles.Fields.votes}`;
};

module.exports.prefixedCommentsArticleId = () => {
  return `${DBTables.Comments.name} ON ${DBTables.Comments.name}.${DBTables.Comments.Fields.article_id}`;
};
