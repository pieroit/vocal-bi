
let reducer = ( state={}, action ) => {
    
    let newState = {
        ...state
    }

    switch(action.type) {
        
        case 'DATA_LOADED':

            newState.parsedData = action.parsedCSV.data
            newState.parsedMeta = action.parsedCSV.meta
            break

        case 'PARSED_INTENT':

            let intent   = action.body.intent

            // reset X and Y axis
            if( ['reset_plot', 'show_relation', 'show_distribution'].includes(intent.name) ){
                newState.variableOnXaxis = undefined
                newState.variableOnYaxis = undefined
            }

            if( intent.name == 'show_relation' ) {
                newState.showDistribution = false
            }
            if( intent.name == 'show_distribution' ) {
                newState.showDistribution = true
            }
            
            let entities = action.body.entities
            for( let ent of entities){
                if(ent.entity == 'x'){
                    newState.variableOnXaxis = ent.columnName
                }
                if(ent.entity == 'y'){
                    newState.variableOnYaxis = ent.columnName
                }
            }

            

            break

        default:
            console.warn(`Action ${action.type} unknonwn`)
    }

    console.warn('Action', action)
    console.warn('New state', newState)
    return newState
}

export default reducer