import React from 'react';
import classes from './Form.css';

import { TextField, Button } from '@material-ui/core'
function form(props) {
    return (
        <div className={classes.Form}>
            <h3>Enter proper product name</h3>
            <form onSubmit={props.formSubmit} className={classes.MainForm} >
                <TextField
                    label="Product"
                    className={classes.productField}
                    value={props.product}
                    placeholder="Enter product name...."
                    onChange={(event) => props.inputChange(event)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.Button}
                    onClick={props.formSubmit}
                    disabled={(props.product.length > 0) ? null : true}
                >
                    Search
                </Button>
            </form>

        </div>
    )
}

export default form;
