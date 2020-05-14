/**
 * Database Module
 * using mysql driver directly
 * @see https://www.npmjs.com/package/mysql
 * @module db
 */

const config = require('config');
const mysql = require('mysql');
const _ = require('lodash');

const DB_CONFIG = config.get('db');
const pool = mysql.createPool(DB_CONFIG);

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
 * Open a connection to the database.
 * @return {any}
 */
function connect() {
  return knex;
}

/**
 * Returns all notes in the database as an array.
 * @return {Promise<Note[]>}
 */
function getAllNotes() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM notes';
    pool.query(sql, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * Returns a single not with the given ID.
 * @param {string|number} id the id of the note
 * @return {Promise<Note>}
 */
function findNoteById(id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM notes WHERE _id = ?';
    pool.query(sql, [id], (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(_.first(results));
      }
    });
  });
}

/**
 * Insert a new note into the database.
 * @param {Note} note entity to be inserted
 * @return {Promise<Note>}
 */
async function insertOneNote(note) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO notes (title, body) VALUES (?, ?)';
    pool.query(sql, [note.title, note.body], (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        note._id = results.insertId;
        resolve(note);
      }
    });
  });
}

/**
 * Update an existing note in the database.
 * @param {Note} note entity to be updated
 * @return {Promise<Note>}
 */
async function updateOneNote(note) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE notes SET title = ?, body = ? WHERE _id = ?';
    pool.query(sql, [note.title, note.body, note._id], (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(note);
      }
    });
  });
}

/**
 * Deletes the note with the given ID.
 * @param {string|number} id the id of the note
 * @return {Promise<any>}
 */
async function deleteOneNote(id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM notes WHERE _id = ?';
    pool.query(sql, [id], (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * Delete all notes from the database.
 * (This is permanent, use with caution.)
 * @return {Promise<any>}
 */
async function deleteAllNotes() {
  return new Promise((resolve, reject) => {
    const sql = 'TRUNCATE TABLE notes';
    pool.query(sql, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports.Note = Note;
module.exports.connect = connect;
module.exports.getAllNotes = getAllNotes;
module.exports.findNoteById = findNoteById;
module.exports.insertOneNote = insertOneNote;
module.exports.updateOneNote = updateOneNote;
module.exports.deleteOneNote = deleteOneNote;
module.exports.deleteAllNotes = deleteAllNotes;
