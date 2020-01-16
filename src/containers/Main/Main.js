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
        links: [],
        error: false,
        errorMsg: ''
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
                this.setState({
                    links: res.data,
                    spinner: false,
                    searching: false,
                })
            })
            .catch((err) => {
                this.setState({ error: true, spinner: false })
                return console.log(err);
            })

    }
    render() {
        const { scrapping, links, spinner, product, errorMsg } = this.state;
        const photo = this.state.links.photo;
        return (

            <div className={classes.Main}>
                <h3>Make sure you have strong internet connection!</h3>
                <Form
                    product={product}
                    inputChange={this.handleInputChange}
                    formSubmit={(event) => this.handleForm(event)}
                    scrapping={scrapping} />

                {spinner ? <Spinner /> : null}

                {errorMsg.length > 0 ? errorMsg : null}

                {links.data ? links.data.map((data) => {
                    return (
                        <Card
                            product={this.state.product}
                            key={Math.random()}
                            title={data.title}
                            link={data.link}
                            imgLink={photo}
                            src={data.source}
                        />
                    )
                }) : null}
            </div>
        )
    }
}

export default Main;