

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'


let Page = (props) => {

    let currentTab = useSelector(state => state.currentPage)

    return (
        <div>
            <div>
                {props.pages[currentTab].component}
            </div>
        </div>
    )
}

export default Page

