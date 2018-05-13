const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const PostService = require('../services/Post');

// GET users listing. */
router.get('/', (req, res, next) => {
  Post.find({status: 'accepted'})
    .lean()
    .then(posts => {
    posts = posts.map(post=>{
      if(post.votes) {
        post.isVoted = post.votes.filter(_id=>{
            return _id.toString == req._currentUser._id.toString();
          }).length > 0;
        post.votes = post.votes.length;
      } else {
        post.votes = [];
        post.isVoted = false;
      }

      return post;
    });
    res.send(JSON.stringify({
      posts: posts
    }));
  }).catch(err => {
    console.log(err);
    res.status(400).send(err)
  });
});

router.post('/', (req, res, next) => {
  const data = req.body;
  const post = new Post({
    title: data.title,
    body: data.body,
    owner: req._currentUser
  });
  post.save().then(() => {
    PostService.newPostRequestToAdmin(post);
    res.send({message: 'Success'});
  }).catch(err => res.status(400).send(err));
});

router.post('/:postId/vote', (req, res, next) => {
  PostService.vote(req.params.postId, req._currentUser._id)
    .then(() => {
      res.send({message: 'Vote: Success'});
    }).catch(err => res.status(400).send({error: "BAAAD"}));
});

router.post('/:postId/meeting', (req, res, next) => {
  const meeting = {
    date: req.body.date,
    info: req.body.info
  };
  PostService.meeting(req.params.postId, meeting)
    .then(() => {
      res.send({message: 'Meeting: Success'});
    }).catch(err => res.status(400).send({error: "BAAAD"}));
});

router.post('/:postId/accept', (req, res, next) => {
  PostService.accept(req.params.postId)
    .then(() => {
      res.send({message: 'Accept: Success'});
    }).catch(err => res.status(400).send({error: "BAAAD"}));
});

router.post('/:postId/decline', (req, res, next) => {
  PostService.decline(req.params.postId)
    .then(() => {
      res.send({message: 'Decline: Success'});
    }).catch(err => res.status(400).send({error: "BAAAD"}));
});

module.exports = router;