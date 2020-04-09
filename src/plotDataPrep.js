
import _ from 'lodash'
//import { histogram as d3Histogram } from 'd3-array'
import { histogram } from 'd3-array'
import { scaleLinear, scaleSequential, scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'

const composeDataAggregationFunction = (slug, onColumn) => {
    let aggregationFunctions = {
        'sum'  : _.sum,
        'mean' : function(g){
            return g.stat.mean(onColumn)
        },
        'count': (arr) => arr.length
    }

    let aggregationFunction = aggregationFunctions[slug]
    if(aggregationFunction) {
        return aggregationFunction
    } else {
        throw Error(`Metric "${slug}" not implemented`)
    }
}

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
        let histGenerator = histogram()
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
    let groups = dataToBeAggregated.groupBy(groupingVariable)

    // run aggregation function
    console.warn(groups)
    let aggregationFunction = composeDataAggregationFunction(metricType, metricOnVariable)
    let aggregatedData = groups.aggregate(aggregationFunction, groupingVariable)
    console.warn(aggregatedData)
    return aggregatedData
}


/**
 * Add a column to DataFrame containing color (for plotting)
 */
export const createColorColumn = (df, coloringColumn, info) => {

    let variableType = info.expandedMetaFields[coloringColumn]
    let colorPalette

    if(variableType == 'number') {
        let min = df.stat.min(coloringColumn)
        let max = df.stat.max(coloringColumn)
        colorPalette = scaleLinear()
            .domain([min, max])
            .range(['blue', 'red'])

    } else {
        let uniques = df.unique(coloringColumn)
        colorPalette = scaleOrdinal()
            .domain(uniques)
            .range(schemeCategory10)
    }

    let dfColored = df.withColumn('color', (row)=>{
        return colorPalette( row.get(coloringColumn) )
    })

    return dfColored
}
