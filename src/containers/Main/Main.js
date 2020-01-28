import React, { Component } from 'react'
import classes from './Main.css';
import axios from 'axios';


import Spinner from './../../components/UI/Spinner/Spinner';
import Form from './../../components/Form/Form';
import Card from './../../components/Card/Card'
import Error from './../../components/UI/Error/Error';

class Main extends Component {
    state = {
        product: '',
        searching: false,
        spinner: false,
        links: [],
        error: false,
        errorMsg: '',
    }
    handleInputChange = (event) => {
        this.setState({ product: event.target.value })
    }
    handleForm = (event) => {
        event.preventDefault();
        this.setState({
            spinner: true,
            searching: true,
            links: []
        })
        axios.post('/rest/links', { product: this.state.product })
            .then((res) => {
                if (!res.data.error) {
                    this.setState({
                        links: res.data,
                        spinner: false,
                        searching: false,
                    })
                }


            })
            .catch((err) => {
                this.setState({ error: true, spinner: false, searching: false })
                console.error(err);
            })



    }
    render() {
        const { searching, links, spinner, product, error } = this.state;
        const photo = links.photo;
        return (

            <div className={classes.Main}>
                <h3>Make sure you have strong internet connection!</h3>
                <Form
                    product={product}
                    inputChange={this.handleInputChange}
                    formSubmit={(event) => this.handleForm(event)}
                    searching={searching} />

                {spinner ? <Spinner /> : null}

                {error ? <Error msg={this.state.errorMsg} /> : null}

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

                {/* <Card /> */}
            </div>
        )
    }
}

export default Main;