
async function getCredentials(){
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    const login_response = await fetch("http://localhost:8082/Login2.html/" + username + "/" + password);
    console.log(login_response);
}

async function checkCredentials() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.createElement('div');
    messageElement.id = 'message';
    
    // Remove previous message if it exists
    const previousMessage = document.getElementById('message');
    if (previousMessage) {
        previousMessage.remove();
    }
    
    if (!username || !password) {
        messageElement.innerText = 'Please fill in both fields.';
        document.querySelector('.login-box').appendChild(messageElement);
        return;
    }

    try {
        const response = await fetch(`https://wt2407.azurewebsites.net/login/${username}/${password}`, {
            method: 'GET'
        });
        // const response = await fetch(`http://localhost:8082/login/${username}/${password}`, {
        //     method: 'GET'
        // });
        const result = await response.json();

        if (result === null || result === undefined) {
            messageElement.innerText = 'Error occurred during login.';
            document.querySelector('.login-box').appendChild(messageElement);
            return;
        }

        const {rol} = result;
        const {userId} = result;
        const {name} = result;
        const loginTime = new Date().getTime();

        localStorage.setItem("rol", rol)
        localStorage.setItem("userId", userId)
        localStorage.setItem("username", name)
        localStorage.setItem("loggedIn", true)
        localStorage.setItem("loginTime", loginTime)

        if (rol === 'Trainee') {
            window.location = 'books.html';
        } else if (rol === 'Trainer') {
            window.location = 'trainer.html';
        } else {
            console.error('Onbekende rol:', rol);
        }
        // messageElement.innerText = rol;
        // document.querySelector('.login-box').appendChild(messageElement);

    } catch {
        messageElement.innerText = 'Error occurred during login.';
        document.querySelector('.login-box').appendChild(messageElement);
    }
}