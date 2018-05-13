const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  location: String,
  age: Number,
  role: {type: String, enum: ['user', /*'admin'*/], default: 'user'},
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});


const User = mongoose.model('User', userSchema);

module.exports = User;