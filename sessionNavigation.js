// Function to update the navigation menu based on the 'rol' value
function updateNavigation() {
    const rol = localStorage.getItem('rol');
    const username = localStorage.getItem('username');
    const navLinks = document.getElementById('nav-links');
    
    // Clear the existing links
    navLinks.innerHTML = '';

    let Thijsknop = `<li><a href="frontdesk.html" class="navigation-link">Frontdesk</a></li>`

    let roleSpecificItems = '';

    // Set the role-specific navigation items
    if (rol === 'Trainee') {
      roleSpecificItems = `
        <li><a href="#" class="navigation-link">Learning Paths</a></li>
        <li><a href="books.html" class = "navigation-link">Library</a></li>
      `;
    } else if (rol === 'Trainer') {
      roleSpecificItems = `
        <li><a href="#" class="navigation-link">All Students</a></li>
        <li><a href="#" class="navigation-link">Library</a></li>
        <li><a href="#" class="navigation-link">Feedback Database</a></li>
        <li><a href="#" class="navigation-link">Course Database</a></li>
        <li><a href="#" class="navigation-link">Learning Paths</a></li>
      `;
    } else {
      // If role is undefined (not logged in)
      roleSpecificItems = `
      `;
    }

    // Top-right button (always present)
    let topRightButton = '';

    if (username) {
        // If the user is logged in, show the username and add a logout handler
        topRightButton = `
          <li><a href="#" class="topright-button" id="logout-button">${username} (Logout)</a></li>
        `;
    } else {
      // If the user is not logged in, link to the login page
      topRightButton = `
        <li><a href="login2.html" class="topright-button">Login</a></li>
      `;
    }

    // Update the nav with combined items
    navLinks.innerHTML = Thijsknop + roleSpecificItems + topRightButton;

    // If logged in, add an event listener for the logout button
    if (username) {
        document.getElementById('logout-button').addEventListener('click', function(event) {
        event.preventDefault();
        logout();
        });
    }
}

// Function to log the user out
function logout() {
  // Clear localStorage or remove specific items
  localStorage.removeItem('username');
  localStorage.removeItem('rol');
  localStorage.removeItem('userId');
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('loginTime');

  // Optionally redirect the user to the login page or refresh the current page
  window.location.href = 'login2.html';
}

// Function to update session time on user activity
function resetSessionTimer() {
    localStorage.setItem('loginTime', new Date().getTime());
  }

// Function to check if the session is expired
function isSessionExpired() {
    const loginTime = parseInt(localStorage.getItem('loginTime'), 10);
    if (isNaN(loginTime)) return true; // No login time stored, session expired
  
    const sessionDuration = 120 * 60 * 1000; // 120 minutes in milliseconds
    const currentTime = new Date().getTime();
  
    return (currentTime - loginTime) > sessionDuration;
}

// Function to handle session expiry
function handleSessionExpiry() {
    if (isSessionExpired()) {
        logout();
    } else {
        // Update the login time to keep the session active
        resetSessionTimer();
    }
}


// Function to check and handle session expiry periodically
function monitorSession() {
    if (isSessionExpired()) {
      logout();
    }
}

// Add event listeners for user activity
document.addEventListener('mousemove', resetSessionTimer);
document.addEventListener('keypress', resetSessionTimer);
document.addEventListener('click', resetSessionTimer);
document.addEventListener('scroll', resetSessionTimer);
  

// Call the function to update the navigation on page load
document.addEventListener('DOMContentLoaded', handleSessionExpiry);
document.addEventListener('DOMContentLoaded', updateNavigation);
  
// Check session every minute
setInterval(monitorSession, 60 * 1000);