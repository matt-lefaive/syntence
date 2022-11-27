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

/**
 * Update sentence based on id
 */
router.post('/update/:lang/:id', (req, res, next) => {
    const id = req.params.id;
    const lang = req.params.lang;
    const update = {[`words.${lang}`]: req.body.newWordIds}
    
    Sentence.findByIdAndUpdate(id, update).exec((err, sentence) => {
        res.send(sentence);
    })
})

/**
 * Submit new translation sentence
 */
router.post('/translation/:id/:lang',  (req, res, next) => {
    const id = req.params.id;
    const lang = req.params.lang;

    const update = {
        [`translations.${lang}`] : req.body.translation,
        [`words.${lang}`] : req.body.words
    };
    
    Sentence.findByIdAndUpdate(id, update).exec((err, sentence) => {
        res.send(sentence);
    })
})

/**
 * Submit new recording for sentence
 */
router.post('/recording/:id/:lang', async (req, res) => {
    const id = req.params.id;
    const lang = req.params.lang;

    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No recording uploaded'
            })
        } else {
            // Use name of input field to retrieve uplaoded file
            const recording = req.files.recording;

            // Place the file in the uploads directory
            recording.mv(`./uploads/${lang}-${id}-${recording.name}`);

            // Update document
            const update = {[`recordings.${lang}`] : `./uploads/${lang}-${id}-${recording.name}`}
            Sentence.findByIdAndUpdate(id, update).exec((err, sentence) => {
                sentence['recordings'][lang] = `./uploads/${lang}-${id}-${recording.name}`
                res.send(sentence);
            })
        }
    } catch (err) {

    }
})

module.exports = router;