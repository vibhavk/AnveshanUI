

BASE_URL = 'http://localhost:5000/';
BASE_SEARCH_URL = 'http://df221ddc.ngrok.io/search/';
BASE_SOCKET_URL = 'http://localhost:5000/search-suggest';

var queryStringdYM=null;

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
    document.getElementById('resultsWalaQueryBox').value = sessionStorage.getItem("searchquery");
}

function sendSearchQueryFromDYM(){
    console.log("queryDYM hit!: "+ queryStringdYM);
    debugger;
    var USER_SEARCH_URL = String(BASE_SEARCH_URL + queryStringdYM);
    var searchQuery = {};
    console.log("here! now, sending request");
    axios.get(USER_SEARCH_URL,
        searchQuery
        )
       .then(function (response) {
            debugger;
            results=response.data.search_results;
            console.log(results);
            debugger;
            saveResults(false,results);
            debugger;
            sessionStorage.setItem("handledByDYM","yes");
            window.location.replace('results.html');
         })
         .catch(function (error) {
            console.log(error);
         });

}

function handleNoResultsFound(dYM){
    debugger;
    console.log('Entered handle no results found!');
    //console.log(dYM);
    debugger;
    renderCurrentPageResults([]);
    debugger;
    var sorryPlug = document.getElementById('sorryPlug');
    sorryPlug.innerHTML = '<div class="alert alert-danger"><button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close"><i class="tim-icons icon-simple-remove"></i> </button><span><span style="font-size:20px;">&#128517;</span> Sorry! We could not find any results matching your query.</span></div>';
    debugger;

    if(dYM !== null){
        debugger;
        queryStringdYM = dYM;
        var dYMPlug = document.getElementById('dYMPlug');
        dYMPlug.innerHTML = '<button type="button" onclick="sendSearchQueryFromDYM()" class="btn btn-danger" id="dYMButton" style="float: right;">'+'Did you mean "'+(dYM)+'" ?</button>  ';
        debugger;
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
    var dym = sessionStorage.getItem("do_you_mean");
    //if(dym !== null){
      //  sessionStorage.setItem("validResults?","yes");
    //}
    var validResults = sessionStorage.getItem("validResults?");
    console.log(validResults);
    if(validResults === "yes"){
            var resultString = sessionStorage.getItem("resultsIntoString");
            var stringIntoResults=JSON.parse(resultString);
            readyResults(stringIntoResults);
            sessionStorage.removeItem("validResults?");
            var firstVisit = sessionStorage.getItem("firstVisit");
            if(firstVisit === '0'){
            renderResults(1);
            }
    }else{
        //console.log(dym);
        if(dym === null){
            var dYMAvailable = sessionStorage.getItem("do_you_mean_available");

            if(dYMAvailable === "no"){
                //NRNDYM
                console.log("Yes,NO RESULTS. NO DYM");
                debugger;
                handleNoResultsFound(dym);
                debugger;
            }
        } else {
            debugger;
            handleNoResultsFound(dym);
            debugger;   
        }
    }

}
function saveResults(nr,results){
    if(nr === true){
        if(results === null){
            sessionStorage.setItem("do_you_mean_available", "no");
            console.log("NO RESULTS. NO DYM?");
        }else{
            console.log("NO RESULTS. BUT A DYM!");
            sessionStorage.setItem("do_you_mean_available", "yes");
            debugger;
            console.log(results);
            debugger;
            sessionStorage.setItem("do_you_mean", results);
            debugger;

        }
    }else{
        debugger;
        console.log(results);
        var resultsIntoString = JSON.stringify(results);
        debugger;
        console.log(resultsIntoString);
        debugger;
        sessionStorage.setItem("resultsIntoString", resultsIntoString);
        debugger;
        sessionStorage.setItem("firstVisit", '0');
        if(document.getElementById('queryBox') == null){
        sessionStorage.setItem("searchquery",document.getElementById('resultsWalaQueryBox').value);
        } else{
        sessionStorage.setItem("searchquery",document.getElementById('queryBox').value);
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
            saveResults(false,results);
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
            console.log(response);
            debugger;
            console.log(response.data.search_results);
            debugger;
            if(response.data.search_results === "No result Found" ){
                console.log("NR!");
                debugger;
                if(response.data.do_you_mean === undefined){
                    console.log("dym nahi hai");
                    saveResults(true,null);
                    sessionStorage.setItem("validResults?","no");
                    window.location.replace('results.html');
                } else{
                    console.log("dym hai");
                    debugger;
                    saveResults(true,response.data.do_you_mean);
                    debugger;
                    //coming from dym-helped search
                    console.log(response.data.search_results);
                    debugger;
                    console.log(sessionStorage.getItem("handledByDYM"));
                    debugger;
                    if(sessionStorage.getItem("handledByDYM")){
                        window.location.replace('results.html');
                    }else{
                        sessionStorage.setItem("validResults?","no");
                        window.location.replace('results.html');
                    }
                }
            }else{
                console.log("valid results");
                results=response.data.search_results;
                saveResults(false,results);
                sessionStorage.setItem("validResults?","yes");
                window.location.replace('results.html');
            }
         })
         .catch(function (error) {
            console.log(error);
         });
}


