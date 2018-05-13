const nodemailer = require('nodemailer');
const config = require('../config');
const jwt = require('jsonwebtoken');
const transporter = nodemailer.createTransport(config.mailer);
const User = require('../models/User');
const Post = require('../models/Post');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Q = require('q');

const newPostRequestToAdmin = post => {
  User.findOne({_id: post.owner}).then(user => {
    const senderName = user.email;
    const token = jwt.sign(new Date(), config.secret);
    let text = `User: ${senderName}<br>
              <br>${post.body}<br>
              <a target="_blank" href="${config.host}/admin/${post._id}/accept?token=${token}">Accept</a>
              <a target="_blank" href="${config.host}/admin/${post._id}/decline?token=${token}">Decline</a>`;
    User.findOne({role: 'admin'}).then(admin => {
      let mailOptions = {
        from: `<${config.mailer.auth.user}>`,
        to: `${admin.email}`, // list of receivers
        subject: `New Post From: <${senderName}> ✔ ${post.title}`, // Subject line
        // text: text, // plain text body
        html: text // html body
      };
      console.log('send mail with this options:', JSON.stringify(mailOptions));
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
      });
    });
  }).catch(err => console.log(err));
};

function vote(postId, userId) {
  const d = Q.defer();
  if(!postId || !userId) {
    d.reject(new Error('postId and user are mandatory'));
  }
  Post.findOne({_id: postId})
    .then(post => {
      debugger;
      userId = ObjectId(userId);
      const index = post.votes.indexOf(userId);
      if (index === -1) {
        post.votes.push(userId);
      } else {
        post.votes.splice(index, 1);
      }
      post.save();

      d.resolve();
    }).catch(err => d.reject(err));

  return d.promise;
}

function meeting(postId, meeting) {
  meeting.updateDate = new Date();
  return Post.findOneAndUpdate({_id: postId}, {$set: {meeting: meeting}});
}

function accept(postId) {
  return Post.findOneAndUpdate({_id: postId}, {$set: {accepted: true, acceptDate: new Date()}});
}

function decline(postId) {
  return Post.findOneAndUpdate({_id: postId}, {$set: {accepted: false, acceptDate: new Date()}});
}

module.exports = {
  newPostRequestToAdmin: newPostRequestToAdmin,
  vote: vote,
  meeting: meeting,
  accept: accept,
  decline: decline
};