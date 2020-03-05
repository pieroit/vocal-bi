
import { NlpManager } from 'node-nlp-rn'
import trainingData from './it.json'

class LanguageManager {

    constructor() {

        this.language = 'it'

        let engineConfig = {
            languages: [this.language],
            keepStopwords: true,
            useNoneFeature: false
        }

        this.NLP = new NlpManager(engineConfig)
    }

    async train() {

        // TODO: load a pretrained model!
        let intents = trainingData['intents']
        for( let intent in intents ) {
            //console.log('training', intent)
            for( let utterance of intents[intent]['utterances'] ) {
                //console.log(this.language, utterance, intent)
                this.NLP.addDocument(this.language, utterance, intent)
            }
        }

        await this.NLP.train()
        //console.log(this.NLP)
    }

    addEntities(slotName, slotValues) {

        for( let slotValue of slotValues ) {
            this.NLP.nerManager.addNamedEntityText(
                slotName,           // slot name
                slotValue,          // slot value
                [ this.language ],
                [ slotValue ]       // synonyms
            )
        }
    }

    async parse(utterance) {

        // find entities
        let entities = this.NLP.nerManager.findNamedEntities( utterance, this.language )

        // manually substitute entities to simplify classification
        for( let ent of entities ) {
            //console.log(ent)
            utterance = utterance.replace(ent.utteranceText, '')
        }

        // classify
        let parsed = await this.NLP.process(this.language, utterance)

        // remove None category
        let intent = parsed.intent
        if( intent == 'None') {
            intent = parsed.classifications[1]['label']
        }

        return {
            info: parsed,
            entities,
            intent
        }
    }

}

export default LanguageManager