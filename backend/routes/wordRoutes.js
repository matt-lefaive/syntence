const express = require('express');
const user = require('../models/user');
const word = require('../models/word');
const router = express.Router();
const Word = require('../models/word');

/**
 * Get all words
 */
router.get('/', (req, res, next) => {
    Word.find().exec((err, words) => {
        res.send(words);
    });
});

/**
 * Get word by id
 */
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Word.findById(id).exec((err, word) => {
        if (err) {
            res.send({});
        } else {
            res.send(word);
        }
    });
});

/**
 * Get all words of a given language
 */
router.get('/lang/:lang', (req, res, next) => {
    const lang = req.params.lang;
    Word.find({lang}).exec((err, words) => {
        res.send(words);
    })
})

/**
 * Break sentence up into multiple words and submit each as new
 */
router.post('/sentence/lang/:lang', async (req, res, next) => {
    const lang = req.params.lang;
    const words = req.body.sentence.split(' ')
    const wordIds = [];

    const uploadWord = async word => {
        const newWord = new Word({
            lang: lang,
            text: word
        });
        await newWord.save();
        return newWord._id;
    }

    const findWord = word => Word.findOne({lang, text: word});

    const formIdArray = async () => {
        for (const word of words) {
            const soughtWord = await findWord(word);
            if (soughtWord) {
                wordIds.push(soughtWord._id)
            } else {
                wordIds.push(await uploadWord(word));
            }
        }

        res.send(wordIds);
    }
    
    formIdArray();
});

// Submit a new word
router.post('/new', (req, res, next) => {
    const newWord = new Word(req.body.newWord);
    newWord.save().then(word => {
        res.send(word);
    }).catch(err => {
        res.send(err)
    })
})

// Submit a whole object of glosses to DB
// TODO: Actually write this well
router.post('/gloss/multi', (req, res, next) => {
    const ids = Object.keys(req.body.glossedWords)
    const glosses = ids.map(id => req.body.glossedWords[id]);

    // Update each word object with it's gloss
    for (let i = 0; i < ids.length; i++) {
        const update = {gloss: glosses[i]}
        Word.findByIdAndUpdate(ids[i], update).exec((err, word) => {

        })
    }

    // Not the correct approach (doesn't wait for all to submit)
    res.send({});
})

module.exports = router;

