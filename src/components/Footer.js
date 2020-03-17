

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import {
    BottomNavigation, BottomNavigationAction
} from '@material-ui/core'


let Footer = (props) => {

    let currentTab = useSelector(state => state.currentPage)
    let dispatch = useDispatch()

    let changeTab = (event, goToPage) => {
        dispatch({
            type: 'CHANGE_PAGE',
            toPage: goToPage
        })
    }

    let pagesJSX = _.map(props.pages, (p, label) => {
        return (
            <BottomNavigationAction key={label} label={label} value={label} icon={p.icon} />
        )
    })

    return (
        <BottomNavigation
            value={currentTab}
            onChange={changeTab}
        >
            {pagesJSX}
        </BottomNavigation>
    )
}

export default Footer

