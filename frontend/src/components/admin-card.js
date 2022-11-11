import React, { useState } from 'react';
import { Callout } from '@blueprintjs/core';

const AdminCard = () => {
    const [error, setError] = useState('');
    const [filename, setFilename] = useState('Choose CSV...');

    return (
        <div className='workspace-card'>
            <div className='workspace-card-body'>
                {error && <Callout intent='danger'>{error}</Callout>}
            
                <div style={{display: 'flex'}}>
                    <div>
                        <div style={{marginBottom: '5px'}}>
                            Upload Sentence Spreadsheet (.csv):
                        </div>
                        <form>
                            <label className="bp4-file-input .modifier">
                                <input 
                                    type='file' 
                                    id='csv-upload' 
                                    onChange={e => setFilename(e.target.value.replace('C:\\fakepath\\', ''))}
                                />
                                <span className="bp4-file-upload-input">{filename}</span>
                            </label>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminCard;