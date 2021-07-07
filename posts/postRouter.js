const express = require('express');
const Posts = require("./postDb")

const router = express.Router();


router.get('/', (req, res) => {
  // do your magic!
  Posts
    .get()
    .then(post => {
      console.log(post)
      res.status(200).json(post)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "Server could not be reached."})
    })

});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  //console.log(id)
  Posts
    .getById(id)
    .then(postId => {
      //console.log(postId)
      res.status(200).json(postId)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "Server could not be reached."})
    })
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  const id = req.params.id;

  Posts
    .remove(id)
    .then(post => {
      res.status(200).json({message: "Post removed", post})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "Server could not be reached."})
    })
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  const post = req.body;

  Posts
    .getById(id)
    .then(item => {
      Posts
        .update(id, post)
        .then(() => {
          res.status(200).json({message: "Post update", post})
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({error: "Server could not be reached."})
        })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json()
    })
});

// custom middleware
function validatePostId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  //console.log(id)
  Posts
    .getById(id)
    .then(post => {
      //console.log(post)
      if(!post){
        console.log("PostId invalid")
        res.status(404).json("Post not found")
      }
      else{
        next();
      }
    })
  

}

module.exports = router;
