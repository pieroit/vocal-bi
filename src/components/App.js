import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import {
	AppBar, Toolbar,
} from '@material-ui/core'
import {
    Settings as SettingsIcon,
    Publish as PublishIcon,
	Info as InfoIcon,
	BarChart as BarChartIcon
} from '@material-ui/icons'

import LanguageManager from '../nlp/LanguageManager'
import reducer from '../reducer'
import Navigation from './Navigation'
import VoiceBar from './VoiceBar'
import CSVDropZone from './CSVDropZone'
import MetaPanel from './MetaPanel'
import MainChart from './MainChart'
//import initialState from './initialStateDev'

let App = () => {

	let initialState = {
		parsedData       : undefined,
		parsedMeta       : undefined,
		variableOnXaxis  : undefined,
		variableOnYaxis  : undefined,
		showDistribution : false
	}
	let store = createStore(reducer, initialState)

	return (
		<Provider store={store}>
			<div>
				
				<AppBar position='sticky'>
					<Toolbar>
						<VoiceBar />
					</Toolbar>
				</AppBar>

				<Navigation pages={[
					{
						'label'    : 'Info',
						'component': <h1>Info</h1>,
						'icon'     : <InfoIcon />
					},
					{
						'label'    : 'Upload',
						'component': <CSVDropZone />,
						'icon'     : <PublishIcon />
					},
					{
						'label'    : 'Home',
						'component': <MainChart />,
						'icon'     : <BarChartIcon />
					},
					{
						'label'    : 'Settings',
						'component': <MetaPanel />,
						'icon'     : <SettingsIcon />
					},
				]}/>
			</div>
		</Provider>
	);
}

export default App
