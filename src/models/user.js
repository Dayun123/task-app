const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const loadConfig = require('../utils/loadConfig');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    minlength: 6,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    validate(email) {
      return validator.isEmail(email);
    },
  },
  authToken: String,
  authTokens: [String],
});

userSchema.statics.create = async function(newUser) {
  const user = new this(newUser);
  await user.validate();
  await user.generateAuthToken();
  user.password = await bcrypt.hash(user.password, 8);
  await user.save();
  return user;
};

userSchema.statics.auth = async function(userToAuth) {
  const queryFilter = {};
  if (userToAuth.email) queryFilter.email = userToAuth.email;
  if (userToAuth.username) queryFilter.username = userToAuth.username;
  const user = await this.findOne(queryFilter);
  return user;
};

userSchema.methods.generateAuthToken = async function() {
  const config = await loadConfig();
  this.authToken = jwt.sign({ _id: this._id }, config.secret);
  this.authTokens.push(this.authToken);
};

userSchema.virtual('profile').get(function() {
  return {
    username: this.username,
    email: this.email,
    authToken: this.authToken,
  };
});

module.exports = mongoose.model('User', userSchema);