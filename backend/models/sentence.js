/**
 * "I like the cat"
 * {
 *      _id: ObjectID()
 *      text: {
 *          eng: "I like the cat",
 *          fre: "J'aime le chat"
 *      },
 *      translations: {
 *          oji: [[id], [id], [id]]
 *      }
 * }
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sentence = new Schema({
    text: {
        type: Object,
        default: []
    },
    translations: {
        type: Object,
        default: []
    }
})

module.exports = mongoose.model('Sentence', Sentence);