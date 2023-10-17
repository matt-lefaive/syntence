import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AudioRecorder } from 'react-audio-voice-recorder';

const VoiceRecorder = ({ lang, sentenceId }) => {
    const [audioToSave, setAudioToSave] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);

    const addAudioElement = blob => {
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        const audio = document.createElement('audio');
        audio.src = url;
        audio.controls = true;
        const audioDiv = document.getElementById(`audio-div-${lang}-${sentenceId}`);
        audioDiv.innerHTML = '';
        audioDiv.appendChild(audio);
        setAudioToSave(true);
    }

    const uploadAudioFileOnClick = () => {
        if (audioBlob) {
            let file = new File([audioBlob], `.webm`, {type: 'video/webm', lastModified: new Date().getTime()});
            let container = new DataTransfer();
            container.items.add(file);
            const fileInput = document.querySelector(`.file-input-${lang}-${sentenceId}`);
            if (fileInput) {
                fileInput.files = container.files;
                document.getElementById(`filename-${lang}-${sentenceId}`).innerHTML = `${lang}-${sentenceId}-.webm`;
            }
        }
    }

    return (
        <div style={{display: 'flex'}}>
            {audioToSave && <button type='button' className='btn-upload-audio-file' id='upload-audio-file' onClick={uploadAudioFileOnClick}>⬆</button>}
            <AudioRecorder 
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true
                }}
                downloadOnSavePress={false}
                downloadFileExtension='webm'
            />
        </div>
    )

}

export default VoiceRecorder;