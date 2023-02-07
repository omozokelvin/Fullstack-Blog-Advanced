const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');

const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options?.key || '');

  return this;
};

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    console.log('not using cache');
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // See if we have a value for 'key' in redis
  const cachedValue = await client.hget(this.hashKey, key);

  // if we do, return that

  if (cachedValue) {
    const doc = JSON.parse(cachedValue);

    console.log('returned from cache');
    return Array.isArray(doc)
      ? doc.map((item) => new this.model(item))
      : new this.model(doc);
  }

  // Otherwise, issue the query and store the result in redis

  console.log('returned from mongo');

  const result = await exec.apply(this, arguments);

  console.log('set to cache');
  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

  return result;
};

module.exports = {
  clearHash(hashKey) {
    console.log('deleting from redis', JSON.stringify(hashKey));

    client.del(JSON.stringify(hashKey));
  },
};
