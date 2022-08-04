class Endpoints {
  static API_END = "/api";
  static TOPICS_END = `${Endpoints.API_END}/topics`;
  static ARTICLES_END = `${Endpoints.API_END}/articles`;
  static ARTICLES_BY_ID_END = `${Endpoints.ARTICLES_END}/:article_id`;
}

class QueryTypes {
  static topic = "topic";
  static sortBy = "sort_by";
  static order = "order";
}

class DBTables {
  static Articles = {
    name: "articles",
    Fields: {
      id: "article_id",
      author: "author",
      body: "body",
      votes: "votes",
      title: "title",
      topic: "topic",
      created_at: "created_at",
    },
  };
  static Comments = {
    name: "comments",
    Fields: {
      id: "comment_id",
      author: "author",
      article_id: "article_id",
    },
  };
  static Topics = {
    name: "topics",
  };
}

module.exports.Endpoints = Endpoints;
module.exports.DBTables = DBTables;
module.exports.QueryTypes = QueryTypes;
