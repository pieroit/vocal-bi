
import _ from 'lodash'
import { histogram as d3Histogram } from 'd3-array'

export const aggregateDataForDistributionPlot = (dataToBeAggregated, variablesAxis, aggregationMetric) => {

    let x = variablesAxis['x']
    let y = variablesAxis['y']
    // TODO: should this work with colors?
    let metricType   = aggregationMetric['metricType']
    let metricOnAxis = aggregationMetric['metricOnAxis']
    let metricOnVariable = variablesAxis[metricOnAxis] // TODO: metricOnAxis can be an array in some cases
    let groupingVariable  = metricOnVariable

    // first, group data
    let groups
    if(metricType == 'histogram'){
        let histGenerator = d3Histogram()
            .value( (d) => d[groupingVariable] )
            .thresholds(10)

        let bins = histGenerator(dataToBeAggregated)
        console.log(bins)
        groups = {}
        bins.map( (b) => {
            let groupName = `${b.x0}-${b.x1}`
            delete b.x0
            delete b.x1
            groups[groupName] = b
        })
    } else {
        groups = _.groupBy(dataToBeAggregated, groupingVariable)
    }

    console.warn(groupingVariable, groups)

    // ... then, run metric on each group
    let aggregatedData = []
    for( let g in groups ){
        // extract values for the group
        let groupValues = _.map( groups[g], metricOnVariable )
        
        // run aggregation function
        let groupAggregatedValue = groupValues.length
        
        // save data point
        aggregatedData.push({
            [groupingVariable] : g,
            [metricType]       : groupAggregatedValue
        })
    }

    console.log('GROUPED', aggregatedData)
    return aggregatedData
}

export const aggregateDataForRelationPlot = (dataToBeAggregated, variablesAxis, aggregationMetric) => {

    // ASSUMING x AND y ARE DEFINED
    let x = variablesAxis['x']
    let y = variablesAxis['y']
    let c = variablesAxis['c']
    let metricType   = aggregationMetric['metricType']
    let metricOnAxis = aggregationMetric['metricOnAxis']
    let metricOnVariable = variablesAxis[metricOnAxis] // TODO: metricOnAxis can be an array in some cases
    let groupingVariable  = y
    if( metricOnAxis == 'y' ) {
        groupingVariable = x
    }

    // first, group data
    let groups = _.groupBy(dataToBeAggregated, groupingVariable)
    console.log(groupingVariable, groups)

    // ... then, run metric on each group
    let aggregatedData = []
    for( let g in groups ){
        // extract values for the group
        let groupValues = _.map( groups[g], metricOnVariable )
        
        // run aggregation function
        let groupAggregatedValue
        if(metricType == 'count') {
            groupAggregatedValue = groupValues.length
        } else if(metricType == 'sum') {
            groupAggregatedValue = _.sum(groupValues)
        } else if(metricType == 'mean') {
            groupAggregatedValue = _.mean(groupValues)
        } else {
            throw Error(`Metric "${metricType}" not implemented`)
        }
        
        // save data point
        aggregatedData.push({
            [groupingVariable]: g,
            [metricOnVariable]: groupAggregatedValue
        })
    }

    console.log('GROUPED', aggregatedData)
    return aggregatedData
}