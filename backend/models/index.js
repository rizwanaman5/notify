const mongoose = require('mongoose');
const localDB = 'mongodb://localhost:27017/Notify';

mongoose
  .connect(localDB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports.User = require('./users');
