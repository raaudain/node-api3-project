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

function validateUserId(req, res, next){
  const userId = req.params.id

  if(userId){
    next()
  }
  else{
    res.status(400).json({message: "invalid user id"}).send("Invalid user id");
  }
  
}

function validateUser(req, res, next){
  const body = req.body;

  if(!body){
    res.status(400).json({message: "missing user data"}).send("missing user data");
  }
  else if(body && !body.name){
    res.status(400).json({message: "missing required name field"});
  }
  else{
    next();
  }
}

function validatePost(req, res, next){
  const body = req.body;

  if(!body){
    res.status(400).json({message: "missing post data"});
  }
  else if(body && !body.text){
    res.status(400).json({message: "missing required text field"});
  }
}

module.exports = server;
