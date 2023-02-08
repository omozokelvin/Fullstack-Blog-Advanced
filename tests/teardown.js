const mongoose = require('mongoose');

const teardown = async () => {
  await mongoose.connection.close();
};

module.exports = teardown;
