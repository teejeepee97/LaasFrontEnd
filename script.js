const teachingMaterialFormats = ["book","slidedeck","weblink","pdf_file","weblink","video","online_tutorial","webinar","udemy_course","reader"];

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

async function showBooks() {
    console.log("check1");
    try {
        // const response = await fetch("http://localhost:8082/showBooks");
        const response = await fetch("https://wt2407v2.azurewebsites.net/showBooks");
        console.log(response);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);
        
        let eindString = `
            <table>
                <thead>
                    <tr>
                        <th>BookID</th>
                        <th>Book Name</th>
                        <th class="Wear">Book Wear</th>
                        <th class="available">Available</th>
                        <th class ="reserve">Reserve</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (let x = 0; x < json.length; x++) {
            eindString += `
                <tr>
                <tr>
                    <td>${json[x].contentId}</td>
                    <td>${json[x].contentName}</td>
                    <td>${json[x].physicalWear}</td>
                    <td class="status ${getStatusClass(json[x].available)}">
                        ${json[x].available ? 'Available' : 'Not Available'}
                    </td>
                    <td>
                        <button class="reserve-button" onclick="reserveBook('${json[x].contentId}', this)">Reserve Book</button>
                    </td>
                </tr>
            `;
        }
        
        eindString += `
                </tbody>
            </table>
        `;
        
        document.getElementById("TMTable").innerHTML = eindString;
    } catch (error) {
        console.error(error.message);
    }
}

function getStatusClass(available) {
    return available ? 'status-true' : 'status-false';
}

async function reserveBook(contentId, button) {
    const userId = localStorage.getItem('userId');
    
    // Disable the button and change its style
    button.disabled = true;
    button.style.backgroundColor = 'red';
    button.style.color = 'white'; // Optional: Change text color for better contrast
    button.innerText = 'Reserving...'; // Optional: Change button text to indicate reservation process
                                       // Get innerText value from enum value of the reservation
    
    try {
        await reserveFrontEnd(userId, contentId);
        // Display an alert with the reservation message
        alert(`book ${contentId} has been reserved by user ${userId}`);
    } catch (error) {
        console.log(error.message);
    } finally {
        // Re-enable the button after 5 seconds
        setTimeout(() => {
            button.disabled = false;
            button.style.backgroundColor = ''; // Reset button color
            button.style.color = ''; // Reset text color
            button.innerText = 'Reserve Book'; // Reset button text
        }, 5000);

        showBooks();
    }
}

async function reserveFrontEnd(userId, contentId) {
    try {
        // await fetch(`http://localhost:8082/reserveBook/${userId}/${contentId}`);
        await fetch(`https://wt2407v2.azurewebsites.net/reserveBook/${userId}/${contentId}`);
    } catch (error) {
        console.log(error.message);
    }
}

