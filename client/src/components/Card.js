import React, { Component } from "react";
import "./../styles/Card.scss";

import amazonLink from "./../images/amazon-logo.png";
import flipkartLink from "./../images/flipkart-logo.png";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Circle from "react-circle";

import Specs from "./../containers/Specs";

class Card extends Component {
  state = {
    toggle: false,
  };

  handleToggle = () => {
    this.setState({
      toggle: !this.state.toggle,
    });
  };

  render() {
    let {
      imgLink,
      price,
      product,
      src,
      link,
      title,
      features,
      prediction,
      winner,
    } = this.props;

    var logoLink = src === "amazon" ? amazonLink : flipkartLink;

    let arrowToShow = !this.state.toggle ? (
      <IoIosArrowDown size={25} />
    ) : (
      <IoIosArrowUp size={25} />
    );

    return (
      <div
        className="Card"
        style={{ outline: winner ? "2px solid green" : "2px solid red" }}
      >
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
              <a href={link} rel="noopener noreferrer" target="_blank">
                {title ? title : "Title"}
              </a>
            </div>
            <div className="Short">
              <p>Result</p>
              <Circle
                animate={true}
                progressColor="rgb(1,195,221)"
                progress={prediction ? Math.round(prediction) : 45}
              />
            </div>
          </div>
        </div>

        {/* Source,Price and company logo */}
        <div className="Source">
          <span className="Price">{price ? price : "price"}</span>

          <img src={logoLink} alt="Logo" width="40px" height="40px" />
        </div>

        <br />

        {/* DOWN/UP Arrow  */}
        <span className="Toggle" onClick={this.handleToggle}>
          {arrowToShow}
        </span>

        {this.state.toggle ? (
          <div className="Info">
            {/* Specifications Table */}
            <section className="SpecsTable">
              <h3>Specifications</h3>

              <Specs features={features ? features : null} />
            </section>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Card;
