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

taskSchema.statics.create = async function(newTask, owner) {
  const task = new this(newTask);
  task.owner = owner._id;
  await task.save();
  return task;
};

module.exports = mongoose.model('Task', taskSchema);