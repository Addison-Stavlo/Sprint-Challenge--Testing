const request = require("supertest");
const { server, clearDataSet } = require("./server.js");

// const db = require("../dbConfig");

// // before and after Each or before and after All
afterEach(async () => {
  clearDataSet();
});

describe("server.js", () => {
  it("GET '/' should respond with status 200", async () => {
    let response = await request(server).get("/");

    expect(response.status).toBe(200);
  });
  describe("POST endpoint", () => {
    it("POST success should respond with status 201", async () => {
      let response = await request(server)
        .post("/games")
        .send({ title: "PacMan", genre: "Arcade", releaseYear: "1985" });

      expect(response.status).toBe(201);
    });
    it("POST failure if body missing info gives 422", async () => {
      //missing releaseYear
      let response = await request(server)
        .post("/games")
        .send({ title: "PacMan", genre: "Arcade" });

      expect(response.status).toBe(422);
      //missing genre
      let response2 = await request(server)
        .post("/games")
        .send({ title: "PacMan", releaseYear: "1985" });

      expect(response2.status).toBe(422);
      //missing title
      let response3 = await request(server)
        .post("/games")
        .send({ genre: "Arcade", releaseYear: "1985" });

      expect(response3.status).toBe(422);
    });
    it("POST success should add the item", async () => {
      let requestBody = {
        title: "PacMan",
        genre: "Arcade",
        releaseYear: "1985"
      };
      let response = await request(server)
        .post("/games")
        .send(requestBody);

      requestBody.id = 1; //crap for stretch incrementing ID
      expect(response.body.dataSet.pop()).toEqual(requestBody);
    });
    it("(stretch) POST should check for unique title", async () => {
      let requestBody = {
        title: "PacMan",
        genre: "Arcade",
        releaseYear: "1985"
      };
      await request(server)
        .post("/games")
        .send(requestBody);
      let response = await request(server)
        .post("/games")
        .send(requestBody);
      expect(response.status).toBe(405);
    });
    it("(stretch), ID increments", async () => {
      await request(server)
        .post("/games")
        .send({ title: "PacMan", genre: "Arcade", releaseYear: "1985" });
      let response = await request(server)
        .post("/games")
        .send({ title: "Miss Pacman", genre: "Arcade", releaseYear: "1985" });

      expect(response.body.dataSet.pop().id).toBe(2);
    });
  });
  describe("GET endpoint", () => {
    it("GET returns 200", async () => {
      let response = await request(server).get("/games");

      expect(response.status).toBe(200);
    });
    it("GET returns array", async () => {
      let response = await request(server).get("/games");

      expect(response.body).toEqual([]);
    });
    it("GET returns recently added item", async () => {
      let requestBody = {
        title: "PacMan",
        genre: "Arcade",
        releaseYear: "1985"
      };
      await request(server)
        .post("/games")
        .send(requestBody);
      requestBody.id = 1; //crap for stretch incrementing ID
      let response = await request(server).get("/games");
      expect(response.body).toEqual([requestBody]);
    });
  });
  describe("(stretch) GET by ID", () => {
    it("should get game of requested ID", async () => {
      await request(server)
        .post("/games")
        .send({ title: "PacMan", genre: "Arcade", releaseYear: "1985" });
      await request(server)
        .post("/games")
        .send({ title: "Miss Pacman", genre: "Arcade", releaseYear: "1985" });

      let response = await request(server).get("/games/2");
      expect(response.body.id).toBe(2);
    });
    it("should return 404 for ID that doesnt exist", async () => {
      await request(server)
        .post("/games")
        .send({ title: "PacMan", genre: "Arcade", releaseYear: "1985" });

      let response = await request(server).get("/games/5");

      expect(response.status).toBe(404);
    });
  });
});
