const express = require('express');
const helmet = require("helmet");

const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/posts", postRouter);
server.use("/api/users", userRouter);

//custom middleware
function logger(req, res, next) {
  const timestamp = Date()

  console.log(`${req.method} to ${req.url} at ${timestamp}\n`);

  next();
}


module.exports = server;
