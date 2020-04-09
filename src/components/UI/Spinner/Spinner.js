import React from 'react'
import classes from './Spinner.css';

export default function Spinner(props) {
    return (
        <div
            className={classes.loader}>
            Loading......
            {props.text}
        </div>
    )
}