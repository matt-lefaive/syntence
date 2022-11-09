import React, { useEffect, useState } from 'react';
import { Button, Callout } from '@blueprintjs/core';
import localization from '../Localization/localization';

const GlosserCard = ({ sentenceObj, lang, displayLang, userContext, n, updateSentence }) => {
    const [words, setWords] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [sentenceObject, setSentenceObject] = useState(sentenceObj);
    const [notification, setNotification] = useState('');

    const localized = localization(displayLang);
    
    // Load in the words based on ID (from sentenceObj's word id array)
    useEffect(() => {
        const wordIds = sentenceObject.words[lang];
        
        const wordIdsToWordObjects = async () => {
            const wordObjects = new Array(wordIds.length);
            for (let i = 0; i < wordIds.length; i++) {
                wordObjects[i] = fetch(process.env.REACT_APP_API_ENDPOINT + `word/${wordIds[i]}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userContext.token}`
                    }
                })
                .then(response => response.json())
                .then(data => data)
                .catch(err => {
                    console.error(err)
                    return {};
                })
            }
            Promise.all(wordObjects).then(values => setWords(values));
        }

        wordIdsToWordObjects();
    }, [lang, sentenceObject.words, userContext.token])
    

    // Make notifcation callout disappear after 2s
    useEffect(() => {
        if (notification) {
            setTimeout(() => {
                setNotification('');
            }, 2000)
        }
    }, [notification])

    // Submit glossed words to DB
    const handleSubmitGlossOnClick = e => {
        setIsSubmitting(true);
        setError('');

        const genericErrorMessage = 'Something went wrong! Please try again later';
        
        // Form object to post
        const fullSentenceGlosses = {};
        for (let i = 0; i < words.length; i++) {
            fullSentenceGlosses[words[i]._id] = document.getElementById(`gloss-${words[i].text}-${i}-${n}`).textContent || '';
        }
        
        // Post!
        fetch(process.env.REACT_APP_API_ENDPOINT + `word/gloss/multi`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({glossedWords: fullSentenceGlosses})
        }).then(response => {
            if (!response.ok) {
                setError(genericErrorMessage);
                setIsSubmitting(false);
                return;
            }
            return response.json();
        }).then(data => {
            console.log(data);
            setIsSubmitting(false);
        }).catch(err => {
            console.error(err);
            setIsSubmitting(false);
        })
    }

    // Unlink homographic glossed word
    const handleUnlinkGlossClick = (word, i) => {
        console.log('unlinking');
        const glossTD = document.getElementById(`gloss-${word.text}-${i}-${n}`);

        // Submit new word to database with gloss
        const newWord = {
            text: word.text,
            lang: word.lang,
            gloss: glossTD.textContent
        }

        fetch(process.env.REACT_APP_API_ENDPOINT + 'word/new', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({newWord})
        }).then(response => {
            if (!response.ok) {
                return;
            }
            return response.json()
        }).then(submittedWord => {
            // Replace the newly-unlinked word in the words state array
            const newWordsArray = [...words];
            newWordsArray[i] = submittedWord;

            // Update sentence object in DB with new ID array!
            const newSentenceObj = {...sentenceObject}
            newSentenceObj['words'][lang] = newWordsArray.map(w => w._id);
            

            //console.log(newSentenceObj);
            fetch(process.env.REACT_APP_API_ENDPOINT + `sentence/update/${lang}/${sentenceObj._id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({newWordIds: newSentenceObj.words[lang]})
            }).then(response => {
                if (!response.ok) {
                    return;
                }
                return response.json();
            }).then(data => {
                // Update sentences object in parent component
                updateSentence(newSentenceObj);

                // Display notification to use
                setNotification('Gloss unlinked!')
            })
        }).catch(err => {
            console.error(err);
        })
    }

    return (
        <div className='workspace-card'>
            {error && <Callout intent='danger'>{error}</Callout>}
            {notification && <Callout intent='success'>{notification}</Callout>}
            <table>
                <tbody>
                    {/* Row 1: translation */}
                    <tr>
                        <td style={{textAlign:'right'}}><strong>{localized.TRANSLATION}:</strong></td>
                        {words.map((word, i) => {
                            return (
                                <td key={word.text + `-${i}`}>
                                    <em>{word.text}</em>
                                </td>
                            )
                        })}
                    </tr>
                    {/* Row 2: glosses */}
                    <tr>
                        <td style={{textAlign:'right'}}><strong>{localized.GLOSS}:</strong></td>
                        {words.map((word, i) => {
                            return (
                                <td 
                                    id={`gloss-${word.text}-${i}-${n}`}
                                    key={`gloss-${word.text}-${i}-${n}`} 
                                    contentEditable 
                                    style={{borderBottom:'1px solid gray'}}
                                    suppressContentEditableWarning={true}
                                >
                                    {words[i].gloss}
                                </td>
                            );
                        })}
                    </tr>
                    {/* Row 3: Gloss unlinkers */}
                    <tr>
                        <td></td>
                        {words.map((word, i) => {
                            if (word.gloss) {
                                return (
                                    <td
                                        id={`unlink-${word.text}-${i}-${n}`}
                                        key={`unlink-${word.text}-${i}-${n}`}
                                        style={{textAlign: 'center'}}
                                    >
                                        <div 
                                            className='gloss-unlinker'
                                            onClick={() => handleUnlinkGlossClick(word, i)}
                                        >
                                            ⇤&nbsp;⇥
                                        </div>
                                    </td>
                                )
                            } else {
                                return <td></td>
                            }
                        })}
                    </tr>
                    {/* Row 4: source sentence */}
                    <tr>
                        <td style={{textAlign:'right'}}><strong>{localized.SOURCE}:</strong></td>
                        <td colSpan={words.length}>"{sentenceObj.text[displayLang]}"</td>
                    </tr>
                </tbody>
            </table>
            <Button 
                style={{marginTop: '15px'}}
                intent='primary'
                fill
                text={`${isSubmitting ? localized.SUBMITTING : localized.SUBMIT} ${displayLang === 'eng' ? localized.GLOSS : localized.GLOSS.toLowerCase()}`}
                onClick={handleSubmitGlossOnClick}
            />
        </div>
    )
}

export default GlosserCard;