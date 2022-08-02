const request = require("supertest");
const { app } = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const { Endpoints } = require("../globals");
const testData = require(`../db/data/test-data/index.js`);

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
