import React from 'react'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { VictoryChart, VictoryAxis, VictoryGroup } from 'victory'
import { VictoryBar, VictoryPie, VictoryLine, VictoryScatter } from 'victory'
import { dropUndefined } from './functions'

// TODO: move this function in another file
let detectTypeOfPlot = (variablesAxis, variablesTypes, isDistribution) => {
	
	console.log(variablesAxis, variablesTypes, isDistribution)
	let typeOfX = variablesTypes[variablesAxis.x]
    let typeOfY = variablesTypes[variablesAxis.y]
    let distributionOrRelation = ( isDistribution ? 'distribution' : 'relation' )

	// top level keys are distribution vs relation, then x types, then y types  
    let plotTypeTree = {
        'distribution': {
            'number'   : {
                'number'   : {
                    'plotType': VictoryScatter // Histogram
                },
                'category' : {
                    'plotType': VictoryBar,
                    'horizontal': true
                }
            },
            'category' : {
                'number'   : {
                    'plotType': VictoryBar
                },
                'category' : {
                    'plotType': VictoryBar//VictoryGroup
                }
            }
        },
        'relation': {
            'number'   : {
                'number'   : {
                    'plotType': VictoryScatter
                },
                'category' : {
                    'plotType'  : VictoryBar,
                    'horizontal': true,
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

let aggregateData = () => {
    // make counts where distributions are asked
    // TODO: should run also for bar plots, with metric instead of count
    /*
    if(vizIsDistribution){
        // TODO: counts should be outside of here
        let valueCounts = _.countBy( vizData, vizX )
        vizDataWithoutUndefined = []
        for(let k in valueCounts){
            vizDataWithoutUndefined.push({
                [vizX] : k,
                'metric' : valueCounts[k]
            })
        }
        console.log(vizDataWithoutUndefined)
        // TODO: joint distributions

    }
    */
}

function MainChart() {

    let vizData     = useSelector(state => state.parsedData)
    let vizMetadata = useSelector(state => state.parsedMeta)
    let vizX        = useSelector(state => state.variableOnXaxis)
    let vizY        = useSelector(state => state.variableOnYaxis)
    let vizIsDistribution = useSelector(state => state.showDistribution)

    if(!vizData) {
        return (
            <div>Please upload a CSV (maybe demo here?)</div>
        )
    }
    
    let axisVariables = {
        x: vizX,
        y: vizY
    }
    console.log(axisVariables)

    if(!vizX) {
        // TODO: put here example instructions component
        return (
            <h1>Puoi dire mostra ....</h1>
        )
    }

    // clean data dropping records where required variables are undefined
    let vizDataWithoutUndefined = dropUndefined(vizData, Object.values(axisVariables))

    // detect required type of chart
    // TODO: should take into account explicitly requested type
    let detectedTypeOfPlot = detectTypeOfPlot(axisVariables, vizMetadata.expandedMetaFields, vizIsDistribution)
    let ChartType  = detectedTypeOfPlot.plotType
    let horizontal = detectedTypeOfPlot.horizontal || false
    let metric     = detectedTypeOfPlot.metric
    console.log(detectedTypeOfPlot)

    // TODO: run metric
    if(metric){
        ////// WORK HERE ///////
        vizDataWithoutUndefined = aggregateData()
    }

    // TODO: grouping, sorting
    
    return (
        <div>
            <VictoryChart>
                <VictoryAxis label={axisVariables['x']} />
                <VictoryAxis dependentAxis label={axisVariables['y']} />
                
                <ChartType
                    data={vizDataWithoutUndefined}
                    horizontal={horizontal}
                    {...axisVariables}
                />
            </VictoryChart>
        </div>
    )
}

export default MainChart