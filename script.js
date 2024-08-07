const teachingMaterialFormats = ["book","slidedeck","weblink","pdf_file","weblink","video","online_tutorial","webinar","udemy_course","reader"];

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
        const result = await response.text();
        messageElement.innerText = result;
        document.querySelector('.login-box').appendChild(messageElement);
    } catch {
        messageElement.innerText = 'Error occurred during login.';
        document.querySelector('.login-box').appendChild(messageElement);
    }
}


async function showTeachingMaterials(){         
    console.log("check1");           
    try{
        const response = await fetch("http://localhost:8082/teachingMaterialData");
        console.log(response);
        if(!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json)
        var eindString = "<table border=1>";
        eindString += "<tr><td>ID</td><td>Name</td><td>Format</td><td>Amount</td><td>Description</td><td>Available</td></tr>"
        for(var x = 0; x < json.length; x++){
            eindString += "<tr><td>"+(x+1)+"</td><td>"+json[x].name+"</td><td>"+json[x].format+"</td><td>"+json[x].amount+"</td><td>"+json[x].description+"</td><td>"+json[x].available+"</td></tr>";
        }
        eindString += "</table>";
        document.getElementById("TMTable").innerHTML = eindString;
    }
    catch(error){
        console.error(error.message)
    }
}

function blockTeachingMaterials(){
    document.getElementById("TMTable").innerHTML = "";
}

function blockTeachingMaterialsPerFormat(){
    document.getElementById("FormatTable").innerHTML = "";
}

async function showTeachingMaterialsPerFormat(){
    document.getElementById("formatCheck").innerHTML = "";
    let materialFormat = document.getElementById("materialFormat").value;

    //const formatJson = await formatResponse.json();
    

    // for(var x = 0; x < teachingMaterialFormats.length; x++){
    //     //console.log(teachingMaterialFormats[x]);
    //     if(teachingMaterialFormats[x] == materialFormat){
    //         break;
    //     }
    //     else{
    //         if(x == teachingMaterialFormats.length){
    //             document.getElementById("formatCheck").innerHTML = materialFormat + " niet aanwezig in de lesmateriaal formatlijst.";
    //             document.getElementById("TMTable").innerHTML = "";
    //             y = 1;
    //         }
    //     }
    if(!teachingMaterialFormats.includes(materialFormat)){
        document.getElementById("formatCheck").innerHTML = materialFormat + " niet aanwezig in de lesmateriaal formatlijst.";
        document.getElementById("TMTable").innerHTML = "";
    }
    else{
        //const formatResponse = await fetch("http://localhost:8082/admin_start.html/" + materialFormat);
        const materialResponse = await fetch("http://localhost:8082/teachingMaterialData");
        const json = await materialResponse.json();
        var eindString = "<table border=1>";
        eindString += "<tr><td>ID</td><td>Name</td><td>Format</td><td>Amount</td><td>Description</td><td>Available</td></tr>";
        for(var x = 0; x < json.length; x++){
            if(json[x].format == materialFormat){
                eindString += "<tr><td>"+(x+1)+"</td><td>"+json[x].name+"</td><td>"+json[x].format+"</td><td>"+json[x].amount+"</td><td>"+json[x].description+"</td><td>"+json[x].available+"</td></tr>";
            }
        }
        eindString += "</table>";
        document.getElementById("FormatTable").innerHTML = eindString;
    }
}


