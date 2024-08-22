document.addEventListener("DOMContentLoaded", () => {
  // Call the showReservations function to fetch and display the reservations
  showReservations();

  // Set up event listener for table sorting
  document.querySelectorAll(".table-sortable th").forEach((headerCell, index) => {
    headerCell.setAttribute("data-column", index);
    headerCell.addEventListener("click", () => {
      const tableElement = headerCell.closest("table"); // Get the closest table element
      const headerIndex = parseInt(headerCell.getAttribute("data-column"), 10);
      const currentIsAscending = headerCell.classList.contains("th-sort-asc");

      sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
  });
});

async function showReservations() {
  console.log("Fetching reservations...");
  try {
    const response = await fetch("http://localhost:8082/showReservations");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();

    let tableHTML = `
      <table class="table table-sortable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Content Name</th>
            <th>Content ID</th>
            <th>Date</th>
            <th>Physical Wear</th>
            <th>Reservation Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let item of json) {
      tableHTML += `
        <tr>
          <td>${item.userName}</td>
          <td>${item.book.contentName}</td>
          <td>${item.contentId}</td>
          <td>${item.reservationDate}</td>
          <td>${item.book.physicalWear}</td>
          <td>${item.reservationStatus}</td>
        </tr>
      `;
    }

    tableHTML += `
        </tbody>
      </table>
    `;

    const tableContainer = document.getElementById("reservationsTable");
    tableContainer.innerHTML = tableHTML;

    // Recolor table cells after the table is populated
    recolorCells();

    // Reattach the sorting functionality after the table is rendered
    document.querySelectorAll(".table-sortable th").forEach((headerCell, index) => {
      headerCell.setAttribute("data-column", index);
      headerCell.addEventListener("click", () => {
        const tableElement = headerCell.closest("table");
        const headerIndex = parseInt(headerCell.getAttribute("data-column"), 10);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");

        sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
      });
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
}

// Function to recolor table cells based on their text content
function recolorCells() {
  // Get the table element by class
  const table = document.querySelector("#reservationsTable .table");
  if (!table) return; // Exit if table is not found

  // Get all rows from the table body
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    // Get the cell containing the value (assumed to be in the last cell)
    const valueCell = row.cells[row.cells.length - 1]; // Adjust if needed
    const cellText = valueCell.textContent.trim().toUpperCase(); // Normalize text for comparison

    // Apply a different color based on the cell content
    valueCell.classList.remove("good", "medium", "bad"); // Remove any existing classes

    if (cellText === "GOOD") {
      valueCell.classList.add("good");
    } else if (cellText === "MEDIUM") {
      valueCell.classList.add("medium");
    } else if (cellText === "BAD") {
      valueCell.classList.add("bad");
    }
  });
}

function sortTableByColumn(table, column, asc = true) {
  console.log(table)
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
