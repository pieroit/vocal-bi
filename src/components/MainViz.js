import React from 'react'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { VictoryChart, VictoryAxis, VictoryGroup } from 'victory'
import { VictoryBar, VictoryPie, VictoryLine, VictoryScatter } from 'victory'

import Suggestions from './Suggestions'
import { dropUndefined } from '../functions'
import composeChartFromState from '../composeChartFromState'
import {
    aggregateDataForDistributionPlot,
    aggregateDataForRelationPlot
} from '../plotDataPrep'

function MainViz() {

    let vizData           = useSelector(state => state.parsedData)
    let vizMetadata       = useSelector(state => state.parsedMeta)
    let vizX              = useSelector(state => state.variableOnXaxis)
    let vizY              = useSelector(state => state.variableOnYaxis)
    let vizIsDistribution = useSelector(state => state.showDistribution)

    if(!vizData) {
        return (
            <div>Please upload a CSV (maybe try the demo below?)</div>
        )
    }
    
    let axisVariables = {
        x: vizX,
        y: vizY
    }

    if(!vizX) {
        // TODO: put here example instructions component
        return (
            <Suggestions />
        )
    }

    // clean data dropping records where required variables are undefined
    let variablesOfInterest = _.compact( Object.values(axisVariables) )
    let vizCleanData = dropUndefined(vizData, variablesOfInterest)

    // detect required type of chart
    // TODO: should take into account explicitly requested type
    let detectedTypeOfPlot = 
            composeChartFromState(axisVariables, vizMetadata.expandedMetaFields, vizIsDistribution)
    let ChartType  = detectedTypeOfPlot.plotType
    let horizontal = detectedTypeOfPlot.horizontal || false
    let metric     = detectedTypeOfPlot.metric

    // Aggregate data if necessary
    if(metric){
        if(vizIsDistribution){
            vizCleanData = aggregateDataForDistributionPlot(vizCleanData, axisVariables, metric)
            axisVariables['y'] = metric['metricType']
        } else {
            vizCleanData = aggregateDataForRelationPlot(vizCleanData, axisVariables, metric)
        }
    }

    console.log('DISTRIBUTION', vizIsDistribution)
    console.log('VARIABLES', axisVariables)
    console.log('PLOT', detectedTypeOfPlot)
    console.log('DATA', vizCleanData)
    console.log('DATA X', _.uniq( _.map(vizCleanData, axisVariables['x']) ) )
    console.log('DATA Y', _.uniq( _.map(vizCleanData, axisVariables['y']) ) )
    console.log('AGGREGATED DATA', vizCleanData)

    // TODO: sorting
    
    return (
        <div>
            <VictoryChart
                padding={80}
            >
                
                <VictoryAxis label={axisVariables['x']} />

                <VictoryAxis
                    dependentAxis
                    label={axisVariables['y']}
                    style={{
                        axisLabel: {padding: 50}
                    }}
                />
                
                <ChartType
                    data={vizCleanData}
                    horizontal={horizontal}
                    {...axisVariables}
                    
                />
            </VictoryChart>
        </div>
    )
}

export default MainViz