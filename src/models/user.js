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
  avatar: Buffer,
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
  if (!user) throw new Error('No user found with those credentials');
  const passwordMatch = await bcrypt.compare(userToAuth.password, user.password);
  if (!passwordMatch) throw new Error('Password incorrect');
  await user.generateAuthToken();
  await user.save();
  return user;
};

userSchema.methods.generateAuthToken = async function() {
  const config = await loadConfig();
  this.authToken = jwt.sign({ _id: this._id }, config.secret);
  this.authTokens.push(this.authToken);
};

userSchema.methods.removeAuthToken = async function(token) {
  this.authToken = undefined;
  this.authTokens = this.authTokens.filter((authToken) => authToken !== token);
  await this.save();
};

userSchema.methods.removeAllAuthTokens = async function() {
  this.authToken = undefined;
  this.authTokens = [];
  await this.save();
};

userSchema.virtual('profile').get(function() {
  return {
    username: this.username,
    email: this.email,
    authToken: this.authToken,
  };
});

userSchema.virtual('profileAvatar').get(function() {
  return {
    username: this.username,
    email: this.email,
    authToken: this.authToken,
    avatar: this.avatar,
  };
});

module.exports = mongoose.model('User', userSchema);