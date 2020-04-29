BASE_URL = 'http://localhost:5000/';
BASE_SEARCH_URL = 'http://localhost:5000/search';
var content = null;

var config = {
    headers:{'Access-Control-Allow-Origin':'*'}
}

personalized = true;

function personalizedToggler(){
    personalized = !personalized;
}

function sendSearchQuery(lucky){
    var searchQuery = {
        personalized:personalized,
        queryString:document.getElementById('queryBox').value,
        lucky:lucky
    };
    axios.post(BASE_SEARCH_URL, {
        searchQuery
     },config)
        .then(function (response) {
            console.log(response);
            window.location.replace("../results.html");
         })
         .catch(function (error) {
            console.log(error);
         });
}

