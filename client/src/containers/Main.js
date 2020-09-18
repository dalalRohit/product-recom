import React, { Component } from "react";
import axios from "axios";

import Spinner from "./../components/Spinner";
import Form from "./../components/Form";
import Card from "./../components/Card";
import { MdClose } from "react-icons/md";
class Main extends Component {
  _isMounted = false;
  state = {
    product: "",
    searching: false,
    spinner: false,
    links: [],
    error: false,
    errorMsg: "",
    maxPrediction: 0,
    predictions: null,
    show: false,
  };

  componentDidMount() {
    this._isMounted = true;
    // const product=localStorage.getItem('product');
    const links = localStorage.getItem("links");
    const show = localStorage.getItem("show");

    if (show) {
      this.setState({ links: links, show: true });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleInputChange = (event) => {
    this.setState({ product: event.target.value });
  };

  //setData
  setData = (name, links, prediction) => {
    localStorage.setItem("show", true);
    localStorage.setItem("product", name);
    localStorage.setItem("prediction", prediction);
    localStorage.setItem("links", JSON.stringify(links));
  };

  removeData = () => {
    localStorage.clear();
    this.setState({ ...this.state, show: false });
  };

  // onFormSbumitHandler
  handleForm = (event) => {
    event.preventDefault();

    const { product } = this.state;
    this.setState({
      ...this.state,
      spinner: true,
      searching: true,
      links: [],
    });
    axios
      .post("/rest/links", { product })
      .then((res) => {
        const { savedLinks } = res.data;
        //add links to localStorage
        let prodLinks = [];
        let prediction = 0;
        Object.keys(savedLinks).map((k) => {
          savedLinks[k].map((e) => {
            prodLinks.push(e);
            if (Number(e["prediction"]) > prediction) {
              prediction = Number(e["prediction"]);
            }
          });
        });

        //save data to localstorage
        this.setData(product, prodLinks, prediction);

        this.setState({
          ...this.state,
          links: prodLinks,
          spinner: false,
          searching: false,
          maxPrediction: prediction,
          show: true,
        });
      })
      .catch((err) => {
        this.setState({ error: true, spinner: false, searching: false });
        // return alert(err);
        console.log(err);
      });
  };

  render() {
    let {
      searching,
      links,
      spinner,
      maxPrediction,
      show,
      product,
    } = this.state;

    const linksToShow = show ? JSON.parse(links) : null;
    let prod =
      localStorage.getItem("product") !== null
        ? localStorage.getItem("product")
        : product;
    let max = maxPrediction
      ? maxPrediction
      : localStorage.getItem("prediction");
    const showw = localStorage.getItem("show");
    return (
      <div className="Main">
        <p>Make sure you have strong internet connection!</p>

        <div className="Form">
          <Form
            product={product}
            inputChange={this.handleInputChange}
            formSubmit={(event) => this.handleForm(event)}
            searching={searching}
          />
        </div>

        {spinner ? <Spinner /> : null}

        {showw && linksToShow && linksToShow.length ? (
          <>
            <h3>
              Displaying results of <span className="prod_name">{prod}</span>
            </h3>
            <p className="close">
              Close <MdClose size={30} onClick={this.removeData} />
            </p>
            <div
              className="Cards"
              style={{ display: links.length > 0 ? "grid" : "none" }}
            >
              {linksToShow.map((data) => {
                return (
                  <Card
                    product={prod}
                    key={Math.random()}
                    title={data.title}
                    link={data.link}
                    imgLink={data.image ? data.image : null}
                    src={data.source}
                    features={data.features}
                    price={data.price}
                    prediction={data.prediction}
                    winner={data.prediction >= max ? true : false}
                  />
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    );
  }
}

export default Main;
