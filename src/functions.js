import Papa from 'papaparse'

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
            trainNER(parsedCSV.meta.fields)
            
            dispatch({
                type      : 'DATA_LOADED',
                parsedCSV
            })
        }
    })
}

export const expandParsedMeta = (parsedCSV) => {
    console.log(parsedCSV.meta.fields)
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

export const trainNER = (columnNames) => {

    let nerEngine = window.vocalBIglobals.nerEngine

    columnNames.forEach((c) => {
        nerEngine.addNamedEntityText(
            'variabile',
            c,
            ['it'],
            [c]
        )
    })
}

export const substituteStringAtIndexes = (str, start, end, placeHolder) => {
    return str.substr(0, start) + placeHolder + str.substr(end + 1)
}