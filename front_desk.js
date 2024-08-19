function getStatusClass(available) {
    return available ? 'status-true' : 'status-false';
}

async function reserveBook(contentId, button) {
    let userId = document.getElementById("new-userId").value;
    
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
        await fetch(`https://wt2407.azurewebsites.net/reserveFrontEnd/${userId}/${contentId}`);
    } catch (error) {
        console.log(error.message);
    }
}

async function showBooks() {
    console.log("check1");
    try {
        const response = await fetch("https://wt2407.azurewebsites.net/showBooks");
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

// async function returnBookFrontEnd2(userId, contentId){

// }

async function returnBook(reservationId){
    
    const response = await fetch(`https://wt2407.azurewebsites.net/returnBook/${reservationId}`);
    console.log(response);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();

    console.log(json);

}

async function showBooksByReservationsStatus(status){
    console.log(status);
    console.log(status.options);
    console.log(status.selectedIndex);
    console.log(status.options[status.selectedIndex].text);

    let statusText = status.options[status.selectedIndex].text;
    
    let userId = document.getElementById("userId").innerHTML;
    try {
        const response = await fetch(`https://wt2407.azurewebsites.nets/${statusText}`);
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
                        <button class="reserve-button" onclick="returnBook('${json[x].reservationId}', this)">Return Book</button>
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