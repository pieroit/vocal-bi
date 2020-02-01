
import React from "react"
import { useDispatch } from "react-redux"
import axios from "axios"
import SpeechRecognition from "react-speech-recognition"
import { substituteStringAtIndexes } from "./functions"

let oldTranscript = '#token#'

const VoiceBar = (props) => {

    let dispatch = useDispatch()
    
    let {
            transcript,
            resetTranscript,
            browserSupportsSpeechRecognition
    } = props

    if (!browserSupportsSpeechRecognition) {
        return null;
    }

    // timer to detect end of utterance
    setTimeout( async ()=> {
        if(transcript == oldTranscript){

            // preprocess utterance recognizing variable names
            let preprocessedTranscript = transcript
            let entities = window.vocalBIglobals.nerEngine.findNamedEntities( transcript, 'it' )
            for( let ent of entities ) {
                console.log(ent)
                // TODO: this does not work because original string changes in length while we substitute
                //preprocessedTranscript = substituteStringAtIndexes(preprocessedTranscript, ent.start, ent.end, 'variabile')
                preprocessedTranscript = preprocessedTranscript.replace(ent.utteranceText, 'variabile')   
            }
            console.warn(transcript)
            console.warn(preprocessedTranscript)
            
            // ajax call to RASA
            let url = 'http://localhost:5005/model/parse'
            let command = await axios.post(url, {
                "text": preprocessedTranscript
            })

            // merge client-extracted entities with server ones
            for(let i=0; i<command.data.entities.length; i++){
                let ent = command.data.entities[i]
                ent.columnName = entities[i].option
            }
            //console.warn( command.data )
            //console.log(entities)

            // reset utterance tracker
            oldTranscript = '#token#'
            resetTranscript()

            dispatch({
                type: 'PARSED_INTENT',
                body: command.data
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