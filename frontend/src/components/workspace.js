import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import {UserContext} from '../context/UserContext';
import TranslatorCard from './translator-card';
import { HTMLSelect, Checkbox } from '@blueprintjs/core';

const Workspace = ({ role }) => {
    const [displayLang, setDisplayLang] = useState('eng');
    const [targetLang, setTargetLang] = useState('oji');
    const [sentences, setSentences] = useState([]);
    const [showTranslatedSentences, setShowTranslatedSentences] = useState(false);
    const [userContext, setUserContext] = useContext(UserContext);

    const fetchUserDetails = useCallback(() => {
        fetch(process.env.REACT_APP_API_ENDPOINT + 'user/me', {
            method: 'GET',
            credentials: 'include',
            // Pass authentication token as bearer token in header
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userContext.token}`
            }
        }).then(async response => {
            if (response.ok) {
                const data = await response.json();
                setUserContext(oldValues => {
                    return { ...oldValues, details: data }
                })
            } else {
                if (response.status === 401) {
                    /* Edge case: when the token has expired.
                     * This could happen if the refreshToken calls have failed due to network error or
                     * User has had the tab open from previous day and tries to click on the Fetch button */
                    window.location.reload();
                } else {
                    setUserContext(oldValues => {
                        return { ...oldValues, details: null }
                    })
                }
            }
        })
    }, [setUserContext, userContext.token]);

    useEffect(() => {
        // fetch only when user details are not present
        if (!userContext.details) {
            fetchUserDetails()
        }
    }, [userContext.details, fetchUserDetails])

    // Load all sentences
    useEffect(() => {
        axios
            .get('/sentence')
            .then(allSentences => setSentences(allSentences.data))
            .catch(err => {
                console.error(err);
                setSentences([]);
            })
    }, []);

    // Function passed to child component to send data back to parent
    const updateSentence = newSentenceObject => setSentences(sentences.map(s => s._id === newSentenceObject._id ? newSentenceObject : s));
   
    const isTranslated = sentence => sentence?.translations?.[targetLang] != null;

    // Filter sentences to display as appropriate
    let sentencesToShow = [...sentences];
    if (!showTranslatedSentences) {
        sentencesToShow = sentencesToShow.filter(sentence => !isTranslated(sentence));
    }

    return (
        <div className='workspace'>
            {JSON.stringify(userContext)}
            <div id='settings-card' className='workspace-card'>
                <p><strong>Settings</strong></p>
                <div style={{display:'flex'}}>
                    <div style={{flex: 1}}>
                        <p style={{marginBottom: '5px'}}>Display Language:</p>
                        <HTMLSelect onChange={e => setDisplayLang(e.target.value)}>
                            <option value='eng'>English</option>
                            <option value='fre'>French</option>
                        </HTMLSelect>
                    </div>
                    <div style={{flex: 1}}>
                        <p style={{marginBottom: '5px'}}>Target Language:</p>
                        <HTMLSelect onChange={e => setTargetLang(e.target.value)}>
                            <option value='oji'>Ojibwe</option>
                        </HTMLSelect>
                    </div>
                </div>
                <div style={{marginTop:'15px'}}>
                    <p>Additional Options</p>
                    <Checkbox 
                        checked={showTranslatedSentences} 
                        label='Show translated sentences'
                        onChange={e => setShowTranslatedSentences(!showTranslatedSentences)}
                    />
                </div>
            </div>
            {/* Sentence Cards */}
            {sentencesToShow.map(s => {
                if (userContext.details.role === 'translator') {
                    return (
                    <TranslatorCard 
                        key={s._id} 
                        sentence={s.text[displayLang]}
                        isTranslated={isTranslated(s)}
                        sentenceId={s._id}
                        lang={targetLang}
                        sentenceObject={s}
                        updateSentence={updateSentence}   
                    />
                    )
                } else {
                    return null;
                }
            })}
        </div>
    )
}

export default Workspace;