const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Authorize = require('../services/Auth');

router.get('/', function (req, res, next) {
  Post.find()
    .sort({createdAt:-1})
    .populate('owner')
    .exec((err, posts) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.render('admin/index', {posts: posts});
    })
});
router.get('/posts/:postId', (req, res, next) => {
  Post.findOne({_id: req.params.postId})
    .sort({createdAt:-1})
    .populate('owner')
    .exec((err, post) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.render('admin/index', {posts: [post]});
    })
});
router.get('/:postId/accept', Authorize, (req, res, next) => {
  Post.update({_id: req.params.postId}, {status: 'accepted'}).then(() => {
    res.render('admin/tmp');
  }).catch(err => res.status(400).send(err));
});
router.get('/:postId/decline', (req, res, next) => {
  Post.update({_id: req.params.postId}, {status: 'declined'}).then(() => {
    res.render('admin/tmp');
  }).catch(err => res.status(400).send(err));
});


module.exports = router;