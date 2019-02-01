const request = require("supertest");
const { server, clearDataSet } = require("./server.js");

// const db = require("../dbConfig");

// // before and after Each or before and after All
afterEach(async () => {
  clearDataSet();
});

describe("server.js", () => {
  it("GET should respond with status 200", async () => {
    let response = await request(server).get("/");

    expect(response.status).toBe(200);
  });
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
    let requestBody = { title: "PacMan", genre: "Arcade", releaseYear: "1985" };
    let response = await request(server)
      .post("/games")
      .send(requestBody);

    expect(response.body.dataSet.pop()).toEqual(requestBody);
  });
  it("GET returns 200", async () => {
    let response = await request(server).get("/games");

    expect(response.status).toBe(200);
  });
  it("GET returns array", async () => {
    let response = await request(server).get("/games");

    expect(response.body).toEqual([]);
  });
  it("GET returns recently added item", async () => {
    let requestBody = { title: "PacMan", genre: "Arcade", releaseYear: "1985" };
    await request(server)
      .post("/games")
      .send(requestBody);

    let response = await request(server).get("/games");
    expect(response.body).toEqual([requestBody]);
  });
  //   it("POST should return number representing id", async () => {
  //     let response = await request(server)
  //       .post("/")
  //       .send({ name: "Lumber" });

  //     expect(typeof response.body).toBe("number");
  //   });
  //   it("DELETE should respond with status 200", async () => {
  //     await request(server)
  //       .post("/")
  //       .send({ name: "Lumber" });
  //     let response = await request(server)
  //       .delete("/")
  //       .send({ name: "Lumber" });
  //     expect(response.status).toBe(200);
  //   });
  //   it("DELETE should remove 1 resource", async () => {
  //     await request(server)
  //       .post("/")
  //       .send({ name: "Lumber" });
  //     let response = await request(server)
  //       .delete("/")
  //       .send({ name: "Lumber" });
  //     expect(response.body).toBe(1);
  //   });
});
