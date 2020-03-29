import _ from 'lodash'
import { VictoryBar, VictoryPie, VictoryLine, VictoryScatter } from 'victory'


let composeChartFromState = (variablesAxis, variablesTypes, isDistribution) => {
	
	console.log('CHART INFO', variablesAxis, variablesTypes, isDistribution)
	let typeOfX = variablesTypes[variablesAxis.x]
    let typeOfY = variablesTypes[variablesAxis.y]
    let distributionOrRelation = ( isDistribution ? 'distribution' : 'relation' )
    console.log(typeOfX, typeOfY, distributionOrRelation)

	// top level keys are distribution vs relation, then x types, then y types  
    let plotTypeTree = {
        'distribution': {
            'number'   : {
                'number'   : {
                    'plotType': VictoryScatter // TODO: Histogram or Density
                },
                'category' : {
                    'plotType': VictoryBar,
                    'horizontal': true
                },
                undefined  : {
                    'plotType'  : VictoryBar,
                    'metric'    : {
                        'metricType': 'histogram',
                        'metricOnAxis': 'x'
                    }
                }
            },
            'category' : {
                'number'   : {
                    'plotType': VictoryBar
                },
                'category' : {
                    'plotType': VictoryBar//VictoryGroup
                },
                undefined: {
                    'plotType': VictoryBar,
                    'metric'    : {
                        'metricType': 'count',
                        'metricOnAxis': 'x'
                    }
                }
            },
        },
        'relation': {
            'number'   : {
                'number'   : {
                    'plotType': VictoryScatter
                },
                'category' : {
                    'plotType'  : VictoryBar,
                    'horizontal': false,
                    'metric'    : {
                        'metricType': 'mean',
                        'metricOnAxis': 'x'
                    }
                },
                undefined  : {
                    'plotType'  : VictoryBar,
                    'metric'    : {
                        'metricType': 'histogram',
                        'metricOnAxis': 'x'
                    }
                } 
            },
            'category' : {
                'number'   : {
                    'plotType': VictoryBar,
                    'metric'    : {
                        'metricType': 'mean',
                        'metricOnAxis': 'y'
                    }
                },
                'category' : {
                    'plotType': VictoryBar,//VictoryGroup
                    'metric'    : {
                        'metricType': 'count',
                        'metricOnAxis': ['x', 'y']
                    }
                },
                undefined: {
                    'plotType': VictoryBar,
                    'metric'    : {
                        'metricType': 'count',
                        'metricOnAxis': 'x'
                    }
                }
            }
        }
	}

	return plotTypeTree[distributionOrRelation][typeOfX][typeOfY]

}

export default composeChartFromState
