import React, { Component } from 'react'
import classes from './Main.css';
import axios from 'axios';
import uuid from 'uuid/v4';

// Image
import productImg from './../../images/product.jpg';


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
        savedProds: [],
        amazonFeatures:[],
        flipkartFeatures:[]
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
            if (prods.length === 0) alert('No products to show')
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
                // console.log('--------Main.js------- 97 \n',res.data)
                // console.log('--------Main.js------- 92 \n',res.data.msg);
                console.log('--------Main.js---------- info \n',res.data)
                let x=[];
                Object.keys(res.data.savedLinks)
                    .map( (k) => {
                        res.data.savedLinks[k].map( (e) => {
                            x.push(e);
                        })
                    })
                console.log(x);
                this.setState({
                    links: x,
                    spinner: false,
                    searching: false,
                })

            })
            .catch((err) => {
                this.setState({ error: true, spinner: false, searching: false })
                return console.error(err);
            })

    }




    render() {
        const { searching, links, spinner, product, error, savedProds, savedLinks } = this.state;
        // const photo = links.photo;
        
        return (

            <div className={classes.Main}>
                <p>Make sure you have strong internet connection!</p>
                
                {/* START ==============>HELPER CODE */}
                <button onClick={this.showAllLinks}>Show all links</button>

                {savedProds.length > 0 ? savedProds.map((prod) => {
                    return <li key={Math.random()}>{prod}</li>
                }) : null}

                <button onClick={this.deleteLinks}>Delete all </button>
                {/* END ==============>HELPER CODE */}
                
                <Form
                    product={product}
                    inputChange={this.handleInputChange}
                    formSubmit={(event) => this.handleForm(event)}
                    searching={searching} />
                    
                <div className={classes.Spinner}>
                    {spinner ? <Spinner /> : null}
                </div>
                

                <div className={classes.Cards}>
                    {links.length > 0 ? links.map((data) => {
                        console.log(data);
                        return (
                            <Card
                                product={this.state.product}
                                key={Math.random()}
                                title={data.title}
                                link={data.link}
                                imgLink={data.image  ? data.image : productImg}
                                src={data.source}
                                features={data.features}
                                price={data.price}
                            />
                        )
                    }) : null}
                </div>

            </div>
        )
    }
}

export default Main;