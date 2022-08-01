const request = require("supertest");
const { app } = require("../app");
const { Endpoints } = require("../globals");

describe(Endpoints.TOPICS_END, () => {
  describe("GET", () => {
    test("returns status 200", () => {
      return request(app).get(Endpoints.TOPICS_END).expect(200);
    });
  });
});
