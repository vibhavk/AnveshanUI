

BASE_URL = 'http://localhost:5000/';
BASE_SEARCH_URL = 'http://d1d8be08.ngrok.io/search/';
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
var visitCount = 1;
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


// function handleShitTheFirstTime(){
//     if(parseInt(localStorage.getItem("visitCount") === 1)){
//         retrieveResults();
//         renderResults(1);
//         localStorage.setItem("visitCount", visitCount+1);
//     } else {
//         retrieveResults();
//     }
    
// }

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
    console.log(currentPageResults);
    var difference = 5-currentPageResults.length;
    var textIdsToEdit = ["result1text","result2text","result3text","result4text","result5text"];
    var hrefIdsToEdit = ["linker1","linker2","linker3","linker4","linker5"]
    while(difference>0){
        document.getElementById("resultsPlug").lastElementChild.remove();
        difference = difference-1;
    }
    for (q=0;q<currentPageResults.length;q++){
        document.getElementById(textIdsToEdit[q]).innerHTML=currentPageResults[q].title[0] +' - '+ currentPageResults[q].url;
        document.getElementById(hrefIdsToEdit[q]).href=currentPageResults[q].url;
    }
    document.getElementById('resultsWalaQueryBox').value = localStorage.getItem("searchquery");
}

function handleNoResultsFound(dYM){
    renderCurrentPageResults([]);
    var sorryPlug = document.getElementById('sorryPlug');
    sorryPlug.innerHTML = '<div class="alert alert-danger"><button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close"><i class="tim-icons icon-simple-remove"></i> </button><span><span style="font-size:20px;">&#128517;</span> Sorry! We could not find any results matching your query.</span></div>';

    if(dYM !== null){
    var dYMPlug = document.getElementById('dYMPlug');
    dYMPlug.innerHTML = '<div class="alert alert-success"><button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close"><i class="tim-icons icon-simple-remove"></i></button><span>Did you mean'+dym+'?</span></div>';
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
    var dym = localStorage.getItem("do_you_mean");
    if(dym === null){
        var dYMAvailable = localStorage.getItem("do_you_mean_available");
        if(dYMAvailable === "no"){
            //NRNDYM
            console.log("Yes,NO RESULTS. NO DYM");
            handleNoResultsFound(dym);
        }else {
            var resultString = localStorage.getItem("resultsIntoString");
            var stringIntoResults=JSON.parse(resultString);
            readyResults(stringIntoResults);
            var firstVisit = localStorage.getItem("firstVisit");
            if(firstVisit === '0'){
            renderResults(1);
            }
        }
    } else {
        handleNoResultsFound(dym);   
    }
}
function saveResults(nr,results){
    if(nr === true){
        if(results === null){
            localStorage.setItem("do_you_mean_available", "no");
            console.log("NO RESULTS. NO DYM?");
        }else{
            localStorage.setItem("do_you_mean", results);
        }
    }else{
        var resultsIntoString = JSON.stringify(results);
        localStorage.setItem("resultsIntoString", resultsIntoString);
        localStorage.setItem("firstVisit", '0');
        if(document.getElementById('queryBox') == null){
        localStorage.setItem("searchquery",document.getElementById('resultsWalaQueryBox').value);
        } else{
        localStorage.setItem("searchquery",document.getElementById('queryBox').value);
        }
    } 
    
}


function sendSearchQueryFromResults(lucky){
    var USER_SEARCH_URL = String(BASE_SEARCH_URL + document.getElementById('resultsWalaQueryBox').value);
    var searchQuery = {
        personalized:personalized,
        queryString:document.getElementById('resultsWalaQueryBox').value,
        lucky:lucky
    };
    axios.get(USER_SEARCH_URL,
        searchQuery
        )
       .then(function (response) {
            console.log(response)
            results=response.data.search_results;
            saveResults(results);
            window.location.replace('results.html');
         })
         .catch(function (error) {
            console.log(error);
         });
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
            if(response.data.search_results === "No result Found" ){
                console.log("NR!");
                if(response.data.do_you_mean === undefined){
                    console.log("dym nahi hai");
                    saveResults(true,null);
                    window.location.replace('results.html');
                } else{
                    console.log("dym hai");
                    saveResults(true,response.data.do_you_mean);
                    window.location.replace('results.html');
                }
            }else{
                results=response.data.search_results;
                saveResults(false,results);
                window.location.replace('results.html');
            }
         })
         .catch(function (error) {
            console.log(error);
         });
}


