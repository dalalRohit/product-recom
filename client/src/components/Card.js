import React, { Component } from 'react'
import './../styles/Card.css';

import amazonLink from './../images/amazon-logo-png.png';
import flipkartLink from './../images/flipkart-logo.png';

import {IoIosArrowDown,IoIosArrowUp} from 'react-icons/io';
import Circle from 'react-circle';

import Specs from './../containers/Specs';
import Analysis from './../containers/Analysis';


class Card extends Component
{

    state={
        toggle:false
    }

    handleToggle=() => {
        this.setState({
            toggle:!this.state.toggle
        })
    }

    render(){
        let {imgLink,price,product,src,link,title,features,prediction,winner}=this.props;

        var logoLink = src === "amazon" ? amazonLink : flipkartLink;

        let arrowToShow=!this.state.toggle ? <IoIosArrowDown size={25} /> : <IoIosArrowUp size={25} />

        return (
            <div className="Card" style={{border:winner ? '3px solid green' : '3px solid red'}}>

                <div className="MainCard">

                    <div className="ProdImg">
                        <img
                            alt={`This is visual of ${product}`}
                            title={`This is visual of ${product}`}
                            src={imgLink}
                            className="Img"
                            />
                    </div>

                    <div className="Desc">
                        <div className="ProdTitle">
                            <a
                                href={link}
                                rel="noopener noreferrer"
                                target="_blank">{title ? title : "Title"}</a>
                        </div>
                        <div className="Short">
                            <p>Result</p>
                            <Circle 
                                animate={true}
                                progressColor="rgb(51,255,153)"
                                progress={Math.round(prediction)} />
                        </div>
                    </div>

                </div>

                {/* Source,Price and company logo */}
                <div className="Source">

                    <span className="Price" >{price ? price : 'price'}</span>
                    
                    <img src={logoLink} alt="Logo" width="40px" height="40px" />
                </div>

                <br />
                <hr />

                {/* DOWN/UP Arrow  */}
                <div className="Toggle" onClick={this.handleToggle}>
                    {arrowToShow}
                </div>

                {/* Container for Specs and Info */}
                <div className="Info" 
                    style={{display:!this.state.toggle ? "none" : "grid"}} >

                    {/* Specifications Table */}
                    <div className="SpecsTable">
                        <h3>Specifications</h3>

                        <Specs features={features ? features : null}/>
                    </div>

                    {/* Detailed analysis */}
                    <main className="Analysis">
                        <h3>Analysis</h3>
                        <Analysis />

                    </main>
                
                </div>
            
            </div>

        )
    }
}


export default Card;
