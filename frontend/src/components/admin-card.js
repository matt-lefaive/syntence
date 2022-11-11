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

    return (
        <div className='workspace-card'>
            <div className='workspace-card-body'>
                {error && <Callout intent='danger'>{error}</Callout>}
            
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <div style={{marginBottom: '5px'}}>
                            {`${localized.IMPORT_SENTENCES} (.csv):`}
                        </div>
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
                        <div style={{marginBottom: '5px'}}>&nbsp;</div>
                        <Button 
                            intent='primary'
                            fill
                            text={localized.IMPORT_SENTENCES}
                            disabled={_.isEmpty(columns)}
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