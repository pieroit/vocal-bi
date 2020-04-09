// this script is used to train the NLP model
// - edit it.json to update intents
// - run "npm run train" in terminal to launch training

import LanguageManager from './LanguageManager'
import trainingData from './it.json'
const fs = require('fs');

let nlp = new LanguageManager()

nlp.train(trainingData).then((res)=>{

    let model = nlp.NLP.export()
    let modelPath = __dirname + '/model.json'
    fs.writeFileSync(modelPath, model)

    console.log('Model saved as ' + modelPath)
}).catch((err) => {
    console.error(err)
})
