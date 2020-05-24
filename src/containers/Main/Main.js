import React, { Component } from 'react'
import classes from './Main.css';
import axios from 'axios';

// Image
import productImg from './../../images/product.jpg';


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
        errorMsg: '',
        maxPrediction:0,
        predictions:null
    }




    handleInputChange = (event) => {
        this.setState({ product: event.target.value })
    }

    // onFormSbumitHandler
    handleForm = (event) => {
        event.preventDefault();
         
        const { product } = this.state;
        this.setState({
            spinner: true,
            searching: true,
            links: []
        })
        axios.post('/rest/links', { product })
            .then(async (res) => {
                let x=[];
                let prediction=0;
                Object.keys(res.data.savedLinks)
                    .map( (k) => {
                        res.data.savedLinks[k].map( (e) => {
                            x.push(e);
                            if(Number(e['prediction']) > prediction){
                                prediction=Number(e['prediction']);
                            }

                        })
                    })
                
                this.setState({
                    links: x,
                    spinner: false,
                    searching: false,
                    maxPrediction:prediction,
                })

            })
            .catch((err) => {
                this.setState({ error: true, spinner: false, searching: false })
                return alert(err);
            })
    }




    render() {
        const { searching, links, spinner, product,maxPrediction } = this.state;
        
        return (

            <div className={classes.Main}>
                <p>Make sure you have strong internet connection!</p>

                <div className={classes.Form}>                
                    <Form
                        product={product}
                        inputChange={this.handleInputChange}
                        formSubmit={(event) => this.handleForm(event)}
                        searching={searching} />
                </div>

                {spinner ? <Spinner /> : null}
                
                <div 
                    className={classes.Cards}
                    style={{display:links.length>0 ? 'grid' : 'none'}}>
                        
                    {links.length > 0 ? links.map((data) => {
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
                                prediction={data.prediction}
                                winner={data.prediction===maxPrediction ? true : false}
                            />
                        )
                    }) : null}

                </div>

            </div>
        )
    }
}

export default Main;