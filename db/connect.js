const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;

mongoose.set('strictQuery', false);

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log('MongoDB Connected'))
  .catch((err) => console.log('connection error', err));

module.exports = {};
