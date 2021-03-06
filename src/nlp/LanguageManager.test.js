
import LanguageManager from './LanguageManager'

// global to be accessed from tests
let nlp

// train classifier
let trainNLPforTests = async () => {
    
    // prepare language NER and classifier
    nlp = await new LanguageManager()

    // entities can be added AFTER classifier training
    nlp.addEntities( 'variabile', ['sesso', 'età', 'prezzo', 'densità abitativa'] )
}

it('Classifies intents and extracts entities', async () => {

    await trainNLPforTests()
    
    let res = await nlp.parse("nuovo grafico")
    expect(res.intent).toBe('reset_plot')
    
    res = await nlp.parse('fammi vedere la distribuzione del sesso')
    expect(res.intent).toBe('show_distribution')
    expect(res.entities.length).toBeGreaterThan(0)
    expect(res.entities[0].option).toBe('sesso')
    
}) 

it('Extracts two entities from one utterance', async () => {
    
    let res = await nlp.parse('Prezzo rispetto a densita Abitativa')
    expect(res.intent).toBe('show_relation')
    expect(res.entities[0].option).toBe('prezzo')
    expect(res.entities[1].option).toBe('densità abitativa')
})