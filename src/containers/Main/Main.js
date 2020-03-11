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
        savedLinks: {},
        error: false,
        errorMsg: '',
        savedProds: []
    }

    // Helper functions =====================>START
    componentDidMount = () => {
        axios.get('/rest/get_links').then((res) => {
            console.log('----------Main.js--------- 27 \n',res.data);
            let result = { ...res.data };
            let currProdsArray = Object.keys(result).map((prod) => {
                return prod
            })

            this.setState({
                savedLinks: result,
                savedProds: currProdsArray
            })
        })

    }

    // Delete all links from firebase
    deleteLinks = () => {
        axios.get('/rest/delete_links').then((res) => {
            alert(res.data);
            this.setState({
                savedProds: [],
                savedLinks: {}
            })
        })
    }

    // Show all product names from firebase
    showAllLinks = () => {
        axios.get('/rest/show_links').then((res) => {
            let data = { ...res.data };
            let prods = Object.keys(data).map((prod) => {
                return prod.trim();
            });
            if (prods.length == 0) alert('No products to show')
            else {
                this.setState({
                    savedProds: prods
                })
            }

        })
    }
    // Helper functions ======================>END



    handleInputChange = (event) => {
        this.setState({ product: event.target.value })
    }



    // onFormSbumitHandler
    handleForm = (event) => {
        event.preventDefault();
        
 
        
        const { product, savedProds, savedLinks } = this.state;
        this.setState({
            spinner: true,
            searching: true,
            links: []
        })

        axios.post('/rest/links', { product })
            .then(async (res) => {
                console.log('--------Main.js------- 97 \n',res.data)
                console.log('--------Main.js------- 92 \n',res.data.msg);
                this.setState({
                    links: res.data.savedLinks,
                    spinner: false,
                    searching: false,
                })

            })
            .catch((err) => {
                this.setState({ error: true, spinner: false, searching: false })
                console.error(err);
            })

    }




    render() {
        const { searching, links, spinner, product, error, savedProds, savedLinks } = this.state;
        // const photo = links.photo;
        
        return (

            <div className={classes.Main}>
                <h3>Make sure you have strong internet connection!</h3>
                
                {/* HELPER CODE */}
                <button onClick={this.showAllLinks}>Show all links</button>

                {savedProds.length > 0 ? savedProds.map((prod) => {
                    return <li key={Math.random()}>{prod}</li>
                }) : null}

                <button onClick={this.deleteLinks}>Delete all </button>
                {/* HELPER CODE */}

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
                            // imgLink={photo}
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