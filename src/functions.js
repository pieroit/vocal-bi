import Papa from 'papaparse'
import LanguageManager from './nlp/LanguageManager'

export const parseCSVandNotifyStore = (file, dispatch) => {

    console.log('Uploaded file', file)

    Papa.parse(file, {
        download      : typeof(file) === 'string', // good both for forms and urls
        header        : true,
        dynamicTyping : true,
        complete      : (parsedCSV) => {
            //console.log('Parsed CSV', parsedCSV)
            
            // enrich metadata
            parsedCSV.meta.expandedMetaFields = expandParsedMeta(parsedCSV)

            // train NER model to recognize column names
            window.languageManager.addEntities('variabile', parsedCSV.meta.fields)
            
            dispatch({
                type      : 'DATA_LOADED',
                parsedCSV
            })
        }
    })
}

export const expandParsedMeta = (parsedCSV) => {
    
    let samplePoint = parsedCSV.data[0]
    let expandedMetaFields = {}
    for (let field of parsedCSV.meta.fields) {
        if (field != "") {
            if (typeof samplePoint[field] == 'number') {
                expandedMetaFields[field] = 'number'
            } else {
                expandedMetaFields[field] = 'category'
            }
        }
    }
    return expandedMetaFields
}

export const dropUndefined = (data, keys) => {

    let cleanData = []

    for (let d of data) {
        let allKeysAreDefined = true
        for (let k of keys) {
            if (d[k] == undefined) {
                allKeysAreDefined = false
            }
        }
        if (allKeysAreDefined) {
            cleanData.push(d)
        }
    }

    return cleanData
}
