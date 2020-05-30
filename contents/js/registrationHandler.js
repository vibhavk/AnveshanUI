
BASE_REG_URL = 'http://c83607ee0d3b.ngrok.io/register';

function handleUserReg(){
    var agreeToTnC = document.getElementById('agreeToTnC').checked;
    console.log(agreeToTnC);
    if(agreeToTnC){
        var userInfo = {
            username:document.getElementById('userName').value,
            password:document.getElementById('userPassword').value,
            confirm_password:document.getElementById('userPassword').value
        }
        axios.post(BASE_REG_URL, 
            userInfo)
        .then(function(response){
            if(response.data.code == "200"){
                window.location.replace('login.html');
            }
        });
    }
}