const express = require("express");

const server = express();

server.use(express.json());

var dataSet = [];

function checkBody(req, res, next) {
  let game = req.body;
  if (game.title && game.genre && game.releaseYear) {
    next();
  } else {
    res.status(422).json({
      message:
        "incomplete request: please provide title, genre, and releaseYear"
    });
  }
}

server.get("/", async (req, res) => {
  res.status(200).send("hi there");
});

server.post("/games", checkBody, (req, res) => {
  dataSet.push(req.body);
  res.status(201).json({ dataSet });
});

module.exports = server;
