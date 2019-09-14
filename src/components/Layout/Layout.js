import React from 'react'
import Header from './../../containers/Header/Header';

export default function Layout(props) {
    return (
        <div>
            <Header />
            {props.children}
        </div>
    )
}
