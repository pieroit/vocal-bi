

import LanguageManager from './LanguageManager'
import trainingData from './it.json'
const fs = require('fs');

it('Saves model after trainign', async () => {
    
    let nlp = new LanguageManager()
    await nlp.train(trainingData)
    let res = await nlp.parse('che vita de merda')
    let model = nlp.NLP.export()
    fs.writeFileSync(__dirname + '/model.json', model)
})