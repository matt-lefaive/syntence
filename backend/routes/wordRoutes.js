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
        res.send(word);
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
})

module.exports = router;

