import React from 'react'
import classes from './Card.css';
import amazonLink from './../../images/amazon-logo-png.png';
import flipkartLink from './../../images/flipkart-logo.png';


function Card(props) {
    var logoLink = props.src === "amazon" ? amazonLink : flipkartLink;
    return (
        <div className={classes.Card}>
            <div className={classes.MainCard}>

                <div className={classes.ProdImg}>
                    {/* <h5>Product Image</h5> */}
                    <img src={props.imgLink} className={classes.Img} width="200px" height="200px" />
                </div>

                <div className={classes.Desc}>
                    <div className={classes.ProdTitle}>
                        <a href={props.link} target="_blank">{props.title}</a>
                    </div>
                    <div className={classes.Specs}>
                        <h5>Produt Specifications</h5>
                    </div>
                </div>

            </div>
            <div className={classes.Source}>
                <h4>{props.src}</h4>
                <span>$100</span>
                <img src={logoLink} width="40px" height="40px" />
            </div>
        </div>
    )
}

export default Card;
