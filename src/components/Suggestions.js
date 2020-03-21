
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'

let Suggestions = (props) => {

    let vizMetadata = useSelector(state => state.parsedMeta)

    let listOfColumnsJSX = _.map( vizMetadata.expandedMetaFields, (v, k) => {
        return (
            <li key={k}>
                {k} ({v})
            </li>
        )
    })

    return (
        <div>
            <ul>
                {listOfColumnsJSX}
            </ul>
        </div>
    )
}

export default Suggestions

