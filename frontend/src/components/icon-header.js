import React from 'react';

const IconHeader = ({ hasTranslation, hasRecording }) => {
    return (
        <div>
            <div className={`tooltip ${hasRecording ? 'tooltip-clickable' : 'tooltip-normal'}`}>
                {hasRecording ? '🔈' : '🔇'}
                <span className='tooltip-text'>
                    {hasRecording ? 'Recording\xA0Available\xA0(click\xA0to\xA0play)' : 'No\xA0Recording'}
                </span>
            </div>
            <div className='tooltip tooltip-normal'>
                {hasTranslation ? '📝' : ''}
                {hasTranslation && <span className='tooltip-text'>Translated</span>}
            </div>
        </div>
    )
}

export default IconHeader;