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
                    <h5>Product Image</h5>
                    <img
                        alt={`This is visual of ${props.product}`}
                        src={props.imgLink}
                        className={classes.Img}
                        width="171px"
                        height="180px" />
                </div>

                <div className={classes.Desc}>
                    <div className={classes.ProdTitle}>
                        <a
                            href={props.link}
                            rel="noopener noreferrer"
                            target="_blank">{props.title}</a>
                    </div>
                    <div className={classes.Specs}>
                        <h5>Produt Specifications</h5>
                    </div>
                </div>

            </div>

            <div className={classes.Source}>
                <h4>{props.src}</h4>
                <span className={classes.Price} >$100</span>
                <img src={logoLink} width="40px" height="40px" />
            </div>

        </div>
    )
}

export default Card;
