/**
 * word
 * {
 *      _id: ObjectId
 *      text: 'pooshiish',
 *      lang: 'oji',
 *      gloss: 'cat.SG'
 * }
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Word = new Schema({
    text: {
        type: String,
        default: ''
    },
    lang: {
        type: String,
        default: ''
    },
    gloss: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('Word', Word);