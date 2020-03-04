require('dotenv').config();

// ********************************START => FIREBASE*****************************
var firebase = require("firebase-admin");
var creds = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key.replace(/\\n/g, '\n'),
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
}
firebase.initializeApp({
    credential: firebase.credential.cert(creds),
    databaseURL: "https://product-recom.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref();
var dataRef = ref.child("database");
// ********************************END => FIREBASE*****************************

//Function to get all data from Firebase
const getAllLinks = async () => {
    let snapshot = await dataRef.once('value');
    let links = snapshot.val();
    return links;
}

const deleteAllLinks = async () => {
    let x = await dataRef.remove();
    return x;
}

// deleteAllLinks().then((res) => {
//     console.log(res);
// })

// getAllLinks().then((res) => {
//     console.log(res);
// })

module.exports = {
    dataRef,
    getAllLinks,
    deleteAllLinks,
}