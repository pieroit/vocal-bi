
import _ from 'lodash'

export const aggregateDataForDistributionPlot = (dataToBeAggregated, variablesAxis, aggregationMetric) => {
    ////// WORK HERE ///////
    /*
    'plotType'  : VictoryBar,
    'metric'    : {
        'metricType': 'histogram',
        'metricOnAxis': 'x'
    }
    */
    console.log(variablesAxis, aggregationMetric)

    // ASSUMING BOTH VARIABLES ARE DEFINED
    let x = variablesAxis['x']
    let y = variablesAxis['y']
    let metricType   = aggregationMetric['metricType']
    let metricOnAxis = aggregationMetric['metricOnAxis']
    let metricOnVariable = variablesAxis[metricOnAxis] // TODO: metricOnAxis can be an array in some cases
    let groupingVariable  = metricOnVariable

    // first, group data
    let groups = _.groupBy(dataToBeAggregated, groupingVariable)
    console.warn(groupingVariable, groups)

    // ... then, run metric on each group
    let aggregatedData = []
    for( let g in groups ){
        // extract values for the group
        let groupValues = _.map( groups[g], metricOnVariable )
        
        // run aggregation function
        let groupAggregatedValue
        if(metricType == 'count') {
            groupAggregatedValue = groupValues.length
        } else {
            throw Error(`Metric "${metricType}" not implemented`)
        }
        
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
    ////// WORK HERE ///////
        /*'plotType'  : VictoryBar,
        'horizontal': true,
        'metric'    : {
            'metricType': 'mean',
            'metricOnAxis': 'x'
        }*/
    console.log(variablesAxis, aggregationMetric)

    // ASSUMING BOTH VARIABLES ARE DEFINED
    let x = variablesAxis['x']
    let y = variablesAxis['y']
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