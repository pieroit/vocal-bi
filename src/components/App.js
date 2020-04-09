import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'

import {
	AppBar, Toolbar,
} from '@material-ui/core'
import {
	Settings as SettingsIcon,
	Publish as PublishIcon,
	Info as InfoIcon,
	//BarChart as BarChartIcon,
	Visibility as EyeIcon
} from '@material-ui/icons'

import LanguageManager from '../nlp/LanguageManager'
import reducer from '../reducer'
import Page from './Page'
import VoiceBar from './VoiceBar'
import Footer from './Footer'
import CSVDropZone from './CSVDropZone'
import MetaPanel from './MetaPanel'
import MainViz from './MainViz'
import Help from './Help'
import initialState from './../initialState'


// prepare NLP
window.languageManager = new LanguageManager()

// necessary when redux state is loaded via ajax
if(initialState.parsedData) {
	// train NER model to recognize column names
	window.languageManager.addEntities('variabile', initialState.parsedMeta.fields)
}


let App = () => {

	let logger = createLogger({
		collapsed: true,
		diff: true
	})
	let storeMiddleware = applyMiddleware(logger)
	let store = createStore(reducer, initialState, storeMiddleware)

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
			'component': <MainViz />,
			'icon': <EyeIcon />
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
