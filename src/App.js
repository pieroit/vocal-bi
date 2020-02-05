import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { NerManager } from 'node-nlp-rn'

import reducer from './reducer'
import VoiceBar from './VoiceBar'
import CSVDropZone from './CSVDropZone'
import MetaPanel from './MetaPanel'
import MainChart from './MainChart'
//import initialState from './initialStateDev'

window.vocalBIglobals = {
	nerEngine: new NerManager({ languages: ['it'], threshold: 0.8 })
}


function App() {

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
				<VoiceBar />
				<MetaPanel />
				<MainChart />
				<CSVDropZone />
			</div>
		</Provider>
	);
}

export default App
