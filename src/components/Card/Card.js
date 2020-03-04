import React, { Component } from 'react'
import classes from './Card.css';
import amazonLink from './../../images/amazon-logo-png.png';
import flipkartLink from './../../images/flipkart-logo.png';

import {IoIosArrowDown,IoIosArrowUp} from 'react-icons/io';

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
        var logoLink = this.props.src === "amazon" ? amazonLink : flipkartLink;

        let arrowToShow=!this.state.toggle ? <IoIosArrowDown size={25} /> : <IoIosArrowUp size={25} />

        return (
            <div className={classes.Card}>

                <div className={classes.MainCard}>

                    <div className={classes.ProdImg}>
                        <h5>Product Image</h5>
                        <img
                            alt={`This is visual of ${this.props.product}`}
                            title={`This is visual of ${this.props.product}`}
                            src={this.props.imgLink}
                            className={classes.Img}
                            width="171px"
                            height="180px" />
                    </div>

                    <div className={classes.Desc}>
                        <div className={classes.ProdTitle}>
                            <a
                                href={this.props.link}
                                rel="noopener noreferrer"
                                target="_blank">{this.props.title ? this.props.title : "Title"}</a>
                        </div>
                    </div>

                </div>

                <div className={classes.Source}>
                    <h4>{this.props.src ? this.props.src : "source"}</h4>

                    <span className={classes.Price} >Price</span>
                    
                    <img src={logoLink} width="40px" height="40px" />
                </div>

                <br />
                <hr />

                <div className={classes.Toggle} onClick={this.handleToggle}>
                    {arrowToShow}
                </div>

                <div className={classes.Info} style={{display:!this.state.toggle ? "none" : "block"}}>
                    {/* Specifications Table */}
                    <div className={classes.SpecsTable}>
                        <h3>Specifications</h3>

                        <table></table>
                    </div>

                    {/* Detailed analysis */}
                    <main className={classes.Analysis}>
                        <h3>Analysis</h3>
                    </main>
                </div>
        </div>

        )
    }
}


export default Card;
