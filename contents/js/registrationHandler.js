
BASE_REG_URL = 'http://localhost:5000/register';

function handleUserReg(){
    var agreeToTnC = document.getElementById('agreeToTnC').checked;
    console.log(agreeToTnC);
    if(agreeToTnC){
        var userInfo = {
            userName:document.getElementById('userName').value,
            userPassword:document.getElementById('userPassword').value
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