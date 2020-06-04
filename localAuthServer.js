const express = require('express');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors')

const BASE_URL = 'http://834cba8c57a1.ngrok.io/';

const BASE_LOGIN_URL = BASE_URL+'login';
const BASE_SETTINGS_URL = BASE_URL + 'update_weights';

app.use(express.urlencoded());
app.use(express.json());
app.use(cors())

const port = 3000;

var currentUserName = "default";
var cookie = "default";
var search_results = "default";


function requestAuthCookie(req, response){
    console.log("Username " + req.body.username);
    currentUserName = req.body.username;
    console.log("password " + req.body.password);
    axios.post(BASE_LOGIN_URL, {
        'username' : req.body.username,
        'password' : req.body.password,
        'remember_me' : false
    },{
        'withCredentials' : true
    }).then(res=>{
        //console.log(res.headers['set-cookie']);
        cookie = res.headers['set-cookie'][0];
        //console.log(cookie);
    })
    response.status(200).send();
}

function handlePersonalSearch(req,res){
    console.log('personal search requested!');
    console.log(req.body.query + " requested!");
    console.log("by "+currentUserName);
    console.log(cookie);
    console.log(`${BASE_URL}${currentUserName}/search`);
    axios.post(`${BASE_URL}${currentUserName}/search`,{
        query:req.body.query,
        personalization:true
    },{
        headers:{'Cookie':cookie}
    }).then(
        response=>{
            search_results = response;
            console.log(response.data.search_results);
            res.send(response.data);
        }
    );
}

function weightUpdateHandle(req,res){
    console.log(req.body.bm);
    console.log(req.body.pr);
    console.log(BASE_SETTINGS_URL);
    axios.post(BASE_SETTINGS_URL,
        {
            pr:Number(req.body.pr),
            bm25:Number(req.body.bm)
        },{
            headers:{'Cookie':cookie}            
        }).then(
            res.status(200).send()
        );
}

function handleUserBias(){

}

app.post('/update_weights',(req,res)=>{
    console.log('update weight??')
    console.log(req.body);
    weightUpdateHandle(req,res);
});

app.post('/login', (req, res) => {
    requestAuthCookie(req,res);
});

app.post(`/:name/search`,(req,res)=>{
    console.log(req.params.name);
    currentUserName = req.params.name;
    handlePersonalSearch(req,res);
    
});

app.post('/update_bias',(req,res)=>{
    axios.post(BASE_URL+'update_bias',{
        _id:req.body._id
    },{
        headers:{'Cookie':cookie}            
    }).then(res.status(200).send());
});

//app.post('')

app.listen(port, () => console.log(`Auth app listening at http://localhost:${port}`))