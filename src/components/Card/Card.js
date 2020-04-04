import React, { Component } from 'react'
import classes from './Card.css';

import amazonLink from './../../images/amazon-logo-png.png';
import flipkartLink from './../../images/flipkart-logo.png';

import {IoIosArrowDown,IoIosArrowUp} from 'react-icons/io';
import Circle from 'react-circle';

import Specs from './../../containers/Specs/Specs';
import Analysis from './../../containers/Analysis/Analysis';

import productImg from './../../images/product.jpg';

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
        let {imgLink,price,product,src,link,title,features}=this.props;

        var logoLink = src === "amazon" ? amazonLink : flipkartLink;

        let arrowToShow=!this.state.toggle ? <IoIosArrowDown size={25} /> : <IoIosArrowUp size={25} />

        return (
            <div className={classes.Card}>

                <div className={classes.MainCard}>

                    <div className={classes.ProdImg}>
                        <img
                            alt={`This is visual of ${product}`}
                            title={`This is visual of ${product}`}
                            src={imgLink}
                            className={classes.Img}
                            />
                    </div>

                    <div className={classes.Desc}>
                        <div className={classes.ProdTitle}>
                            <a
                                href={link}
                                rel="noopener noreferrer"
                                target="_blank">{title ? title : "Title"}</a>
                        </div>
                        <div className={classes.Short}>
                            <p>Result</p>
                            <Circle 
                                animate={true}
                                progressColor="rgb(51,255,153)"
                                progress={45} />
                        </div>
                    </div>

                </div>

                {/* Source,Price and company logo */}
                <div className={classes.Source}>

                    <span className={classes.Price} >{price ? price : 'price'}</span>
                    
                    <img src={logoLink} alt="Logo" width="40px" height="40px" />
                </div>

                <br />
                <hr />

                {/* DOWN/UP Arrow  */}
                <div className={classes.Toggle} onClick={this.handleToggle}>
                    {arrowToShow}
                </div>

                {/* Container for Specs and Info */}
                <div className={classes.Info} 
                    style={{display:!this.state.toggle ? "none" : "block"}}
                    >
                    {/* Specifications Table */}
                    <div className={classes.SpecsTable}>
                        <h3>Specifications</h3>

                        <Specs features={features ? features : null}/>
                    </div>

                    {/* Detailed analysis */}
                    <main className={classes.Analysis}>
                        <h3>Analysis</h3>
                        <Analysis />

                    </main>
                
                </div>
            </div>

        )
    }
}


export default Card;
