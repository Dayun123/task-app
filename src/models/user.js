const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

userSchema.statics.create = async function(newUser) {
  const user = new this(newUser);

  return user;
};

module.exports = mongoose.model('User', userSchema);