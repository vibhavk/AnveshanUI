

BASE_URL = 'http://localhost:3000/';
BASE_SETTINGS_URL = BASE_URL+ 'update_weights';

function updateBias(){
    console.log("updating bias!");
    var bmValue = String(document.getElementById('bmValueBox').value);
    var prValue = String(document.getElementById('prValueBox').value);

    axios.post(BASE_SETTINGS_URL,{
        pr:prValue,
        bm:bmValue
    }).then(function(response){
        console.log("bias updated!");
        if(response.data.code == "200"){
            alert("Parameter update successful");
        }
    });
}