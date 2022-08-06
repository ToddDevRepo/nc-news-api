const sorted = require("jest-sorted");
const request = require("supertest");
const { app } = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const { Endpoints, Query, QueryTypes, DBTables } = require("../globals");
const testData = require(`../db/data/test-data/index.js`);
const {
  articleNotFoundError,
  badRequestError,
  unprocessableEntity,
  topicNotFoundError,
  badQueryError,
} = require("../errors");
const { forEach } = require("../db/data/test-data/articles");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return connection.end();
});

describe(Endpoints.TOPICS_END, () => {
  describe("GET", () => {
    test("returns status 200", () => {
      return request(app).get(Endpoints.TOPICS_END).expect(200);
    });
    test("returns expected topics", () => {
      return request(app)
        .get(Endpoints.TOPICS_END)
        .then(({ body }) => {
          expect(body).toEqual({
            topics: [
              {
                description: "The man, the Mitch, the legend",
                slug: "mitch",
              },
              {
                description: "Not dogs",
                slug: "cats",
              },
              {
                description: "what books are made of",
                slug: "paper",
              },
            ],
          });
        });
    });
  });
});

describe(Endpoints.ARTICLES_END, () => {
  describe("GET by id", () => {
    test("article path with valid id returns status 200", () => {
      return request(app).get(`${Endpoints.ARTICLES_END}/2`).expect(200);
    });
    test("path with valid id returns expected article", () => {
      return request(app)
        .get(`${Endpoints.ARTICLES_END}/2`)
        .then(({ body }) => {
          expect(body).toEqual({
            article: {
              article_id: 2,
              title: "Sony Vaio; or, The Laptop",
              topic: "mitch",
              author: "icellusedkars",
              body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
              created_at: "2020-10-16T05:03:00.000Z",
              votes: 0,
              comment_count: 13,
            },
          });
        });
    });
    test("path with valid but non-existent id returns 404 not found", () => {
      return request(app)
        .get(`${Endpoints.ARTICLES_END}/1000`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual(articleNotFoundError.msg);
        });
    });
    test("path with invalid id returns 400 bad request", () => {
      return request(app)
        .get(`${Endpoints.ARTICLES_END}/badger`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual(badRequestError.msg);
        });
    });
  });
  describe("GET all", () => {
    test("get all articles returns all the articles with status 200", async () => {
      const { body } = await request(app)
        .get(Endpoints.ARTICLES_END)
        .expect(200);

      expect(body.articles).toHaveLength(12);
      body.articles.forEach((article, idx) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
      });
    });
    test("correctly sets comment count of each article", async () => {
      const { body } = await request(app).get(Endpoints.ARTICLES_END);

      const article = body.articles.find((article) => article.article_id === 9);
      expect(article.comment_count).toBe(2);
    });
    test("articles returned in descending date order by default", async () => {
      const { body } = await request(app)
        .get(Endpoints.ARTICLES_END)
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.created_at, {
        descending: true,
      });
    });
    test("articles returned in descending date order when desc used", async () => {
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}?${QueryTypes.order}=desc`)
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.created_at, {
        descending: true,
      });
    });
    test("articles returned in ascending date order if you set order to ask", async () => {
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}?${QueryTypes.order}=asc`)
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.created_at, {
        descending: false,
      });
    });
    test("articles returned in descending date order when order is sent in uppercase", async () => {
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}?${QueryTypes.order}=DESC`)
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.created_at, {
        descending: true,
      });
    });
    test("articles returned in ascending date order when order is sent in uppercase", async () => {
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}?${QueryTypes.order}=ASC`)
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.created_at, {
        descending: false,
      });
    });
    test("400 bad query returned when order is nonsense", async () => {
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}?${QueryTypes.order}=badger`)
        .expect(400);

      expect(body.msg).toEqual(badQueryError.msg);
    });
    test("400 bad query returned when sort_by is nonsense", async () => {
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}?${QueryTypes.sortBy}=badger`)
        .expect(400);

      expect(body.msg).toEqual(badQueryError.msg);
    });
    test("articles returned in descending author order when desc used", async () => {
      const { body } = await request(app)
        .get(
          `${Endpoints.ARTICLES_END}?${QueryTypes.sortBy}=${DBTables.Articles.Fields.author}&${QueryTypes.order}=desc`
        )
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.author, {
        descending: true,
      });
    });
    test("articles returned in ascending author order when asc used", async () => {
      const { body } = await request(app)
        .get(
          `${Endpoints.ARTICLES_END}?${QueryTypes.sortBy}=${DBTables.Articles.Fields.author}&${QueryTypes.order}=asc`
        )
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.author, {
        descending: false,
      });
    });
    test("articles returned in descending title order when desc used", async () => {
      const { body } = await request(app)
        .get(
          `${Endpoints.ARTICLES_END}?${QueryTypes.sortBy}=${DBTables.Articles.Fields.title}&${QueryTypes.order}=desc`
        )
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.title, {
        descending: true,
      });
    });
    test("articles returned in ascending title order when asc used", async () => {
      const { body } = await request(app)
        .get(
          `${Endpoints.ARTICLES_END}?${QueryTypes.sortBy}=${DBTables.Articles.Fields.title}&${QueryTypes.order}=asc`
        )
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.title, {
        descending: false,
      });
    });
    test("articles returned in descending votes order when desc used", async () => {
      const { body } = await request(app)
        .get(
          `${Endpoints.ARTICLES_END}?${QueryTypes.sortBy}=${DBTables.Articles.Fields.votes}&${QueryTypes.order}=desc`
        )
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.votes, {
        descending: true,
      });
    });
    test("articles returned in ascending votes order when asc used", async () => {
      const { body } = await request(app)
        .get(
          `${Endpoints.ARTICLES_END}?${QueryTypes.sortBy}=${DBTables.Articles.Fields.votes}&${QueryTypes.order}=asc`
        )
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.votes, {
        descending: false,
      });
    });
    test("articles returned in descending topics order when desc used", async () => {
      const { body } = await request(app)
        .get(
          `${Endpoints.ARTICLES_END}?${QueryTypes.sortBy}=${DBTables.Articles.Fields.topic}&${QueryTypes.order}=desc`
        )
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.topic, {
        descending: true,
      });
    });
    test("articles returned in ascending topics order when asc used", async () => {
      const { body } = await request(app)
        .get(
          `${Endpoints.ARTICLES_END}?${QueryTypes.sortBy}=${DBTables.Articles.Fields.topic}&${QueryTypes.order}=asc`
        )
        .expect(200);

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.topic, {
        descending: false,
      });
    });
    test("search by topic returns correct number of articles on given topic", async () => {
      const query = "mitch";
      const { body } = await request(app).get(
        `${Endpoints.ARTICLES_END}?${QueryTypes.topic}=${query}`
      );

      expect(body.articles).toHaveLength(11);
      body.articles.forEach((article) => {
        expect(article.topic).toBe(query);
      });
    });
    test("search by topic returns articles in descending date order by default", async () => {
      const query = "mitch";
      const { body } = await request(app).get(
        `${Endpoints.ARTICLES_END}?${QueryTypes.topic}=${query}`
      );

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.created_at, {
        descending: true,
      });
    });
    test("search by topic returns articles in descending votes order when sorted by desc", async () => {
      const query = "mitch";
      const { body } = await request(app).get(
        `${Endpoints.ARTICLES_END}?${QueryTypes.topic}=${query}&${QueryTypes.sortBy}=${DBTables.Articles.Fields.votes}&${QueryTypes.order}=desc`
      );

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.votes, {
        descending: true,
      });
    });
    test("search by topic returns articles in ascending votes order when sorted by asc", async () => {
      const query = "mitch";
      const { body } = await request(app).get(
        `${Endpoints.ARTICLES_END}?${QueryTypes.topic}=${query}&${QueryTypes.sortBy}=${DBTables.Articles.Fields.votes}&${QueryTypes.order}=asc`
      );

      expect(body.articles).toBeSortedBy(DBTables.Articles.Fields.votes, {
        descending: false,
      });
    });
    test("non-existent topic returns empty array", async () => {
      const query = "d; sdf";
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}?${QueryTypes.topic}=${query}`)
        .expect(200);

      expect(body.articles).toHaveLength(0);
    });
    test("non-existent category returns articles", async () => {
      const query = "mitch";
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}?${"; sdhfk"}=${query}`)
        .expect(200);

      expect(body.articles).toHaveLength(12);
    });
  });
  describe("GET article comments", () => {
    test("get comments returns comments for given article", async () => {
      const articleId = 9;
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}/${articleId}/comments`)
        .expect(200);

      expect(body.comments).toHaveLength(2);
      body.comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          })
        );
      });
    });
    test("get comments returns empty array for article with no comments", async () => {
      const articleId = 2;
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}/${articleId}/comments`)
        .expect(200);

      expect(body.comments).toHaveLength(0);
    });
    test("get comments returns 400 bad request if article id is junk", async () => {
      const articleId = "badger";
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}/${articleId}/comments`)
        .expect(400);

      expect(body.msg).toBe(badRequestError.msg);
    });
    test("get comments returns 404 article not found if article does not exist", async () => {
      const articleId = 9000;
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}/${articleId}/comments`)
        .expect(404);

      expect(body.msg).toBe(articleNotFoundError.msg);
    });
  });
  describe("PATCH", () => {
    test("returns with status 200 and an article with incremented votes", async () => {
      const incBy = 123;

      const { body } = await request(app)
        .patch(`${Endpoints.ARTICLES_END}/2`)
        .send({ inc_votes: incBy })
        .expect(200);

      const expected = {
        article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: "2020-10-16T05:03:00.000Z",
        votes: 123,
      };
      expect(body).toEqual({ updatedArticle: expected });
    });
    test("returns with status 200 and an article with decremented votes", async () => {
      const incBy = -5;

      const { body } = await request(app)
        .patch(`${Endpoints.ARTICLES_END}/2`)
        .send({ inc_votes: incBy })
        .expect(200);

      const expected = {
        article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: "2020-10-16T05:03:00.000Z",
        votes: -5,
      };
      expect(body).toEqual({ updatedArticle: expected });
    });
    test("returns with status 422 (unprocessable entity) when there is no send body", async () => {
      const { body } = await request(app)
        .patch(`${Endpoints.ARTICLES_END}/2`)
        .send()
        .expect(422);

      expect(body.msg).toEqual(unprocessableEntity.msg);
    });
    test("returns with status 422 (unprocessable entity) when increment is not number", async () => {
      const { body } = await request(app)
        .patch(`${Endpoints.ARTICLES_END}/2`)
        .send({ inc_votes: "badger" })
        .expect(422);

      expect(body.msg).toEqual(unprocessableEntity.msg);
    });
    test("path with valid but non-existent id returns 404 not found", () => {
      return request(app)
        .patch(`${Endpoints.ARTICLES_END}/1000`)
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual(articleNotFoundError.msg);
        });
    });
    test("path with invalid id returns 400 bad request", () => {
      return request(app)
        .patch(`${Endpoints.ARTICLES_END}/badger`)
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual(badRequestError.msg);
        });
    });
  });
  describe("POST", () => {
    describe("Add comment to articlel", () => {
      test("returns status 201 and the inserted comment.", async () => {
        const articleId = 9;
        const input = { username: "rogersop", body: "some body" };

        const { body } = await request(app)
          .post(`${Endpoints.ARTICLES_END}/${articleId}/comments`)
          .send(input)
          .expect(201);

        expect(body.comment).toEqual({
          comment_id: 19,
          body: input.body,
          votes: 0,
          author: input.username,
          article_id: articleId,
          created_at: expect.any(String),
        });
      });
      test("return status 422 unprocessable entity if username does not exist in users table", async () => {
        const articleId = 9;
        const input = { username: "badger", body: "some body" };

        const { body } = await request(app)
          .post(`${Endpoints.ARTICLES_END}/${articleId}/comments`)
          .send(input)
          .expect(422);

        expect(body.msg).toBe(unprocessableEntity.msg);
      });
      test("return status 422 unprocessable entity if article id does not exist", async () => {
        const articleId = 90000;
        const input = { username: "rogersop", body: "some body" };

        const { body } = await request(app)
          .post(`${Endpoints.ARTICLES_END}/${articleId}/comments`)
          .send(input)
          .expect(422);

        expect(body.msg).toBe(unprocessableEntity.msg);
      });
      test("return status 422 unprocessable entity if body not present", async () => {
        const articleId = 9;
        const input = { username: "rogersop" };

        const { body } = await request(app)
          .post(`${Endpoints.ARTICLES_END}/${articleId}/comments`)
          .send(input)
          .expect(422);

        expect(body.msg).toBe(unprocessableEntity.msg);
      });
      test("return status 400 bad request if article id not a number", async () => {
        const articleId = "badger";
        const input = { username: "rogersop", body: "some stuff" };

        const { body } = await request(app)
          .post(`${Endpoints.ARTICLES_END}/${articleId}/comments`)
          .send(input)
          .expect(400);

        expect(body.msg).toBe(badRequestError.msg);
      });
      test("return status 422 unprocessable entity if username not present", async () => {
        const articleId = 9;
        const input = { body: "some body" };

        const { body } = await request(app)
          .post(`${Endpoints.ARTICLES_END}/${articleId}/comments`)
          .send(input)
          .expect(422);

        expect(body.msg).toBe(unprocessableEntity.msg);
      });
    });
  });
});

describe(Endpoints.COMMENTS_END, () => {
  describe("DELETE comment", () => {
    test("successful delete return status 204 No Content", async () => {
      const commentId = 1;
      await request(app)
        .delete(`${Endpoints.COMMENTS_END}/${commentId}`)
        .expect(204);
    });
    test("successful delete deletes selected comment", async () => {
      const commentId = 1;
      let commentExists = await commentWithIdExists(commentId);

      expect(commentExists).toBe(true);

      await request(app).delete(`${Endpoints.COMMENTS_END}/${commentId}`);

      commentExists = await commentWithIdExists(commentId);
      expect(commentExists).toBe(false);
    });
    test("returns bad request if comment id is junk", async () => {
      const commentId = "badger";

      const { body } = await request(app)
        .delete(`${Endpoints.COMMENTS_END}/${commentId}`)
        .expect(400);

      expect(body.msg).toBe(badRequestError.msg);
    });
  });
});

async function commentWithIdExists(commentId) {
  const result = await connection.query(`SELECT * FROM ${DBTables.Comments.name}
  WHERE ${DBTables.Comments.Fields.id} = ${commentId}`);
  return result.rows.length === 1;
}
