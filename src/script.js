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
    const rol = localStorage.getItem('rol');
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
        <table id="booksTable" class="table-sortable">
          <thead>
            <tr>
              <th data-column="0">BookID</th>
              <th data-column="1">Book Name</th>
              <th class="Wear" data-column="2">Book Wear</th>
              <th class="available" data-column="3">Available</th>
              <th class="reserve" data-column="4">Reserve</th>
            </tr>
          </thead>
          <tbody>
      `;
  
        
      if(rol == "Trainee"){
        for (let x = 0; x < json.length; x++) {
            eindString += `
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
    } else{
        for (let x = 0; x < json.length; x++) {
            eindString += `
                <tr>
                    <td>${json[x].contentId}</td>
                    <td>${json[x].contentName}</td>
                    <td>${json[x].physicalWear}</td>
                    <td class="status ${getStatusClass(json[x].available)}">
                        ${json[x].available ? 'Available' : 'Not Available'}
                    </td>
                    <td>
                        <button class="reserve-button" onclick="openTraineePopup(this, event)" data-content-id='${json[x].contentId}'>Select User</button>
                    </td>
                </tr>
            `;
        }
    }
    

    eindString += `
            </tbody>
        </table>

        

    <div id="traineePopup" class="popup">
        <h2>Select a Trainee</h2>
        <ul id="traineeList">
            <!-- Trainees will be populated here -->
        </ul>
        <button id="confirmSelection" onclick="confirmSelection()">Confirm</button>
        <button onclick="closePopup()">Close</button>
    </div>
    `;
  
      document.getElementById("TMTable").innerHTML = eindString;
  
      // Add event listeners to table headers for sorting
      const table = document.getElementById("booksTable");
      const headers = table.querySelectorAll("th");
      headers.forEach(header => {
        header.addEventListener("click", () => {
          const column = parseInt(header.getAttribute("data-column"));
          const isAsc = !header.classList.contains("th-sort-asc");
          sortTableByColumn(table, column, isAsc);
        });
      });
  
    } catch (error) {
      console.error(error.message);
    }
  }

function getStatusClass(available) {
    return available ? 'status-true' : 'status-false';
}

async function reserveBook(contentId, button) {
    const username = localStorage.getItem('username');
    
    // Disable the button and change its style
    button.disabled = true;
    button.style.backgroundColor = 'red';
    button.style.color = 'white'; // Optional: Change text color for better contrast
    button.innerText = 'Reserving...'; // Optional: Change button text to indicate reservation process
                                       // Get innerText value from enum value of the reservation
    
    try {
        await reserveFrontEnd(username, contentId);
        // Display an alert with the reservation message
        alert(`book ${contentId} has been reserved by user ${username}`);
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

async function reserveFrontEnd(username, contentId) {
    try {
        // await fetch(`http://localhost:8082/reserveBook/${username}/${contentId}`);
        await fetch(`https://wt2407v2.azurewebsites.net/reserveBook/${username}/${contentId}`);
    } catch (error) {
        console.log(error.message);
    }
}

function openTraineePopup(buttonElement, event) {
    const username = localStorage.getItem('username')
    // Check if the event object is received
    if (!event) {
        console.error('Event object is undefined. Make sure you pass the event parameter correctly.');
        return;
    }

    // Get the contentId from the clicked button
    currentContentId = buttonElement.getAttribute('data-content-id');

    // Get the popup element
    const popup = document.getElementById('traineePopup');

    // Get the position and dimensions of the button
    const buttonRect = buttonElement.getBoundingClientRect();

    // Calculate the position for the popup (below the button)
    let x = buttonRect.left;
    let y = buttonRect.bottom;

    // Get the screen width and popup width
    const screenWidth = window.innerWidth;
    const popupWidth = popup.offsetWidth;

    // Adjust the position if the popup overflows the right edge of the screen
    if (x + popupWidth > screenWidth) {
        x = screenWidth - popupWidth - 10; // 10px padding from the right edge
    }
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    // Show the popup
    popup.style.display = 'block';

    // Fetch trainees from the server
    // fetch('http://localhost:8082/showTrainees')
    fetch('https://wt2407v2.azurewebsites.net/showTrainees')
        .then(response => response.json())
        .then(data => {
            const traineeList = document.getElementById('traineeList');
            traineeList.innerHTML = '';

            // Add "Reserve for self" option at the top
            const reserveSelf = document.createElement('li');
            reserveSelf.classList.add('reserve-self');
            reserveSelf.innerHTML = `<a href="#" onclick="selectTrainee('${username}', '${currentContentId}')">Reserve for Self</a>`;
            traineeList.appendChild(reserveSelf);

            // Add trainees to the list
            data.forEach(trainee => {
                const listItem = document.createElement('li');
                listItem.classList.add('reserve-trainee');
                listItem.innerHTML = `<a href="#" onclick="selectTrainee('${trainee.name}', '${currentContentId}')">${trainee.name}</a>`;
                traineeList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching trainees:', error));
}

let selectedTrainee = null;

function selectTrainee(traineeName) {
    selectedTrainee = traineeName;
    // Highlight selected item or provide visual feedback
    const listItems = document.querySelectorAll('#traineeList li a');
    listItems.forEach(item => item.classList.remove('selected'));
    
    const reserveSelf = document.querySelector('.reserve-self');
    if (traineeName === localStorage.getItem('username')) {
        reserveSelf.classList.add('selected');
    } else {
        reserveSelf.classList.remove('selected');
    }

    const selectedItem = Array.from(listItems).find(item => item.textContent === traineeName);
    if (selectedItem) selectedItem.classList.add('selected');
}

function confirmSelection() {
    if (!selectedTrainee) {
        alert('Please select a trainee before confirming.');
        return;
    }

    console.log('Selected trainee:', selectedTrainee, 'for contentId:', currentContentId);

    // Call your custom function with both the trainee name and contentId
    reserveFrontEnd(selectedTrainee, currentContentId);

    // Close the popup
    closePopup();
}

function closePopup() {
    document.getElementById('traineePopup').style.display = 'none';
    selectedTrainee = null;

    showBooks();
}

function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.querySelector("tbody");
    const rows = Array.from(tBody.querySelectorAll("tr"));
  
    const sortedRows = rows.sort((a, b) => {
      const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
      const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
  
      // Determine if column is numeric or text
      const aIsNumeric = !isNaN(parseFloat(aColText)) && isFinite(aColText);
      const bIsNumeric = !isNaN(parseFloat(bColText)) && isFinite(bColText);
  
      if (aIsNumeric && bIsNumeric) {
        return (parseFloat(aColText) - parseFloat(bColText)) * dirModifier;
      } else {
        return aColText.localeCompare(bColText) * dirModifier;
      }
    });
  
    // Remove all existing TRs from the table
    while (tBody.firstChild) {
      tBody.removeChild(tBody.firstChild);
    }
  
    // Re-add the newly sorted rows
    tBody.append(...sortedRows);
  
    // Remember how the column is currently sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th[data-column="${column}"]`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th[data-column="${column}"]`).classList.toggle("th-sort-desc", !asc);
  }