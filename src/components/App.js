import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import LanguageManager from '../nlp/LanguageManager'
import reducer from '../reducer'
import VoiceBar from './VoiceBar'
import CSVDropZone from './CSVDropZone'
import MetaPanel from './MetaPanel'
import MainChart from './MainChart'
//import initialState from './initialStateDev'

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
