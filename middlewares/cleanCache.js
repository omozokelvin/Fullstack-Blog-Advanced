const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  // this make sure the route handler is executed correctly
  await next();

  clearHash(req.user.id);
};
