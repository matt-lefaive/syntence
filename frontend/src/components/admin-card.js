import React, { useState } from 'react';
import { Callout, Button } from '@blueprintjs/core';
import Papa from 'papaparse';
import CSVTable from './csv-table';
import _ from 'lodash';
import localization from '../Localization/localization';

const AdminCard = ({ displayLang }) => {
    const [error, setError] = useState('');
    const [filename, setFilename] = useState('Choose CSV...');
    const [columns, setColumns] = useState({});

    const localized = localization(displayLang);

    const handleOnFileChange = e => {
        setFilename(e.target.value.replace('C:\\fakepath\\', ''))
        setColumns({});

        if (e.target.files) {
            // Read in CSV file
            Papa.parse(e.target.files[0], {
                header: true,
                skipEmptyLines: true,
                complete: results => {
                    if (results.data) {
                        const headers = Object.keys(results.data[0]);
                        const values = {}
                        headers.forEach(h => {
                            values[h] = [];
                        })

                        results.data.forEach(d => {
                            headers.forEach(h => {
                                values[h].push(d[h]);
                            })
                        });

                        setColumns(values);
                    }
                }
            })
        }
    }

    const handleOnImportClick = e => {
        // Turn the columns into sentence objects to upload
        setError('');
        if (!_.isEmpty(columns)) {
            const sentences = [];
            const headers = Object.keys(columns);
            for (let i = 0; i < columns['group'].length; i++) {
                const newSentence = {group: columns['group'][i], text: {}};
                headers.forEach((h, j) => {
                    if (j > 0) newSentence.text[h] = columns[h][i]
                })
                sentences.push(newSentence);
            }
            
            fetch(process.env.REACT_APP_API_ENDPOINT + `sentence/multi/new`, {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({sentences: sentences})
            }).then(async response => {
                if (!response.ok) {
                    setError('Error importing sentences.');
                } else {
                    window.location.reload();
                }
            })
        }
    }

    return (
        <div className='workspace-card'>
            <div className='workspace-card-body'>
                {error && <Callout intent='danger'>{error}</Callout>}
            
                <div style={{marginBottom: '5px'}}>
                    {`${localized.IMPORT_SENTENCES} (.csv):`}
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <form>
                            <label className="bp4-file-input .modifier">
                                <input 
                                    type='file' 
                                    id='csv-upload' 
                                    name='csv-upload'
                                    accept='.csv'
                                    onChange={handleOnFileChange}
                                />
                                <span className="bp4-file-upload-input">{filename}</span>
                            </label>
                        </form>
                    </div>
                    <div>
                        <Button 
                            intent='primary'
                            fill
                            text={localized.IMPORT_SENTENCES}
                            disabled={_.isEmpty(columns)}
                            onClick={handleOnImportClick}
                        />
                    </div>
                </div>

                {/* Display sentences to import to user */}
                {!_.isEmpty(columns) && <CSVTable columns={columns}/>}
            </div>
        </div>
    )
}

export default AdminCard;