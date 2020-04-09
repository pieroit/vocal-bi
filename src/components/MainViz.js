import React from 'react'
import _ from 'lodash'
import DataFrame from 'dataframe-js'
import { useSelector } from 'react-redux'
import {
    VictoryChart, VictoryAxis, VictoryLabel, VictoryGroup, VictoryLegend,
    VictoryBar, VictoryPie, VictoryLine, VictoryScatter
} from 'victory'

import Suggestions from './Suggestions'
import { dropUndefined } from '../functions'
import composeChartFromState from '../composeChartFromState'
import {
    aggregateDataForDistributionPlot,
    aggregateDataForRelationPlot,
    createColorColumn
} from '../plotDataPrep'

function MainViz() {

    let vizData = useSelector(state => state.parsedData)
    let vizMetadata = useSelector(state => state.parsedMeta)
    let vizX = useSelector(state => state.variableOnXaxis)
    let vizY = useSelector(state => state.variableOnYaxis)
    let vizColor = useSelector(state => state.variableOnColorAxis)
    let vizIsDistribution = useSelector(state => state.showDistribution)

    if (!vizData) {
        return (
            <div>Please upload a CSV (maybe try the demo below?)</div>
        )
    }

    let axisVariables = {
        x: vizX,
        y: vizY,
        c: vizColor,
    }

    if (!vizX) {
        // TODO: put here example instructions component
        return (
            <Suggestions />
        )
    }

    console.log(vizData)

    // convert to DataFrame
    let vizDataFrame = new DataFrame(vizData)

    // take from data subset of columns we are interested in
    let variablesOfInterest = _.compact(Object.values(axisVariables))
    let vizSelectedData = vizDataFrame.select(...variablesOfInterest)

    // clean data dropping records where required variables are undefined
    let vizCleanData = vizSelectedData.dropMissingValues()

    // detect required type of chart
    // TODO: should take into account explicitly requested type
    let detectedTypeOfPlot =
        composeChartFromState(axisVariables, vizMetadata.expandedMetaFields, vizIsDistribution)
    let ChartType = detectedTypeOfPlot.plotType
    let horizontal = detectedTypeOfPlot.horizontal || false
    let metric = detectedTypeOfPlot.metric

    // Aggregate data if necessary
    if (metric) {
        if (vizIsDistribution) {
            vizCleanData = aggregateDataForDistributionPlot(vizCleanData, axisVariables, metric)
            axisVariables['y'] = metric['metricType']
        } else {
            vizCleanData = aggregateDataForRelationPlot(vizCleanData, axisVariables, metric)
        }
    }

    // assign color palette
    if (vizColor) {
        vizCleanData = createColorColumn(vizCleanData, vizColor, vizMetadata)
    }

    console.warn(vizCleanData)

    // TODO: sorting

    // extract raw data from dataframe
    vizCleanData = vizCleanData.toCollection()

    console.log('DISTRIBUTION', vizIsDistribution)
    console.log('VARIABLES', axisVariables)
    console.log('AGGREGATION', axisVariables, metric)
    console.log('COLORING', axisVariables['c'])
    console.log('PLOT', detectedTypeOfPlot)
    console.log('DATA', vizCleanData)
    console.log('DATA X', _.uniq(_.map(vizCleanData, axisVariables['x'])))
    console.log('DATA Y', _.uniq(_.map(vizCleanData, axisVariables['y'])))
    console.log('AGGREGATED DATA', vizCleanData)


    return (
        <div>
            <VictoryChart
                domainPadding={50}
                padding={80}
                height={window.innerHeight * 0.7}
            >

                <VictoryAxis
                    label={axisVariables['x']}
                    tickLabelComponent={<VictoryLabel angle={-80} textAnchor={'end'} />}
                    style={{
                        axisLabel: { padding: 60 }
                    }}
                />

                <VictoryAxis
                    dependentAxis
                    label={axisVariables['y']}
                    style={{
                        axisLabel: { padding: 50 }
                    }}
                />

                <ChartType
                    data={vizCleanData}
                    horizontal={horizontal}
                    {...axisVariables}

                    style={{
                        data: {
                            fill: ({ datum }) => {
                                if (vizColor) {
                                    return datum.color
                                } else {
                                    return 'darkblue'
                                }
                            }
                        }
                    }}
                />

                <VictoryLegend
                    padding={100}
                    orientation="horizontal"
                    data={[
                        { name: "One", symbol: { fill: "tomato", type: "star" } },
                        { name: "Two", symbol: { fill: "orange" } },
                        { name: "Three", symbol: { fill: "gold" } }
                    ]}
                />

            </VictoryChart>
        </div>
    )
}

export default MainViz