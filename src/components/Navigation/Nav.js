import React from 'react'

import classes from './Nav.css';
function Nav() {

    return (
        <div className={classes.Nav}>
            <nav className={classes.Items}>
                <ul className={classes.Links}>
                <li>Home</li>
                <li>About</li>
                <li>Paper</li>
                </ul>
            </nav>
        </div>
    )
}
export default Nav;
