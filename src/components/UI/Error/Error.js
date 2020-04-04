import React from 'react'

// import { Alert, AlertTitle } from '@material-ui/lab';

export default function Error(props) {
    return (
        // <Alert severity="error">
        //     <AlertTitle>Error</AlertTitle>
        //     This is an error alert — check it out!
        // </Alert>
        <div>
            {props.msg}
        </div>
    )
}
