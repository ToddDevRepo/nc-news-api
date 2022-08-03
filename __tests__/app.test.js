const request = require("supertest");
const { app } = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const { Endpoints } = require("../globals");
const testData = require(`../db/data/test-data/index.js`);
const { articleNotFoundError, badRequestError } = require("../errors");

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
  describe("GET", () => {
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
    test("path with valid but non-existent id returns 404 not found", () => {
      return request(app)
        .patch(`${Endpoints.ARTICLES_END}/1000`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual(articleNotFoundError.msg);
        });
    });
    test("path with invalid id returns 400 bad request", () => {
      return request(app)
        .patch(`${Endpoints.ARTICLES_END}/badger`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual(badRequestError.msg);
        });
    });
  });
});
