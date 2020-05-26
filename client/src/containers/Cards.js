import React, { Component } from 'react'

import Card from './../components/Card';


export default class Cards extends Component {
    render() {
        const style={
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill,minmax(49%,1fr))',
            gap:'1em'
        }
        return (
            <div style={style}>
                <Card />
                <Card />
            </div>
        )
    }
}
