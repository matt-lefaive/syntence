import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import TranslatorCard from './translator-card';
import GlosserCard from './glosser-card';
import AdminCard from './admin-card';
import { HTMLSelect, Checkbox, Button } from '@blueprintjs/core';
import _ from 'lodash';

import localization from '../Localization/localization';
import ISO6392Codes from '../Localization/ISO-639-2';

const Workspace = () => {
    const [displayLang, setDisplayLang] = useState('eng');
    const [allTargetLangs, setAllTargetLangs] = useState([]);
    const [targetLang, setTargetLang] = useState('oji');
    const [sentences, setSentences] = useState([]);
    const [showTranslatedSentences, setShowTranslatedSentences] = useState(false);
    const [localized, setLocalized] = useState(localization(displayLang));
    const [ISO6392, setISO6392] = useState(ISO6392Codes(displayLang));
    const [allRoles, setAllRoles] = useState([]);
    const [role, setRole] = useState('');
    const [allGroups, setAllGroups] = useState([]);
    const [group, setGroup] = useState('');

    const [userContext, setUserContext] = useContext(UserContext);

    // Localize strings on load
    useEffect(() => {
        setLocalized(localization(displayLang))
        setISO6392(ISO6392Codes(displayLang))
    }, [displayLang, setLocalized, setISO6392]);

    // Set default role for user (first role in their roles array)
    useEffect(() => {
        setRole(allRoles[0]);
    }, [allRoles])

    // Set default target lang for user (first target lang in their target langs array)
    useEffect(() => {
        setTargetLang(allTargetLangs[0]);
    }, [allTargetLangs]);

    // Load user roles and target langs
    useEffect(() => {
        fetch(process.env.REACT_APP_API_ENDPOINT + 'user/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userContext.token}`
            }
        }).then(async response => {
            if (response.ok) {
                const data = await response.json();

                const pulledRoles = data.roles;
                const pulledTargets = data.targetLangs;

                if (!_.isEqual(_.sortBy(pulledRoles), _.sortBy(allRoles))) {
                    setAllRoles(pulledRoles);
                }

                if (!_.isEqual(_.sortBy(pulledTargets), _.sortBy(allTargetLangs))) {
                    setAllTargetLangs(pulledTargets);
                }
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
            .get(process.env.REACT_APP_API_ENDPOINT + 'sentence')
            .then(allSentences => {
                setSentences(allSentences.data);
                setAllGroups(getAllGroups(allSentences.data));
            })
            .catch(err => {
                console.error(err);
                setSentences([]);
            })
    }, []);

    const logoutHandler = () => {
        fetch(process.env.REACT_APP_API_ENDPOINT + 'user/logout', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userContext.token}`
            }
        }).then(async response => {
            setUserContext(oldValues => {
                return { ...oldValues, details: undefined, token: null }
            })
            window.localStorage.setItem('logout', Date.now())
        })
    }

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
            {/* Logout Button */}
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                <div></div>
                <div style={{maxWidth: '100px'}}>
                    <Button
                        text='Logout'
                        onClick={logoutHandler}
                        fill
                        intent='primary'
                    />
                </div>
            </div>
            
            {/* Settings */}
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
                            {allTargetLangs.map(t => <option key={t} value={t}>{ISO6392[t.toUpperCase()]}</option>)}
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
                        {role === 'translator' && <Checkbox 
                            checked={showTranslatedSentences} 
                            label={localized.SHOW_TRANSLATED_SENTENCES}
                            onChange={e => setShowTranslatedSentences(!showTranslatedSentences)}
                        />}
                        {role !== 'translator' && <Checkbox
                            checked={true}
                            style={{visibility:'hidden'}}
                        />}
                    </div>
                </div>
            </div>

            {/* Admin Card */}
            {role === 'admin' && <AdminCard displayLang={displayLang} />}
            
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