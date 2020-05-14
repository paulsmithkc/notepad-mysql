/**
 * Database Module
 * using knex query builder
 * @see https://www.npmjs.com/package/knex
 * @module db
 */

const config = require('config');

const DB_CONFIG = config.get('db');
const knex = require('knex')({ client: 'mysql', connection: DB_CONFIG });

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
async function getAllNotes() {
  return knex('notes').select('*').orderBy('title');
}

/**
 * Returns a single not with the given ID.
 * @param {string|number} id the id of the note
 * @return {Promise<Note>}
 */
async function findNoteById(id) {
  const results = await knex('notes').where('_id', id).select('*');
  return results && results.length ? results[0] : null;
}

/**
 * Insert a new note into the database.
 * @param {Note} note entity to be inserted
 * @return {Promise<Note>}
 */
async function insertOneNote(note) {
  const results = await knex('notes').insert({ title: note.title, body: note.body });
  note._id = results[0];
  return note;
}

/**
 * Update an existing note in the database.
 * @param {Note} note entity to be updated
 * @return {Promise<Note>}
 */
async function updateOneNote(note) {
  await knex('notes').where('_id', note._id).update({ title: note.title, body: note.body });
  return note;
}

/**
 * Deletes the note with the given ID.
 * @param {string|number} id the id of the note
 * @return {Promise<any>}
 */
async function deleteOneNote(id) {
  return knex('notes').where('_id', id).delete();
}

/**
 * Delete all notes from the database.
 * (This is permanent, use with caution.)
 * @return {Promise<any>}
 */
async function deleteAllNotes() {
  return knex('notes').delete();
}

module.exports.Note = Note;
module.exports.connect = connect;
module.exports.getAllNotes = getAllNotes;
module.exports.findNoteById = findNoteById;
module.exports.insertOneNote = insertOneNote;
module.exports.updateOneNote = updateOneNote;
module.exports.deleteOneNote = deleteOneNote;
module.exports.deleteAllNotes = deleteAllNotes;
