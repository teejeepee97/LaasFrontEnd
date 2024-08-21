document.addEventListener("DOMContentLoaded", () => {
  // Call the showReservations function to fetch and display the reservations
  showReservations();

  // Set up event listener for table sorting
  document.querySelectorAll(".table-sortable th").forEach((headerCell) => {
    headerCell.addEventListener("click", () => {
      const tableElement = headerCell.closest("table"); // Get the closest table element
      const headerIndex = Array.prototype.indexOf.call(
        headerCell.parentElement.children,
        headerCell
      );
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
          <td>${item.trainee.name}</td>
          <td>${item.book.contentName}</td>
          <td>${item.reservationDate}</td>
          <td class="physical-wear">${item.book.physicalWear}</td>
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
    document.querySelectorAll(".table-sortable th").forEach((headerCell) => {
      headerCell.addEventListener("click", () => {
        const tableElement = headerCell.closest("table");
        const headerIndex = Array.prototype.indexOf.call(
          headerCell.parentElement.children,
          headerCell
        );
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
  const table = document.querySelector("#reservationsTable .table-sortable");
  if (!table) return; // Exit if table is not found

  // Get all rows from the table body
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    // Get the cell containing the physical wear value (assumed to be the 5th cell)
    const physicalWearCell = row.cells[4]; // Index is 0-based (5th column)
    const wearText = physicalWearCell.textContent.trim().toUpperCase(); // Normalize text for comparison

    const ReservationStatusCell = row.cells[5]; // Index is 0-based (6th column)
    const ReservationStatusText = ReservationStatusCell.textContent
      .trim()
      .toUpperCase();

    // Apply a different color based on the cell content
    physicalWearCell.classList.remove("good", "medium", "bad"); // Remove any existing classes
    ReservationStatusCell.classlist.remove(
      "Requested",
      "uitgeleend",
      "in_afwachting"
    );

    if (wearText === "GOOD") {
      physicalWearCell.classList.add("good");
    } else if (wearText === "MEDIUM") {
      physicalWearCell.classList.add("medium");
    } else if (wearText === "BAD") {
      physicalWearCell.classList.add("bad");
    }
    if (ReservationStatusText === "IN_AFWACHTING") {
      physicalWearCell.classList.add("good");
    } else if (wearText === "UITGELEEND") {
      physicalWearCell.classList.add("medium");
    } else if (wearText === "REQUESTED") {
      physicalWearCell.classList.add("bad");
    }
  });
}

function sortTableByColumn(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  // Sort each row
  const sortedRows = rows.sort((a, b) => {
    const aColText = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const bColText = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();

    return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
  });

  // Remove all existing TRs from the table
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Re-add the newly sorted rows
  tBody.append(...sortedRows);

  // Remember how the column is currently sorted
  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
}
