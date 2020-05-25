import React, { Component } from 'react'

import  './../styles/Specs.css';


export default class Specs extends Component {
    
    render() {
        const createData=(label,value) => {
            return {label,value};
        }
        const rows=[
            createData("RAM","6GB"),
            createData("RAM","6GB"),
            createData("RAM","6GB")
        ];
        let features=[];
        if(this.props.features){
            Object.keys(this.props.features)
                .map( (label) => {
                    features.push({label,value:this.props.features[label]})
                })
        }
        else{
            features=rows;
        }
        
        const style={
            borderCollapse:'collapse',
            textAlign:'center'
        }
        return (
            <div className="Specs">
                <table style={style} border='1'>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Value</th>
                        </tr> 
                    </thead>

                    <tbody>
                        {
                            features.map( (r) => {
                                return (
                                    <tr key={Math.random()}>
                                        <td>{r.label}</td>
                                        <td>{r.value}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                
                {/* <table style={style} border='1'>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Value</th>
                        </tr> 
                    </thead>

                    <tbody>
                        {
                            rows.map( (r) => {
                                return (
                                    <tr>
                                        <td>{r.label}</td>
                                        <td>{r.value}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table> */}
            </div>
        )
    }
}
