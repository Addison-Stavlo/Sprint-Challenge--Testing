const express = require("express");
const server = express();
server.use(express.json());

//mach database array, clear function to export for testing
var dataSet = [];
function clearDataSet() {
  dataSet = [];
}
// defined middleware for routes
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

function validateUniqueTitle(req, res, next) {
  let game = req.body;
  for (let i = 0; i < dataSet.length; i++) {
    if (dataSet[i].title === game.title) {
      res.status(405).json({ message: "title already exists" });
    }
  }
  next();
}
//routes
server.get("/", async (req, res) => {
  res.status(200).send("hi there");
});

server.post("/games", checkBody, validateUniqueTitle, (req, res) => {
  dataSet.push(req.body);
  res.status(201).json({ dataSet });
});

server.get("/games", (req, res) => {
  res.status(200).json(dataSet);
});

module.exports = { server, clearDataSet };
