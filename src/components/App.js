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
import Page from './Page'
import VoiceBar from './VoiceBar'
import Footer from './Footer'
import CSVDropZone from './CSVDropZone'
import MetaPanel from './MetaPanel'
import MainChart from './MainChart'
import Help from './Help'
//import initialState from './initialStateDev'

let App = () => {

	let initialState = {
		currentPage: "Upload",
		parsedData: undefined,
		parsedMeta: undefined,
		variableOnXaxis: undefined,
		variableOnYaxis: undefined,
		showDistribution: false
	}
	let store = createStore(reducer, initialState)

	let pages = {
		'Info': {
			'component': <Help />,
			'icon': <InfoIcon />
		},
		'Upload': {
			'component': <CSVDropZone />,
			'icon': <PublishIcon />
		},
		'Home': {
			'component': <MainChart />,
			'icon': <BarChartIcon />
		},
		'Settings': {
			'component': <MetaPanel />,
			'icon': <SettingsIcon />
		},
	}

	return (
		<Provider store={store}>
			<div id='main'>
				
				<div id='header'>
					<AppBar position='sticky'>
						<Toolbar>
							<VoiceBar />
						</Toolbar>
					</AppBar>
				</div>

				<div id='page'>
					<Page pages={pages} />
				</div>

				<div id='footer'>
					<Footer pages={pages} />
				</div>

			</div>
		</Provider>
	);
}

export default App
