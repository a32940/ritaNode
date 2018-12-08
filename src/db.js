/**
 * @module db manage DB connection
 */

const {MongoClient} = require('mongodb');

let _client = null;
let _db = null;


/**
  * Connects to database Mongo
  *
  * @function connect
  *
  * @param {String} url MongoDB url
  * @param {String} dbName Database name
  * @param {String} options Options for the mongodb client
  *
  * @return {Promise<Object>} Returns a promise that gives the connection to mongodb
  */

const connect = async (url, dbName, options) => {
  try {
    if (!_client && !_db) {
      _client = await MongoClient.connect(url, options);
      _db = _client.db(dbName);
    }

    return _db;
  } catch (e) {
    throw e;
  }
};


/**
 * Close mongodb connection
 *
 * @function close
 *
 * @return {Promise <Boolean>} Returns a promise that returns true or false depending on operation's success
 */


const close = async () => {
  try {
    if (_client) {
      await _client.close();
      _client = null;
      _db = null;
      return true;
    }
  } catch (e) {
    throw e;
  }
};


/**
 * Get MongoDB connection
 *
 * @function get
 *
 * @return {Object} Returns MongoDB connection
 */

const get = () => {
  if (!_db) {
    throw new Error('Não existe nenhuma conexão à base de dados MOngoDB');
  }

  return _db;
};

module.exports = {
  connect,
  close,
  get
};
