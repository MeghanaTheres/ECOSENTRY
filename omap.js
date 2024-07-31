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
let markerCount = 0; // Variable to store marker count
let allLatLng = [];
let allPlaceDetails = [];

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );
  const myLatlng = { lat: 9.591441, lng: 76.522171 }; // Initial center (optional)

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: myLatlng,
    mapId: "DEMO_MAP_ID",
  });
  const markers = [];
  // Function to plot marker on map
  async function plotMarker(locationData) {
    if (locationData) {  // Check if locationData exists before using it
      const marker = new AdvancedMarkerElement({
        position: { lat: locationData.latitude, lng: locationData.longitude },
        map,
        title: "Saved Location",
        //content: pin.element, // Optional content for the marker
        gmpClickable: true,
      });
      markerCount++;
      markers.push(marker); // Add marker object to the array
      await marker.setMap(map);

      // Geocoding section
      const geocoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(locationData.latitude, locationData.longitude);
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            const placeDetails = results[0].formatted_address;
            allPlaceDetails.push(placeDetails);
          } else {
            console.log("No results found for this location.");
          }
        } else {
          console.error("Geocoder failed due to: " + status);
        }
      });
    } else {
      console.error("locationData is null in userLocationsRef callback.");
    }
  }
  // Read data from Firebase and plot markers
  userLocationsRef.on("child_added", (snapshot) => {
    const locationData = snapshot.val(); // Get location data from snapshot
    plotMarker(locationData); // Plot marker for each retrieved location
    allLatLng.push({ lat: locationData.latitude, lng: locationData.longitude }); // Add retrieved lat/lng to the array
  });
  const requestAcceptButton = document.getElementById("request-accept");

  requestAcceptButton.addEventListener("click", () => {
    // Clear all markers from the map
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0; // Reset the markers array
    markerCount = 0; // Reset marker count

    // Display details in a box (modify this section based on your HTML structure)
    const detailsBox = document.getElementById("details-box"); // Assuming you have an element for details
    detailsBox.innerHTML = ""; // Clear previous content

    if (allLatLng.length > 0) {
      detailsBox.innerHTML += "<h2>Details</h2>";
      for (let i = 0; i < allLatLng.length; i++) {
        detailsBox.innerHTML += `
          <p><strong>Lat/Lng:</strong> ${allLatLng[i].lat}, ${allLatLng[i].lng}</p>
          <p><strong>Place Info:</strong> ${allPlaceDetails[i] ? allPlaceDetails[i] : "No information available"}</p>

          <p>https://firebasestorage.googleapis.com/v0/b/login-e95d7.appspot.com/o/myimages%2FWaste%20in%20Qatar%20(cover%20image).jpg?alt=media&token=b86b85c3-d88c-428e-89bb-20419c03c76e</p>
        `;
      }
    } else {
      detailsBox.innerHTML += "<p>No locations found.</p>";
    }
  });
    
  
  

}

window.onload = initMap;
