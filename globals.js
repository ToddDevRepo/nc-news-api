class Endpoints {
  static API_END = '/api';
  static TOPICS_END = `${Endpoints.API_END}/topics`;
  static ARTICLES_END = `${Endpoints.API_END}/articles`;
  static ARTICLES_BY_ID_END = `${Endpoints.ARTICLES_END}/:article_id`;
  static ARTICLE_COMMENTS = `${Endpoints.ARTICLES_BY_ID_END}/comments`;
  static COMMENTS_END = `${Endpoints.API_END}/comments`;
  static COMMENTS_BY_ID_END = `${Endpoints.COMMENTS_END}/:comment_id`;
}

class FilePaths {
  static PROJECT_ROOT = __dirname;
  static ENDPOINTS_JSON = `${FilePaths.PROJECT_ROOT}/endpoints.json`;
}

class QueryTypes {
  static topic = 'topic';
  static sortBy = 'sort_by';
  static order = 'order';
}

class DBTables {
  static Articles = {
    name: 'articles',
    Fields: {
      id: 'article_id',
      author: 'author',
      body: 'body',
      votes: 'votes',
      title: 'title',
      topic: 'topic',
      created_at: 'created_at',
    },
  };
  static Comments = {
    name: 'comments',
    Fields: {
      id: 'comment_id',
      author: 'author',
      article_id: 'article_id',
      body: 'body',
    },
  };
  static Topics = {
    name: 'topics',
  };
}

module.exports.Endpoints = Endpoints;
module.exports.FilePaths = FilePaths;
module.exports.DBTables = DBTables;
module.exports.QueryTypes = QueryTypes;
