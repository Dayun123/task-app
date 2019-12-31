const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = 'dq6h/K_NT5@6N`CcJa$<db/W)/awTc';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
  },
  password: String,
  email: String,
  authToken: String,
  authTokens: [String],
});

userSchema.statics.create = async function(newUser) {
  const user = new this(newUser);
  user.password = await bcrypt.hash(user.password, 8);
  user.generateAuthToken();
  await user.save();
  return user;
};

userSchema.methods.generateAuthToken = function() {
  this.authToken = jwt.sign({ _id: this._id }, secret);
  this.authTokens.push(this.authToken);
};

userSchema.virtual('profile').get(function() {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    authToken: this.authToken,
  };
});

module.exports = mongoose.model('User', userSchema);