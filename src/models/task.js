const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: String,
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Task', taskSchema);