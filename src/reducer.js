
let reducer = ( state={}, action ) => {
    
    let newState = state

    switch(action.type) {
        case 'DATA-LOADED':
            newState = {
                ...state,
                parsedData: action.parsedCSV.data,
                parsedMeta: action.parsedCSV.meta,
            }
    }

    console.warn('Action', action)
    console.warn('New state', newState)
    return newState
}

export default reducer