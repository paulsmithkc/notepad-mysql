const debug = require('debug')('app:db');
const config = require('config');
const mysql = require('mysql');
const knex = require('knex');

const DB_CONFIG = config.get('db');

/**
 * Note Entity
 */
class Note {
  /**
   * Create a new note entity.
   * @param {string} title title text of the note
   * @param {string} body body text of the note
   */
  constructor(title, body) {
    this._id = 0;
    this.title = title;
    this.body = body;
  }
}

/**
 * Open a connection to the database, if one is not already open.
 * Otherwise, reuse the existing connection.
 * @return {Promise<mysql.Connection>}
 */
function connect() {
  return new Promise((resolve, reject) => {
    debug('connecting to database...');
    const connection = mysql.createConnection(DB_CONFIG);
    connection.connect((err) => {
      if (err) {
        debug('error connecting: ' + err.stack);
        reject(err);
      } else {
        debug('connected as id ' + connection.threadId);
        resolve(connection);
      }
    });
  });
}

/**
 * Returns all notes in the database as an array.
 * @return {Promise<Note[]>}
 */
function getAllNotes() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM notes';
    const connection = mysql.createConnection(DB_CONFIG);
    connection.query(query, (err, results, fields) => {
      if (err) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * Returns a single not with the given ID.
 * @param {string} id the id of the note
 * @return {Promise<Note>}
 */
async function findNoteById(id) {
  id = new ObjectId(id);
  const db = await connect();
  const collection = db.collection('notes');
  return collection.findOne({ _id: id });
}

/**
 * Insert a new note into the database.
 * @param {Note} note entity to be inserted
 * @return {Promise<any>}
 */
async function insertOneNote(note) {
  delete note._id;
  const db = await connect();
  const collection = db.collection('notes');
  return collection.insertOne(note);
}

/**
 * Update an existing note in the database.
 * @param {Note} note entity to be updated
 * @return {Promise<any>}
 */
async function updateOneNote(note) {
  note._id = new ObjectId(note._id);
  const db = await connect();
  const collection = db.collection('notes');
  return collection.updateOne({ _id: note._id }, { $set: { title: note.title, body: note.body } });
}

/**
 * Deletes the note with the given ID.
 * @param {string} id the id of the note
 * @return {Promise<any>}
 */
async function deleteOneNote(id) {
  id = new ObjectId(id);
  const db = await connect();
  const collection = db.collection('notes');
  return collection.deleteOne({ _id: id });
}

/**
 * Delete all notes from the database.
 * (This is permanent, use with caution.)
 */
async function deleteAllNotes() {
  const db = await connect();
  const collection = db.collection('notes');
  return collection.deleteMany({});
}

/**
 * Checks if a value is a valid ObjectId.
 * @param {string|ObjectId} id the id to validate
 * @return {boolean} return true if the value is a valid ObjectId, return false otherwise.
 */
function isValidId(id) {
  return ObjectId.isValid(id);
}

/**
 * Generate a new ObjectId.
 * @return {ObjectId}
 */
function newId() {
  return new ObjectId().toString();
}

module.exports.Note = Note;
module.exports.connect = connect;
module.exports.getAllNotes = getAllNotes;
module.exports.findNoteById = findNoteById;
module.exports.insertOneNote = insertOneNote;
module.exports.updateOneNote = updateOneNote;
module.exports.deleteOneNote = deleteOneNote;
module.exports.deleteAllNotes = deleteAllNotes;
module.exports.isValidId = isValidId;
module.exports.newId = newId;
