class Endpoints {
  static API_END = "/api";
  static TOPICS_END = `${Endpoints.API_END}/topics`;
  static ARTICLES_END = `${Endpoints.API_END}/articles`;
  static ARTICLES_BY_ID_END = `${Endpoints.ARTICLES_END}/:article_id`;
}

module.exports.Endpoints = Endpoints;
