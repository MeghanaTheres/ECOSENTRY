const firebaseConfig = {
  apiKey: "AIzaSyD7JhxQ-wX9AoqKg4D5OWGwaglQESI2idI",
  authDomain: "login-e95d7.firebaseapp.com",
  databaseURL: "https://login-e95d7-default-rtdb.firebaseio.com",
  projectId: "login-e95d7",
  storageBucket: "login-e95d7.appspot.com",
  messagingSenderId: "394564238855",
  appId: "1:394564238855:web:92cda1322dc249e01f34a2",
  measurementId: "G-X2CMQ2RGKW"
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Set database variable
var database = firebase.database();
const userLocationsRef = database.ref("users/locations"); // Reference to the collection
let allLatLng = [];

async function initMap() {
  
  // No map creation or library imports needed

  // Function to display details in the box
  function displayDetails(locationData) {
    const detailsBox = document.getElementById("details-box");
    detailsBox.innerHTML = ""; // Clear previous content

    if (locationData) {
      const placeInfo = locationData.placeInfo ? locationData.placeInfo : "No information available";

      detailsBox.innerHTML += `
        <h2>Details</h2>
        <p><strong>Location:</strong> ${locationData.latitude}, ${locationData.longitude}</p>
        <p><strong>Place Info:</strong> ${placeInfo}</p>
        
      `;
    } else {
      detailsBox.innerHTML += "<p>No locations found.</p>";
    }
  }

  // Read data from Firebase and display details
  userLocationsRef.on("child_added", (snapshot) => {
    const locationData = snapshot.val(); // Get location data from snapshot
    displayDetails(locationData);
    allLatLng.push({ lat: locationData.latitude, lng: locationData.longitude }); // Add retrieved lat/lng to the array
  });

  // Check for element existence before attaching event listener
  const requestAcceptButton = document.getElementById("request-accept");
  if (requestAcceptButton) {
    requestAcceptButton.addEventListener("click", () => {
      // Clear previous content in the details box
      const detailsBox = document.getElementById("details-box");
      detailsBox.innerHTML = "";

      // Display details again (optional)
      if (allLatLng.length > 0) {
        displayDetails(locationData); // Assuming you have a single locationData object after fetching
      } else {
        detailsBox.innerHTML += "<p>No locations found.</p>";
      }
    });
  } else {
    console.error("Element with ID 'request-accept' not found.");
  }
}

window.onload = initMap;
