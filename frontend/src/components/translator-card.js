import React, { useEffect, useState } from 'react';
import { Button, FormGroup, InputGroup, Callout } from '@blueprintjs/core';

import localization from '../Localization/localization';

const TranslatorCard = ({ sentence, isTranslated, lang, sentenceId, sentenceObject, updateSentence, displayLang }) => {
    const [translation, setTranslation] = useState(isTranslated ? sentenceObject.translations[lang] : '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filename, setFilename] = useState('Choose recording...');
    const [fileReuploadText, setFileReuploadText] = useState(
        sentenceObject.recordings
        ? sentenceObject.recordings[lang] 
            ? sentenceObject.recordings[lang].replace(/\.\/uploads\/[a-z]{3}-[A-Za-z0-9]*-/, '')
            : ''
        : ''
    );
    const [error, setError] = useState('');

    const localized = localization(displayLang);

    useEffect(() => {
        setFilename(localized.CHOOSE_RECORDING);
    }, [localized.CHOOSE_RECORDING])

    const submitNewTranslationHandler = e => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const genericErrorMessage = 'Something went wrong! Please try again later';

        /* Step 1: Submit sentence as words */
        fetch(process.env.REACT_APP_API_ENDPOINT + `word/sentence/lang/${lang}`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({sentence: translation})
        }).then(response => {
            if (!response.ok) {
                setError(genericErrorMessage);
                setIsSubmitting(false);
                return
            }
            return response.json();
        }).then(data => {
            // Update the sentenceObject that will be used to update state in parent with word IDs
            let newSentenceObject = {...sentenceObject};
            if (!newSentenceObject.words) newSentenceObject.words = {};
            newSentenceObject.words[lang] = data;

            /* Step 2: Submit translation to sentence db  */
            fetch(process.env.REACT_APP_API_ENDPOINT + `sentence/translation/${sentenceId}/${lang}`, {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({translation, words:data})
            }).then(response => {
                if (!response.ok) {
                    setError(genericErrorMessage);
                    setIsSubmitting(false);
                    return;
                }

                // Update the sentenceObject that will be used to update state in parent with translation
                if (!newSentenceObject.translations) newSentenceObject.translations = {};
                newSentenceObject.translations[lang] = translation;

                /* Step 3 (Optional): Submit recording (if it exists) */
                const uploadedFile = document.getElementById('recording').files[0];
                if (uploadedFile) {
                    const formData = new FormData();
                    formData.append('recording', uploadedFile);
                    fetch(process.env.REACT_APP_API_ENDPOINT + `sentence/recording/${sentenceId}/${lang}`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData
                    }).then(response => {
                        if (!response.ok) {
                            setError(genericErrorMessage)
                            setIsSubmitting(false);
                            return;
                        }
                        return response.json();
                    }).then(data => {
                        // Update the sentenceObject that will be used to update state in parent with recording
                        if (!newSentenceObject.recordings) newSentenceObject.recordings = {};
                        newSentenceObject.recordings[lang] = data.recordings[lang];
                        updateSentence(newSentenceObject);
                        setIsSubmitting(false)
                    }).catch(err => {
                        console.error(err);
                        setIsSubmitting(false);
                        setError(genericErrorMessage);
                    }) 
                } else {
                    // Update the sentenceObject that will be used to update state in parent with no recording
                    if (!newSentenceObject.recordings) newSentenceObject.recordings = {};
                    newSentenceObject.recordings[lang] = null;
                    setIsSubmitting(false);
                    updateSentence(newSentenceObject);
                }
            }).catch(err => {
                console.error(err);
                setIsSubmitting(false);
                setError(genericErrorMessage);
            })
        }).catch(err => {
            console.error(err);
            setIsSubmitting(false);
            setError(genericErrorMessage);
        });
    }

    if (!isTranslated) {
        return (
            <div className='workspace-card'>
                {error && <Callout intent='danger'>{error}</Callout>}
                <form onSubmit={submitNewTranslationHandler}>
                    <FormGroup label={sentence} labelFor='translation'>
                        <InputGroup 
                            id='translation'
                            placeholder={localized.TRANSLATION}
                            type='text'
                            value={translation}
                            onChange={e => setTranslation(e.target.value)}
                        />
                    </FormGroup>
                    <label className="bp4-file-input .modifier">
                        <input 
                            type="file" 
                            id='recording' 
                            onChange={e => setFilename(e.target.value.replace('C:\\fakepath\\', ''))}
                        />
                        <span className="bp4-file-upload-input">{filename}</span>
                    </label>
                    <Button 
                        style={{marginTop: '15px'}}
                        intent='primary'
                        fill
                        type='submit'
                        text={isSubmitting ? localized.SUBMITTING : localized.SUBMIT}
                        disabled={isSubmitting ? true : undefined}
                    />
                </form>
            </div>
        )
    } else {
        return (
            <div className='workspace-card'>
                {error && <Callout intent='danger'>{error}</Callout>}
                <form onSubmit={submitNewTranslationHandler}>
                    <FormGroup label={sentence} labelFor='translation'>
                        <InputGroup 
                            id='translation'
                            placeholder={localized.UPDATED_TRANSLATION}
                            type='text'
                            value={translation}
                            onChange={e => setTranslation(e.target.value)}
                        />
                    </FormGroup>
                    <label className='bp4-file-input .modifer'>
                        <input 
                            type='file' 
                            id='recording' 
                            onChange={e => setFileReuploadText(e.target.value.replace('C:\\fakepath\\', ''))}
                        />
                        <span className='bp4-file-upload-input'>{fileReuploadText}</span>
                    </label>
                    <Button 
                        style={{marginTop: '15px'}}
                        intent='warning'
                        fill
                        type='submit'
                        text={isSubmitting ? localized.UPDATING : localized.UPDATE}
                        disabled={isSubmitting ? true : undefined}
                    />
                </form>
            </div>
        )
    }
}

export default TranslatorCard;

