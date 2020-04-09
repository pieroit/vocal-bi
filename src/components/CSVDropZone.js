import React, { useCallback } from 'react'
import { useStore, useDispatch } from 'react-redux'
import { Button } from '@material-ui/core'
import UploadIcon from '@material-ui/icons/Publish'
import { useDropzone } from 'react-dropzone'
import { parseCSVandNotifyStore } from '../functions'

// Easier upload lternative here:
// https://react-dropzone-uploader.js.org/docs/quick-start 
let CSVDropZone = (props) => {

    // redux bindings
    let dispatch = useDispatch()
    let store    = useStore()
    
    // on drop callback
    let onDrop = useCallback( (files) => {
        parseCSVandNotifyStore(files[0], dispatch)
    }, [])

    let dropzoneOptions = {
        onDrop: onDrop,
        accept: 'text/csv',
        multiple: false,
    }
    let { getRootProps, getInputProps } = useDropzone(dropzoneOptions)
    
    let loadDemoDataset = (demoDatasetURL) => {
        parseCSVandNotifyStore(demoDatasetURL, dispatch)
    }

    let buttonStyle = {
        'width': '200px'
    }

    let demoDatasets = [
        {
            'text': 'Demo pollo',
            'url' : 'demo_dataset/polli.csv'
        },
        {
            'text': 'Demo titanic',
            'url' : 'demo_dataset/titanic.csv'
        },
        {
            'text': 'Demo impianti',
            'url' : 'demo_dataset/impianti.csv'
        },
    ]
    let demoDatasetsJSX = demoDatasets.map( (d) => {
        return (
            <Button
                key={d.url}
                size='large'
                variant='contained'
                onClick={ () => loadDemoDataset(d.url) }
                startIcon={ <UploadIcon/> }
                style={buttonStyle}
            >
                {d.text}
            </Button>
        )
    } )

    return (
        <div className='vertical-buttons-list'>
            <Button size='large' variant='contained' color='primary'
                startIcon={ <UploadIcon/> } style={buttonStyle}
            >
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    Upload CSV
                </div>
            </Button>

            {demoDatasetsJSX}
            
        </div>
    )
}

export default CSVDropZone