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
      res.status(500).json({error: "Server could not be reached."})
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const id = req.user.id;
  const post = req.body;
  
  console.log(req)
  
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
          res.status(500).json({error: "Server could not be reached."})
        })

    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "Server could not be reached."})
    })
});

router.get('/', (req, res) => {
  // do your magic!
  
  Users
    .get()
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "Server could not be reached."})
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.user.id;
  //console.log(req)
  Users
    .getById(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "Server could not be reached."})
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const id = req.user.id;

  Users
    .getUserPosts(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "Server could not be reached."})
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.user.id;

  Users
    .remove(id)
    .then(user => {
      res.status(200).json({message: "User removed", user})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "Server could not be reached."})
    })
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.user.id;
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
          res.status(500).json({error: "Server could not be reached."})
        })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "Server could not be reached."})
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
        console.log("invalid user id")
        res.status(400).json({message: "invalid user id"})
      }
      else{
        // Creates key:value pair.  user: {id, name}
        req.user = user;
        //console.log("req.user", req.user, req);
        next();
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "Server could not be reached."})
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
