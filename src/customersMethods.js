/**
 * @module Customers
 */
const {ObjectID} = require('mongodb');

const db = require('./db');
const {MONGO_COLLECTION} = require('./config');

/**
 * Insert new customer to customers contact list
 *
 * @function insert
 *
 * @param {Object} customer Customer object to be inserted
 *
 * @return {Promise<Object>} Inserted document
 */

module.exports.insert = async (customer) => {
  try {
    const inserted = await db
      .get()
      .collection(MONGO_COLLECTION.customers)
      .insertOne(customer, {w: 1});
    console.log(`Resultado da inserção ${inserted}`);

    const query = {_id: inserted.insertedId};

    const result = await db
      .get()
      .collection(MONGO_COLLECTION.customers)
      .findOne(query);

    console.log(`Customer Inserted ${result}`);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Update customer information
 *
 * @function update
 *
 * @param {Object} customer Customer object to be inserted
 *
 * @return {Promise<Object>} Updated document
 */
module.exports.update = async (customer) => {
  try {
    const result = await db
      .get()
      .collection(MONGO_COLLECTIONS.customer)
      .findOneAndUpdate({
        _id: customer._id
      }, {
        $set: customer
      }, {
        upsert: true,
        returnOriginal: false
      });
    log('[DBG] Documento Atualizado: %o', result);

    return result.value;
  } catch (e) {
    throw e;
  }
};

/**
* Delete customer by ID
*
* @function delete
*
* @param {String} id customer's id
*
* @return {Promise<Object>} Customer erased
*/
module.exports.delete = async (id) => {
  try {
    const result = await db
      .get()
      .collection(MONGO_COLLECTION.customers)
      .findOneAndDelete({
        _id: new ObjectID(id)
      });
    log('[DBG] Documento apagado: %o', result);

    return result.value;
  } catch (e) {
    throw e;
  }
};

/**
* Find customer by ID
*
* @function findById
*
* @param {String} id customer's ID
*
* @return {Promise<Object>} Customer's document
*/
module.exports.findById = async (id) => {
  try {
    const result = await db
      .get()
      .collection(MONGO_COLLECTION.customers)
      .findOne({
        _id: new ObjectID(id)
      });
    log('[DBG] Documento encontrado: %o', result);

    return result;
  } catch (e) {
    throw e;
  }
};

/**
* Get all customers
*
* @function findAll
*
* @return {Promise<Object>} Array with all customers
*/
module.exports.findAll = async () => {
  try {
    const result = await db
      .get()
      .collection(MONGO_COLLECTION.customers)
      .find()
      .toArray();
    log('[DBG] Documentos encontrados: %o', result);

    return result;
  } catch (e) {
    throw e;
  }
};
