import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import DataTypeToggle from './DataTypeToggle'

function MetaPanel() {

    let dispatch   = useDispatch()
    let metaFields = useSelector(state => {
        if(state.parsedMeta && state.parsedMeta.expandedMetaFields){
            return state.parsedMeta.expandedMetaFields
        } else {
            return {}
        }
    })

    let metaJSX = (
        <div>
            Nessun dataset caricato
        </div>
    )

    if( Object.keys(metaFields).length > 0 ){
        metaJSX = []
        for(let metaField in metaFields) {
            metaJSX.push(
                <ExpansionPanel key={metaField}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        {metaField}

                        <DataTypeToggle varName={metaField} />

                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {metaFields[metaField]}
                    </ExpansionPanelDetails>

                </ExpansionPanel>
            )
        }
    }

	return (
		<div>
            {metaJSX}
        </div>
	)
}

export default MetaPanel
