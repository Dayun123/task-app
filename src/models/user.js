const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  authToken: String,
  authTokens: [String],
});

userSchema.statics.create = async function(newUser) {
  const user = new this(newUser);
  user.password = await bcrypt.hash(user.password, 8);
  await user.save();
  return user;
};

module.exports = mongoose.model('User', userSchema);