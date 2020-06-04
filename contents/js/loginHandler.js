BASE_LOGIN_URL = 'http://localhost:3000/login';

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
            console.log(response);
            if(response.status == "200"){
                console.log(userInfoLogin.username + 'logged in!');
                sessionStorage.setItem("loggedIn",true);
                sessionStorage.setItem("username",userInfoLogin.username);
                console.log(response.data);
                sessionStorage.setItem("cookie",response.data);
                window.location.replace('search.html');
            } else {
                console.log("error!");
            }
        });
}