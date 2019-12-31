const mongoose = require('mongoose');

const dbName = 'task-app';

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(`mongodb://localhost:27017/${dbName}`, connectionOptions)
  .catch((err) => {
    console.log('Connection error on initial connection: ', err);
  });

mongoose.connection.on('error', err => {
  console.log('Connection error after initial connection: ', err);
});

mongoose.connection.on('connected', () => {
  console.log(`\n\nConnection to ${dbName} database established successfully!\n\n`);
});