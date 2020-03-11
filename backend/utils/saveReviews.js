const axios=require('axios');



const flaskRest='http://localhost:5000';

async function storeAmazonReviews(product,asin,filename=''){
    /*
    for(var i=1;i<100;i++)
    {

        let res=await axios.get(`http://localhost:9080/crawl.json?spider_name=amazon&url=${url}${i}`)
        amazonReviews.push(res.data.items)
    }

    return amazonReviews;
    // Do these tasks
    1. Extract product name,asin from url
    2. axios.post(restapi+'/amazon',{
        product,asin
    }).then( (data) => {
        saveToMongoDB
    })

    */
   axios.post(`${flaskRest}/scrape-amazon`,{product,asin,filename})
    .then( (res) => {  
        return res;
    })
    .catch( (err) => {
        console.log(err);
    })
    
}



/*
storeAmazonReviews().then( async (res) => {
    let data={name:'rohit',reviews:res};
    let newReview=new Reviews(data);
    await newReview.save()
})
*/

module.exports={
    storeAmazonReviews:storeAmazonReviews,
}