

BASE_URL = 'http://8e583380c1a6.ngrok.io/';
BASE_SEARCH_URL = BASE_URL+ 'search/';
BASE_SOCKET_URL = BASE_URL;

var resultsOnResultsPage = Array();

var queryStringdYM=null;

var content = null;

var results = null;

var resShow = null;

var pageCount = 0;

var pagedRes = Array();
var currentPageResults = Array();
var recomm = null; 

var contentArray = Array();
var contentValueHolder = Array();
var contentIDHolder = Array();

var resultString = null;
var stringIntoResults = null;

var searchSocket = io.connect(BASE_URL);
console.log(searchSocket);

function askForSuggestion(){
    searchSocket.send(JSON.stringify({"query":document.getElementById('queryBox').value}));
    console.log('asking for suggestions!');
}

function askForSuggestionFromResults(){
    searchSocket.send(JSON.stringify({"query":document.getElementById('resultsWalaQueryBox').value}));
    console.log('asking for suggestions!');
}

function populateRecomm(recommendation){
    datalist = document.getElementById('queryInput');
    for (i=0;i<recommendation.length;i++){
        datalist.innerHTML += '<option>'+ recommendation[i] + '</option>';
    }
}

function checkForContentMount(){
    var contentsToEdit = ["content1","content2","content3","content4","content5"];
    for (i=0; i<currentPageResults.length;i++){
        if(contentIDHolder.indexOf(currentPageResults[i]._id) != -1){
            document.getElementById(contentsToEdit[i]).innerHTML = contentValueHolder[contentIDHolder.indexOf(currentPageResults[i]._id)];
        }
    }
}

searchSocket.on("content",function(message){
    console.log(message);
    contentValueHolder.push(message.data);
    contentIDHolder.push(message._id);
    checkForContentMount();
});

searchSocket.on("message", function(message){
    console.log(message);
    if(JSON.parse(message).frequent_search != undefined){
        populateRecomm(JSON.parse(message).frequent_search);
    } else {
        populateRecomm(JSON.parse(message).recommendations);
    }    
});
// function searchSuggestEditDropdown(){
    // console.log('Message Recieved');
// }

//window.onhashchange = searchSocket.close();

var visitCount = 1;
var pageCount = 0;

function checkBoy(){
}


var config = {
    headers:{'Access-Control-Allow-Origin':'*'}
}

var personalized = true;

console.log("Personalized is "+ personalized);

function personalizedToggler(){
    personalized = !personalized;
    console.log('Personalized switched to '+ personalized);
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
    var hrefIdsToEdit = ["linker1","linker2","linker3","linker4","linker5"];
    var contentsToEdit = ["content1","content2","content3","content4","content5"];
    while(difference>0){
        document.getElementById("resultsPlug").lastElementChild.remove();
        difference = difference-1;
    }

    for(j=0;j<contentArray.length;j++){
        contentValueHolder[j] = contentArray[j].data;
        contentIDHolder[j] = contentArray[j]._id;
    }
    
    console.log(contentValueHolder);
    console.log(contentIDHolder);

    for (q=0;q<currentPageResults.length;q++){
        document.getElementById(textIdsToEdit[q]).innerHTML=currentPageResults[q].title[0] +' - '+ currentPageResults[q].url;
        document.getElementById(hrefIdsToEdit[q]).href=currentPageResults[q].url;
        document.getElementById(contentsToEdit[q]).innerHTML = currentPageResults[q]._id;
        
    }
    document.getElementById('resultsWalaQueryBox').value = sessionStorage.getItem("searchquery");
    handleNoResultsFound();
    checkForContentMount();
}

function handleNoResultsFound(){
    
    console.log('Entered handle no results found!');
    //console.log(dYM);
    

    var goodSearch = sessionStorage.getItem("GoodSearch?");
    console.log(goodSearch);
    console.log(sessionStorage.getItem("FixedBydYM?"));
    var sorryPlug = document.getElementById('sorryPlug');
    if(goodSearch !== 'yes'){
        sorryPlug.innerHTML = '<div class="alert alert-danger"><button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close"><i class="tim-icons icon-simple-remove"></i> </button><span><span style="font-size:20px;">&#128517;</span> Sorry! We could not find any results matching your query.</span></div>';   
    }
    var alternative = sessionStorage.getItem("alternative");
    if(alternative !== null){
        
        var dYMPlug = document.getElementById('dYMPlug');
        dYMPlug.innerHTML = '<div class="alert alert-info"><button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close"><i class="tim-icons icon-simple-remove"></i></button><span><span>&#128519;</span> We are showing results for "'+(alternative)+' " instead. Hope that helps! </span></div>';
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
    var validResults = sessionStorage.getItem("validResults?");
    console.log(validResults);
    resultString = sessionStorage.getItem("resultsIntoString");
    stringIntoResults=JSON.parse(resultString);
    readyResults(stringIntoResults);
    sessionStorage.removeItem("validResults?");
    var firstVisit = sessionStorage.getItem("firstVisit");
    if(firstVisit === '0'){
        renderResults(1);
    }
}
function saveResults(results){
        
        console.log(results);
        var resultsIntoString = JSON.stringify(results);
        
        console.log(resultsIntoString);
        
        sessionStorage.setItem("resultsIntoString", resultsIntoString);
        
        sessionStorage.setItem("firstVisit", '0');
        if(document.getElementById('queryBox') == null){
        sessionStorage.setItem("searchquery",document.getElementById('resultsWalaQueryBox').value);
        } else{
        sessionStorage.setItem("searchquery",document.getElementById('queryBox').value);
        }
} 
    



function sendSearchQueryFromResults(lucky){
    var USER_SEARCH_URL = String(BASE_SEARCH_URL + document.getElementById('resultsWalaQueryBox').value);

    if(personalized){
        if(Boolean(sessionStorage.getItem("loggedIn"))){
            USER_SEARCH_URL = String(BASE_URL+ sessionStorage.getItem("username") + '/search');
            var searchQuery = {
                query:document.getElementById('queryBox').value,
                personalization:personalized,
            };
            axios.post(USER_SEARCH_URL,
                searchQuery
                )
               .then(function (response) {
                    console.log(response);
                    
                    console.log(response.data.search_results);
                    
                    if(response.data.search_results === "No result Found" ){
                        console.log("NR!");
                        
                        sessionStorage.setItem("GoodSearch?"," no");
                        console.log("Gotta ask server for something that makes sense!");
                        
                        //process do you mean
                        if(response.data.do_you_mean !== undefined){
                            sessionStorage.setItem("dYM?","yes");
                            sessionStorage.setItem("alternative",response.data.do_you_mean);
                            axios.get(USER_SEARCH_URL,{
                                query:response.data.do_you_mean,
                                personalized:personalized
                            }
                                )
                               .then(function (response) {
                                    console.log(response);
                                    results=response.data.search_results;
                                    sessionStorage.setItem("FixedBydYM?","yes");
                                    saveResults(results);
                                    window.location.replace('results.html');
                                 })
                                 .catch(function (error) {
                                    console.log(error);
                                 });
                        }
                    }else{
                        sessionStorage.setItem("GoodSearch?","yes");
                        results=response.data.search_results;
                        saveResults(results);
                        window.location.replace('results.html');
                    }
                 })
                 .catch(function (error) {
                    console.log(error);
                 });
        }
    }
    
    var searchQuery = {
        queryString:document.getElementById('resultsWalaQueryBox').value,
        lucky:lucky
    };
    axios.get(USER_SEARCH_URL,
        searchQuery
        )
       .then(function (response) {
            console.log(response);
            
            console.log(response.data.search_results);
            
            if(response.data.search_results === "No result Found" ){
                console.log("NR!");
                
                sessionStorage.setItem("GoodSearch?"," no");
                console.log("Gotta ask server for something that makes sense!");
                
                //process do you mean
                if(response.data.do_you_mean !== undefined){
                    sessionStorage.setItem("dYM?","yes");
                    sessionStorage.setItem("alternative",response.data.do_you_mean);
                    axios.get(BASE_SEARCH_URL+response.data.do_you_mean,
                        {}
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
            }else{
                console.log("valid results");
                results=response.data.search_results;
                saveResults(results);
                sessionStorage.setItem("validResults?","yes");
                window.location.replace('results.html');
            }
         })
         .catch(function (error) {
            console.log(error);
         });
}
//document.getElementById('queryBox').value

function sendSearchQuery(lucky){

    var USER_SEARCH_URL = String(BASE_SEARCH_URL + document.getElementById('queryBox').value);
    console.log("personalized is " + personalized);
    if(personalized){
        if(Boolean(sessionStorage.getItem("loggedIn"))){
            USER_SEARCH_URL = String(BASE_URL+ sessionStorage.getItem("username") + '/search');
            var searchQuery = {
                query:document.getElementById('queryBox').value,
                personalization:personalized,
            };
            axios.post(USER_SEARCH_URL,
                searchQuery
                )
               .then(function (response) {
                    console.log(response);
                    
                    console.log(response.data.search_results);
                    
                    if(response.data.search_results === "No result Found" ){
                        console.log("NR!");
                        
                        sessionStorage.setItem("GoodSearch?"," no");
                        console.log("Gotta ask server for something that makes sense!");
                        
                        //process do you mean
                        if(response.data.do_you_mean !== undefined){
                            sessionStorage.setItem("dYM?","yes");
                            sessionStorage.setItem("alternative",response.data.do_you_mean);
                            axios.get(BASE_SEARCH_URL+response.data.do_you_mean,
                                {}
                                )
                               .then(function (response) {
                                    console.log(response);
                                    results=response.data.search_results;
                                    sessionStorage.setItem("FixedBydYM?","yes");
                                    saveResults(results);
                                    window.location.replace('results.html');
                                 })
                                 .catch(function (error) {
                                    console.log(error);
                                 });
                        }
                    }else{
                        sessionStorage.setItem("GoodSearch?","yes");
                        results=response.data.search_results;
                        saveResults(results);
                        window.location.replace('results.html');
                    }
                 })
                 .catch(function (error) {
                    console.log(error);
                 });
        }
    }
    
    var searchQuery = {
        personalization:personalized,
        queryString:document.getElementById('queryBox').value,
        lucky:lucky
    };
    axios.get(USER_SEARCH_URL,
        searchQuery
        )
       .then(function (response) {
            console.log(response);
            
            console.log(response.data.search_results);
            
            if(response.data.search_results === "No result Found" ){
                console.log("NR!");
                
                sessionStorage.setItem("GoodSearch?"," no");
                console.log("Gotta ask server for something that makes sense!");
                
                //process do you mean
                if(response.data.do_you_mean !== undefined){
                    sessionStorage.setItem("dYM?","yes");
                    sessionStorage.setItem("alternative",response.data.do_you_mean);
                    axios.get(BASE_SEARCH_URL+response.data.do_you_mean,
                        {}
                        )
                       .then(function (response) {
                            console.log(response);
                            results=response.data.search_results;
                            sessionStorage.setItem("FixedBydYM?","yes");
                            saveResults(results);
                            window.location.replace('results.html');
                         })
                         .catch(function (error) {
                            console.log(error);
                         });
                }
            }else{
                sessionStorage.setItem("GoodSearch?","yes");
                results=response.data.search_results;
                saveResults(results);
                window.location.replace('results.html');
            }
         })
         .catch(function (error) {
            console.log(error);
         });
}


