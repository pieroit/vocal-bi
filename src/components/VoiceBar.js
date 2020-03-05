
import React from "react"
import { useDispatch } from "react-redux"
import axios from "axios"
import SpeechRecognition from "react-speech-recognition"
import { substituteStringAtIndexes } from "../functions"

let oldTranscript = '#token#'

const VoiceBar = (props) => {

    let dispatch = useDispatch()
    
    let {
            transcript,
            resetTranscript,
            browserSupportsSpeechRecognition
    } = props

    if (!browserSupportsSpeechRecognition) {
        alert('Your browser does not support speech recognition')
        return null;
    }

    // timer to detect end of utterance
    setTimeout( async ()=> {
        if(transcript == oldTranscript){

            let parsedCommand = await window.languageManager.parse(transcript)

            // reset utterance tracker
            oldTranscript = '#token#'
            resetTranscript()

            dispatch({
                type: 'PARSED_INTENT',
                body: parsedCommand
            })
        }
        
    }, 1000)

    if(transcript !== ''){
        oldTranscript = transcript
    }
    

    return (
        <div>
            {/*<button onClick={resetTranscript}>Reset</button>*/}
            <span>MIC: {transcript}</span>
        </div>
    )
}

export default SpeechRecognition(VoiceBar);