
import { NlpManager } from 'node-nlp-rn'
import savedModel from './model.json'

class LanguageManager {

    constructor() {

        this.language = 'it'

        let engineConfig = {
            languages: [this.language],
            keepStopwords: true,
            useNoneFeature: false
        }

        // build classifier
        this.NLP = new NlpManager(engineConfig)
        
        // TODO: is the above config necessary?
        // TODO: Load from file should be in another method (import gets always called otherwise!)
        // TODO: fix loop between training and predicting
        // load pretrained model from JSON
        this.NLP.import(savedModel)

        console.log(this.NLP)
    }

    // this is not run in the browser, only from the command line "npm run train"
    async train(trainingData) {

        let intents = trainingData['intents']
        for( let intent in intents ) {
            //console.log('training', intent)
            for( let utterance of intents[intent]['utterances'] ) {
                //console.log(this.language, utterance, intent)
                this.NLP.addDocument(this.language, utterance, intent)
            }
        }

        await this.NLP.train()
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
        console.log('ENTITIES', entities)

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