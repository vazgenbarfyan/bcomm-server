const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const UserSchema = require('./User');

const commentSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
  text: {type: Number, required: true},
},
{timestamps: true});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;