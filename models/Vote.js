const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = require('./User');

const voteSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:UserSchema, required: true},
  vote: {type: Number, required: true},
},
{timestamps: true});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;