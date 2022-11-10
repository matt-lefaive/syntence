/**
 * "I like the cat"
 * {
 *      _id: ObjectID()
 *      text: {
 *          eng: "I like the cat",
 *          fre: "J'aime le chat"
 *      },
 *      group: 'name',
 *      translations: {
 *          oji: 'Pooshiish'
 *      },
 *      words: {
 *          oji: [<word1ID>, <word2ID>, ...]
 *      },
 *      recordings: {
 *          oji: <path>
 *      } 
 * }
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sentence = new Schema({
    group: {
        type: String,
        default: ''
    },
    text: {
        type: Object,
        default: {}
    },
    translations: {
        type: Object,
        default: {}
    },
    words: {
        type: Object,
        default: {}
    },
    recordings: {
        type: Object,
        default: {}
    }
})

module.exports = mongoose.model('Sentence', Sentence);