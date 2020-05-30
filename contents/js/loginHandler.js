BASE_LOGIN_URL = 'http://8e583380c1a6.ngrok.io/login';

function handleUserLogin(){
        var userInfoLogin = {
            username:document.getElementById('userNameLogin').value,
            password:document.getElementById('userPasswordLogin').value,
            remember_me: false
        }
        console.log(userInfoLogin)
        axios.post(BASE_LOGIN_URL, 
            userInfoLogin)
        .then(function(response){
            if(response.data.code == "200"){
                console.log(userInfoLogin.username);
                sessionStorage.setItem("loggedIn",true);
                sessionStorage.setItem("username",userInfoLogin.username);
                window.location.replace('search.html');
            }
        });
}