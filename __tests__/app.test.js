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
    test("allows search by topic", async () => {
      const query = "mitch";
      const { body } = await request(app).get(
        `${Endpoints.ARTICLES_END}?${QueryTypes.topic}=${query}`
      );

      expect(body.articles).toHaveLength(11);
      body.articles.forEach((article) => {
        expect(article.topic).toBe(query);
      });
    });
    test("non-existent topic returns empty array", async () => {
      const query = "d; sdf";
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}?${QueryTypes.topic}=${query}`)
        .expect(200);

      expect(body.articles).toHaveLength(0);
    });
    test("bad query category is ignored", async () => {
      const query = "mitch";
      const { body } = await request(app)
        .get(`${Endpoints.ARTICLES_END}?${"; sdhfk"}=${query}`)
        .expect(200);

      expect(body.articles).toHaveLength(12);
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
});
