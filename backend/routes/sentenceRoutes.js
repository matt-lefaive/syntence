const express = require('express');
const router = express.Router();
const Sentence = require('../models/sentence');

/**
 * Get all sentences
 */
router.get('/', (req, res, next) => {
    Sentence.find().exec((err, sentences) => {
        res.send(sentences);
    })
})

/**
 * Get sentence by id
 */
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Sentence.findById(id).exec((err, sentence) => {
        res.send(sentence);
    })
})

module.exports = router;