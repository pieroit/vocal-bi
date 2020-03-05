
import LanguageManager from './LanguageManager'

// prepare language NER and classifier
let nlp = new LanguageManager()

// train classifier
let trainNLPforTests = async () => {
    
    await nlp.train()

    // entities can be added AFTER classifier training
    nlp.addEntities( 'variabile', ['sesso', 'età', 'prezzo', 'densità abitativa'] )
}

it('Trains intent classifier', async () => {

    await trainNLPforTests()
    
    let res = await nlp.parse('fammi vedere la distribuzione del sesso')
    expect(res.intent).toBe('show_distribution')
    expect(res.entities.length).toBeGreaterThan(0)
    expect(res.entities[0].option).toBe('sesso')
    
    res = await nlp.parse("nuovo grafico")
    expect(res.intent).toBe('reset_plot')
}) 

it('Extracts two entities of the same type', async () => {
    
    let res = await nlp.parse('Prezzo rispetto a densita Abitativa')
    expect(res.intent).toBe('show_relation')
    expect(res.entities[0].option).toBe('prezzo')
    expect(res.entities[1].option).toBe('densità abitativa')
})