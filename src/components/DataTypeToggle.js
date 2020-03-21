import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails
} from '@material-ui/core'
import {
    ToggleButton,
    ToggleButtonGroup
} from '@material-ui/lab'
import {
    Category as CategoryIcon,
    QueryBuilder as TimeIcon,
    SquareFoot as ScaleIcon
} from '@material-ui/icons'
import _ from 'lodash'


let allTypes = {
    'number': {
        'icon'    : ScaleIcon,
        'text'    : "Variabile a scala",
        'disabled': false
    },
    'category': {
        'icon'    : CategoryIcon,
        'text'    : "Variabile nominale",
        'disabled': false
    },
    'time': {
        'icon'    : TimeIcon,
        'text'    : "Variabile temporale",
        'disabled': true
    }
}


let DataTypeToggle = (props) => {

    let dispatch   = useDispatch()
    let varName    = props.varName
    let varType    = useSelector(state => {
        return state.parsedMeta.expandedMetaFields[varName]
    })

    let typeInfo = allTypes[varType]

    let handleChange = (e, v) => {
        e.stopPropagation()
        if(v){
            dispatch({
                type: 'CHANGE_DATA_TYPE',
                fieldName: varName,
                fieldType: v
            })
        }
    }

    let buttonsJSX = _.map(allTypes, (v, k) => {

        let Icon = v.icon
        return (
            <ToggleButton
                key={k}
                value={k}
                disabled={v.disabled}
            >
                <Icon />
            </ToggleButton>
        )
    })
    
    return (
        <ToggleButtonGroup
            exclusive
            size='small'
            value={varType}
            onChange={handleChange}
        >
            {buttonsJSX}
        </ToggleButtonGroup>
    )
}

export default DataTypeToggle
