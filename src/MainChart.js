import React from 'react'
import { useSelector } from 'react-redux'
import { VictoryChart, VictoryBar, VictoryScatter, VictoryAxis } from 'victory'
import { dropUndefined } from './functions'

function MainChart() {

    let vizData     = useSelector(state => state.parsedData)
    let vizMetadata = useSelector(state => state.parsedMeta)
    let vizX        = useSelector(state => state.variableOnXaxis)
    let vizY        = useSelector(state => state.variableOnYaxis)

    if(!vizData) {
        return (
            <div>Please upload a CSV (maybe demo here?)</div>
        )
    }
    
    let axisVariables = {
        x: vizX,
        y: vizY
    }

    // clean data dropping records where required variables are undefined
    let vizDataWithoutUndefined = dropUndefined(vizData, Object.values(axisVariables))

    // detect required type of chart
    let ChartType = VictoryScatter
    
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