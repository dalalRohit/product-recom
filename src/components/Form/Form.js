import React from 'react';
import classes from './Form.css';

import { TextField, Button } from '@material-ui/core'
function form(props) {
    return (
        <div className={classes.Form}>
            <p>Enter proper product name</p>
            <form onSubmit={props.formSubmit} className={classes.MainForm} >
                <TextField
                    autoFocus
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
                    disabled={!props.product.length > 0 ? true : null}
                >
                    Search
                </Button>
            </form>

        </div>
    )
}

export default form;
