import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import {UserContext} from '../context/UserContext';
import TranslatorCard from './translator-card';
import GlosserCard from './glosser-card';
import { HTMLSelect, Checkbox } from '@blueprintjs/core';

import localization from '../Localization/localization';

const Workspace = () => {
    const [displayLang, setDisplayLang] = useState('eng');
    const [targetLang, setTargetLang] = useState('oji');
    const [sentences, setSentences] = useState([]);
    const [showTranslatedSentences, setShowTranslatedSentences] = useState(false);
    const [localized, setLocalized] = useState(localization(displayLang));
    const [allRoles, setAllRoles] = useState(['']);
    const [role, setRole] = useState('');
    const [allGroups, setAllGroups] = useState([]);
    const [group, setGroup] = useState('');

    const [userContext, setUserContext] = useContext(UserContext);

    // Localize strings on load
    useEffect(() => {
        setLocalized(localization(displayLang))
    }, [displayLang, setLocalized]);

    // Set default role for user (first role in their roles array)
    useEffect(() => {
        if (document.getElementById(''))
        setRole(allRoles[0])
    }, [allRoles])

    // Load user roles
    useEffect(() => {
        fetch(process.env.REACT_APP_API_ENDPOINT + 'user/roles', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userContext.token}`
            }
        }).then(async response => {
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setAllRoles(data);
            }
        })
    }, [userContext.token]);

    // Load user context
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
        const getAllGroups = ss => {
            const all = [];
            for (const s of ss) {
                if (!all.includes(s.group)) all.push(s.group);
            }
            return all;
        }
        
        axios
            .get('/sentence')
            .then(allSentences => {
                setSentences(allSentences.data);
                setAllGroups(getAllGroups(allSentences.data));
            })
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
    if (role === 'translator' && !showTranslatedSentences) {
        sentencesToShow = sentencesToShow.filter(sentence => !isTranslated(sentence));
    } else if (role === 'glosser') {
        sentencesToShow = sentencesToShow.filter(sentence => isTranslated(sentence));
    }
    if (group) {
        sentencesToShow = sentencesToShow.filter(sentence => sentence.group === group);
    }

    return (
        <div className='workspace'>
            <div id='settings-card' className='workspace-card workspace-card-body' style={{marginBottom:'20px'}}>
                <p><strong>{localized.SETTINGS}</strong></p>
                <div style={{display:'flex', marginTop:'10px'}}>
                    <div style={{flex: 1}}>
                        <p style={{marginBottom: '5px'}}>User Role:</p>
                        <HTMLSelect onChange={e => setRole(e.target.value)}>
                            {allRoles.map(r => <option key={r} value={r}>{localized[r.toUpperCase()]}</option>)}
                        </HTMLSelect>
                    </div>
                    <div style={{flex: 1}}>
                        <p style={{marginBottom: '5px'}}>{localized.DISPLAY_LANGUAGE}</p>
                        <HTMLSelect onChange={e => setDisplayLang(e.target.value)}>
                            <option value='eng'>{localized.ENGLISH}</option>
                            <option value='fre'>{localized.FRENCH}</option>
                        </HTMLSelect>
                    </div>
                    <div style={{flex: 1}}>
                        <p style={{marginBottom: '5px'}}>{localized.TARGET_LANGUAGE}</p>
                        <HTMLSelect onChange={e => setTargetLang(e.target.value)}>
                            <option value='oji'>{localized.OJIBWE}</option>
                        </HTMLSelect>
                    </div>
                </div>
                <div style={{marginTop: '20px'}}><strong>{localized.ADDITIONAL_OPTIONS}</strong></div>
                <div style={{display:'flex', marginTop:'10px'}}>
                    <div style={{flex: 1}}>
                        <p style={{marginBottom: '5px'}}>{localized.SHOW_GROUP}:</p>
                        <HTMLSelect onChange={e => setGroup(e.target.value)}>
                            <option value=''>All</option>
                            {allGroups.map(g => <option key={g} value={g}>{g}</option>)}
                        </HTMLSelect>
                    </div>
                    <div style={{flex: 1}}>
                        <Checkbox 
                            checked={showTranslatedSentences} 
                            label={localized.SHOW_TRANSLATED_SENTENCES}
                            onChange={e => setShowTranslatedSentences(!showTranslatedSentences)}
                        />
                    </div>
                </div>
            </div>
            {/* Sentence Cards */}
            {sentencesToShow.map((s, n) => {
                if (role === 'translator') {
                    return (
                    <TranslatorCard 
                        key={s._id} 
                        sentence={s.text[displayLang]}
                        isTranslated={isTranslated(s)}
                        sentenceId={s._id}
                        lang={targetLang}
                        sentenceObject={s}
                        updateSentence={updateSentence}
                        displayLang={displayLang}   
                    />
                    )
                } else if (role === 'glosser') {
                    return (
                        <GlosserCard 
                            key={s._id}
                            sentenceObj={s}
                            displayLang={displayLang}
                            lang={targetLang}
                            userContext={userContext}
                            n={n}
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