

BASE_URL = 'http://localhost:5000/';
BASE_SEARCH_URL = 'http://b4b1d3a2.ngrok.io/search/';
BASE_SOCKET_URL = 'http://localhost:5000/search-suggest';

var content = null;

var results = null;

var resShow = null;

var pageCount = 0;

var pagedRes = Array();
var currentPageResults = Array(); 

//Uncomment when server socket code is written and put onchange=blah blah in query box input on HTML page
/* 
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

*/

var pageCount = 0;

function checkBoy(){
}

var parser = new DOMParser();

var config = {
    headers:{'Access-Control-Allow-Origin':'*'}
}

personalized = true;

function personalizedToggler(){
    personalized = !personalized;
}

function addPageButtons(pCount){
    pageBar = document.getElementById('pageBar');
    for (i=0;i<pCount;i++){
        pageBar.innerHTML += '<button type="button" class="btn btn-round btn-info" id="'+'page'+(i+1)+'" onClick="getId()">' + (i+1) + '</button>';
    }
}
    
function getId(){
    renderResults(parseInt((this.event.target.id).slice(-1)));
}

function readyResults(results){
    console.log(results)
    var count = 0;
    var resShowCount = 0;
    results.forEach(function (arrayItem) {
        count = count + 1;
    });
    console.log(count);
    pageCount = Math.ceil(count/5);
    addPageButtons(pageCount);
    while(results.length > 0) {
	    pagedRes.push(results.splice(0,5));
    }
    console.log(pagedRes);
}

function renderCurrentPageResults(currentPageResults){
    var difference = 5-currentPageResults.length;
    var textIdsToEdit = ["result1text","result2text","result3text","result4text","result5text"];
    var hrefIdsToEdit = ["linker1","linker2","linker3","linker4","linker5"]
    while(difference>0){
        document.getElementById("resultsPlug").lastElementChild.remove();
        difference = difference-1;
    }
    for (q=0;q<currentPageResults.length;q++){
        document.getElementById(textIdsToEdit[q]).innerHTML=currentPageResults[i].title;
        document.getElementById(hrefIdsToEdit[q]).innerHTML=currentPageResults[i].url;
    }
}

function renderResults(page){
    operatingPage=page-1;
    currentPageResults = pagedRes[operatingPage];
    console.log(currentPageResults);
    renderCurrentPageResults(currentPageResults);
}



/*function checkBoy(){
    console.log(pageCount);
}
*/

function retrieveResults(){
    var resultString = localStorage.getItem("resultsIntoString");
    var stringIntoResults=JSON.parse(resultString);
    readyResults(stringIntoResults);
}
function saveResults(results){
    var resultsIntoString = JSON.stringify(results);
    localStorage.setItem("resultsIntoString", resultsIntoString);
}


function sendSearchQuery(lucky){

    var USER_SEARCH_URL = String(BASE_SEARCH_URL + document.getElementById('queryBox').value);
    
    var searchQuery = {
        personalized:personalized,
        queryString:document.getElementById('queryBox').value,
        lucky:lucky
    };
    axios.get(USER_SEARCH_URL,
        searchQuery
        )
       .then(function (response) {
            console.log(response)
            results=response.data;
            saveResults(results);
            window.location.replace('results.html');
         })
         .catch(function (error) {
            console.log(error);
         });
}


