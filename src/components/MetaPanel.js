import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

function MetaPanel() {

    let dispatch   = useDispatch()
    let metaFields = useSelector(state => {
        if(state.parsedMeta && state.parsedMeta.expandedMetaFields){
            return state.parsedMeta.expandedMetaFields
        } else {
            return {}
        }
    })

    let metaJSX = []
    for(let metaField in metaFields) {
        metaJSX.push(
            <div key={metaField}>
                <span>{metaField}: </span><span>{metaFields[metaField]}</span>
            </div>
        )
    }


	return (
		<div>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            {metaJSX}
        </div>
	)
}

export default MetaPanel
