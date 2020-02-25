import React, { useCallback } from 'react'
import { useStore, useDispatch } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { parseCSVandNotifyStore } from './functions'

// Easier upload lternative here:
// https://react-dropzone-uploader.js.org/docs/quick-start 
function CSVDropZone(props) {

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
    
    let loadDemoDataset = () => {
        let demoDatasetURL = 'demo_dataset.csv'
        parseCSVandNotifyStore(demoDatasetURL, dispatch)
    }

    return (
        <div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <h2>+  upload</h2>
            </div>
            <div onClick={loadDemoDataset}>
                <h2>+  demo</h2>
            </div>
        </div>
    )
}

export default CSVDropZone