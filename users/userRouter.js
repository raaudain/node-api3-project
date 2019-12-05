const express = require('express');
const Users = require("./userDb")
const Posts = require("../posts/postDb")

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  const add = req.body;
  Users
    .insert(add)
    .then(usr => {
      res.status(201).json(usr)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json()
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const id = req.params.id;
  const post = req.body;
  
  console.log(post)
  
  Users
    .getUserPosts(id)
    .then(() => {
      console.log(post.text)
      Posts
        .insert({user_id: id, text: post.text})
        .then(() => {
          res.status(201).json(post)
        })
        .catch(err => {
          console.log(err)
          res.status(500).json()
        })

    })
    .catch(err => {
      console.log(err)
      res.status(500).json()
    })
});

router.get('/', (req, res) => {
  // do your magic!
  
  Users
    .get()
    .then(user => {
      //console.log(user)
      console.log(Users.getById())
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json()
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;

  Users
    .getById(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json()
    })
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
  const id = req.params.id

  Users
    .getUserPosts(id)
    .then(user => {
      //console.log(user)
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json()
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;

  Users
    .remove(id)
    .then(user => {
      res.status(200).json({message: "User removed", user})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json()
    })
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  const user = req.body;

  Users
    .getById(id)
    .then(usr => {
      console.log(usr)
      Users
        .update(id, user)
        .then(() => {
          res.status(200).json({message: "Post updated", user})
        })
        .catch(err => {
          console.log(err)
          res.status(500).json()
        })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json()
    })
});

//custom middleware

function validateUserId(req, res, next) {
 
  // do your magic!
  const id = req.params.id;

  Users
    .getById(id)
    .then(user => {
      if(!user){
        //console.log(user.id)
        console.log("invalid user id")
        res.status(400).json({message: "invalid user id"})
      }
      else{
        //console.log(user.name)
        const usr = req.user
        //console.log("req.user", usr);
        next();
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json()
    })
}

function validateUser(req, res, next) {
  // do your magic!

  const body = req.body;

  if(Object.keys(body).length === 0){
    console.log(body)
    res.status(400).json({message: "missing user data"})
  }
  else if(body && !body.name){
          //console.log(body, body.name)
          res.status(400).json({message: "missing required name field"});
  }
  else{
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  const body = req.body;
  console.log("valid", body)
  
  if(body && Object.keys(body).length === 0){
    res.status(400).json({message: "missing post data"});
  }
  else if(body && !body.text){
    res.status(400).json({message: "missing required text field"});
  }
  else{
    next();
  }
}

module.exports = router;
