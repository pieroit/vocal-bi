import React from 'react'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { VictoryChart, VictoryBar, VictoryScatter, VictoryAxis } from 'victory'
import { dropUndefined } from './functions'

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
        y: vizY || 'metric'
    }
    console.log(axisVariables)

    // clean data dropping records where required variables are undefined
    let vizDataWithoutUndefined = dropUndefined(vizData, Object.values(axisVariables))

    // make counts where distributions are asked
    if(vizIsDistribution){
        // TODO: counts should be outside of here
        let valueCounts = _.countBy( vizData, vizX )
        vizDataWithoutUndefined = []
        for(let k in valueCounts){
            vizDataWithoutUndefined.push({
                [vizX] : k,
                ['metric'] : valueCounts[k]
            })
        }
        console.log(vizDataWithoutUndefined)
        // TODO: joint distributions

    }
    // TODO: grouping, averages, sorting

    // detect required type of chart
    let ChartType = VictoryBar
    
    return (
        <div>
            <VictoryChart>
                <VictoryAxis label={axisVariables['x']} />
                <VictoryAxis dependentAxis label={axisVariables['y']} />
                <ChartType
                    data={vizDataWithoutUndefined}
                    {...axisVariables}
                />
            </VictoryChart>
        </div>
    )
}

export default MainChart