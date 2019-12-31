const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

userSchema.statics.create = function(newUser) {
  const user = new this(newUser);
  return user;
};

module.exports = mongoose.model('User', userSchema);