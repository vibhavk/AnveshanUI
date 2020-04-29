BASE_URL = 'http://localhost:5000/';
BASE_SEARCH_URL = 'http://localhost:5000/search';
BASE_USER_URL = '';
var content = null;

var config = {
    headers:{'Access-Control-Allow-Origin':'*'}
}

function handleSave(){

    console.log('save!');

    var userUpdateRequestObj = {
        avatarURL:document.getElementById("userAvatar").files[0],
        userCompany: document.getElementById("userCompany").value,
        userName: document.getElementById("userName").value,
        userEmail: document.getElementById("userEmail").value,
        userFName: document.getElementById("userFName").value,
        userLName: document.getElementById("userLName").value,
        userAddress: document.getElementById("userAddress").value,
        userCity: document.getElementById("userCity").value,
        userCountry: document.getElementById("userCountry").value,
        userPCode: document.getElementById("userPCode").value,
        userFavTopics: document.getElementById("userFavTopics").value,
        userAbout: document.getElementById("userAbout").value,
    };
    console.log(userUpdateRequestObj);
    axios.post(BASE_USER_URL, {
        userUpdateRequestObj
     },config)
        .then((response)=>{
            if(response.status === 200){
                //document.getElementById("userAvatar").files[0] = userUpdateRequestObj.avatarURL; ASK SERVER
                document.getElementById("userCompany").value = userUpdateRequestObj.userCompany;
                userName: document.getElementById("userName").value = userUpdateRequestObj.userName;
                userEmail: document.getElementById("userEmail").value = userUpdateRequestObj.userEmail;
                userFName: document.getElementById("userFName").value = userUpdateRequestObj.userFName;
                userLName: document.getElementById("userLName").value = userUpdateRequestObj.userLName
                userAddress: document.getElementById("userAddress").value = userUpdateRequestObj.userAddress;
                userCity: document.getElementById("userCity").value = userUpdateRequestObj.userCity;
                userCountry: document.getElementById("userCountry").value = userUpdateRequestObj.userCountry;
                userPCode: document.getElementById("userPCode").value = userUpdateRequestObj.userPCode;
                userFavTopics: document.getElementById("userFavTopics").value = userUpdateRequestObj.userFavTopics;
                userAbout: document.getElementById("userAbout").value = userUpdateRequestObj.userAbout;
            }
        })
         .catch(function (error) {
            console.log(error);
         });     
}