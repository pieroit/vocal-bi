

import React, { useState } from 'react'
import {
	BottomNavigation, BottomNavigationAction
 } from '@material-ui/core'


let Navigation = (props) => {

    let [currentTab, setCurrentTab] = useState(1)

    let changeTab = (event, newValue) => {
        setCurrentTab(newValue)
    }

    let style = {
        width: '100%',
        position: 'fixed',
        bottom: 0
    }

    let pagesJSX = props.pages.map((p, index) => {
        return (
            <BottomNavigationAction key={index} label={p.label} value={index} icon={p.icon} />
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

