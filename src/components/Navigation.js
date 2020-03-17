

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import {
	BottomNavigation, BottomNavigationAction
 } from '@material-ui/core'


let Navigation = (props) => {

    let currentTab = useSelector(state => state.currentPage)
    let dispatch   = useDispatch()

    let changeTab = (event, goToPage) => {
        dispatch({
            type   : 'CHANGE_PAGE',
            toPage : goToPage
        })
    }

    let style = {
        width: '100%',
        position: 'fixed',
        bottom: 0
    }

    let pagesJSX = _.map(props.pages, (p, label) => {
        return (
            <BottomNavigationAction key={label} label={label} value={label} icon={p.icon} />
        )
    })

    return (
        <div>
            <div>
                {props.pages[currentTab].component}
            </div>
            <BottomNavigation
                value={currentTab}
                onChange={changeTab}
                style={style}
                position='fixed'
            >
                {pagesJSX}
            </BottomNavigation>

        </div>
    )
}

export default Navigation

