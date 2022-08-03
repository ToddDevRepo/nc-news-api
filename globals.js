class Endpoints {
  static API_END = "/api";
  static TOPICS_END = `${Endpoints.API_END}/topics`;
  static ARTICLES_END = `${Endpoints.API_END}/articles`;
  static ARTICLES_BY_ID_END = `${Endpoints.ARTICLES_END}/:article_id`;
}

class DBTables {
  static Articles = {
    name: "articles",
    Fields: {
      id: "article_id",
      author: "author",
    },
  };
  static Comments = {
    name: "comments",
    Fields: {
      id: "comment_id",
      author: "author",
    },
  };
}

module.exports.Endpoints = Endpoints;
module.exports.DBTables = DBTables;
