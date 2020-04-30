BASE_URL = 'http://localhost:5000/';
BASE_SEARCH_URL = 'http://localhost:5000/search';
BASE_SOCKET_URL = 'http://localhost:5000/search-suggest';

var content = null;

var results = null;


var searchSocket = new WebSocket(BASE_SOCKET_URL, '');

function searchSuggestRequest(){
    searchSocket.send(document.getElementById('queryBox').value);
}

searchSocket.onmessage = function (event) {
    var suggestions = event.data;
    searchSuggestEditDropdown(suggestions);
}
function searchSuggestEditDropdown(suggestions){
    //populate a dropdown with suggestions from server
}

window.onhashchange = searchSocket.close();

var config = {
    headers:{'Access-Control-Allow-Origin':'*'}
}

personalized = true;

function personalizedToggler(){
    personalized = !personalized;
}

function renderResults(results){

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
            results=response;
            window.location.replace("../results.html");
         }).then(function(results){
             renderResults(results);
         })
         .catch(function (error) {
            console.log(error);
         });
}


