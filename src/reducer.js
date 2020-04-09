
/**
 * function used by the reducer to reset plot
 */
let resetPlot = (newState) => {
    newState.variableOnXaxis = undefined
    newState.variableOnYaxis = undefined
    newState.variableOnColorAxis = undefined
    newState.showDistribution = false
    return newState
}


/**
 * Redux reducer
 * @param {*} state 
 * @param {*} action 
 */
let reducer = ( state={}, action ) => {
    
    let newState = {
        ...state
    }

    switch(action.type) {

        case 'CHANGE_PAGE':
            newState.currentPage = action.toPage
            break
        
        case 'DATA_LOADED':

            newState.parsedData  = action.parsedCSV.data
            newState.parsedMeta  = action.parsedCSV.meta
            newState.currentPage = "Home"
            break

        case 'PARSED_INTENT':

            let intent   = action.body.intent
            let entities = action.body.entities

            // reset X and Y axis
            if( ['reset_plot', 'show_relation', 'show_distribution'].includes(intent) ){
                newState = resetPlot(newState)
                newState.currentPage = 'Home'
            }

            if( intent == 'show_relation' ) {
                newState.showDistribution = false
            }
            if( intent == 'show_distribution' ) {
                newState.showDistribution = true
            }
            if( intent == 'group_by' ) {
                newState.variableOnColorAxis = entities[0].option
                break   // TODO: not elegant at all
            }
            if( intent == 'switch_axis' ) {
                let tmp = newState.variableOnYaxis
                newState.variableOnYaxis = newState.variableOnXaxis
                newState.variableOnXaxis = tmp
                break   // TODO: not elegant at all
            }

            let foundVariabile = 0
            for( let ent of entities){
                if(ent.entity == 'variabile'){
                    if(foundVariabile == 0) {
                        newState.variableOnXaxis = ent.option
                        foundVariabile++
                    } else {
                        newState.variableOnYaxis = ent.option
                    }

                }

            }

            break

        case 'CHANGE_DATA_TYPE':
            newState.parsedMeta.expandedMetaFields[action.fieldName] = action.fieldType
            break

        default:
            console.warn(`Action ${action.type} unknonwn`)
    }

    return newState
}

export default reducer