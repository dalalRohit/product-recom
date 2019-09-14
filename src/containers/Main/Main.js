import React, { Component } from 'react'
import classes from './Main.css';
import axios from 'axios';


import Spinner from './../../components/UI/Spinner/Spinner';
import Form from './../../components/Form/Form';
import Card from './../../components/Card/Card'


class Main extends Component {
    state = {
        product: '',
        searching: false,
        spinner: false,
        links: []
    }
    handleInputChange = (event) => {
        this.setState({ product: event.target.value })
    }
    handleForm = (event) => {
        this.setState({
            spinner: true,
            searching: true,
            links: []
        })
        event.preventDefault();
        axios.post('/rest/links', { product: this.state.product })
            .then((res) => {
                if (typeof res.data == 'string') {
                    console.log(res.data);
                    this.setState({ spinner: false, searching: false })
                }
                else {
                    console.log(res.data);
                    this.setState({
                        links: res.data,
                        spinner: false,
                        searching: false,
                    })
                }

            })
            .catch((err) => {
                return console.log(err);
            })

    }
    render() {
        return (
            <div className={classes.Main}>
                <Form
                    product={this.state.product}
                    inputChange={this.handleInputChange}
                    formSubmit={(event) => this.handleForm(event)}
                    scrapping={this.state.scrapping} />

                {this.state.spinner ? <Spinner /> : null}

                {this.state.links ? this.state.links.map((data) => {
                    return (
                        <Card
                            key={Math.random()}
                            title={data.title}
                            link={data.link}
                            imgLink={data.photoUrl}
                            src={data.source}
                        />
                    )
                }) : null}
                {/* <Card /> */}
            </div>
        )
    }
}

export default Main;
