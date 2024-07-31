
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
const userLocationRef = database.ref("users/location/");

const markers = [];
async function initMap() {
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );
  const myLatlng = { lat: 9.591441, lng: 76.522171 };
  const title = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: myLatlng,
    mapId: "DEMO_MAP_ID",
  });


 
  // Add a marker at the center of the map (optional)
  // addMarker(myLatlng, map);

  // Configure click listener to capture user clicks
  map.addListener("click", (event) => {
    const clickedLatLng = event.latLng; // Get latitude and longitude from click event
    saveLocationToFirebase(clickedLatLng); // Call function to save data
    addMarker(clickedLatLng, map); // Optionally add marker at clicked location
  });

  let infoWindow = new google.maps.InfoWindow
  
    infoWindow.open(map);
    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
      // Close the current InfoWindow.
      infoWindow.close();
      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
      );
      infoWindow.open(map);
      
    });
    const locationButton = document.createElement("button");

  locationButton.textContent = "Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  return {};
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindow.open(map);
}

async function addMarker(location, map) {
  // Add the marker at the clicked location
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );
  const marker = new AdvancedMarkerElement({
    position: location,
    map,
    title: "a",
    //content: pin.element,
    gmpClickable: true,
  });
  markers.push(marker);
  marker.addListener("click", () => {
    marker.setMap(null);
    markers.splice(markers.indexOf(marker), 1);
  });
}

function saveLocationToFirebase(latLng, imageUrl) {
  const userLocationsRef = database.ref("users/locations");
  const locationKey = userLocationsRef.push().key;

  // Set user location data under the generated key
  userLocationsRef.child(locationKey).set({
    latitude: latLng.lat(),
    longitude: latLng.lng(),
    imagePath: imageUrl || null, // Set null if no image uploaded
  })
    .then(() => {
      console.log("User location saved successfully!");
    })
    .catch((error) => {
      console.error("Error saving location:", error);
    });
}

function saveLocationToFirebaseWithImage(clickedLatLng, downloadURL) {
  // Call saveLocationToFirebase with retrieved data
  saveLocationToFirebase(clickedLatLng, downloadURL);
}

function save() {
  // Image upload functionality
  var files = document.getElementById('image-input').files;

  if (files.length === 0) {
    alert("Please select an image to upload.");
    return;
  }

  const ImgToUpload = files[0];
  const ImgName = ImgToUpload.name + '.' + ImgToUpload.type.split('/')[1];  // Get extension

  const storageRef = storage.ref().child(`images/${ImgName}`);
  const UploadTask = storageRef.put(ImgToUpload);

  UploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    },
    (error) => {
      alert("Error uploading image: " + error.message);
    },
    () => {
      getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
        console.log('Image uploaded successfully:', downloadURL);
        userLocationRef.once('value').then(function(snapshot) {
          const clickedLatLng = snapshot.val().clickedLatLng;
          // Pass data to saveLocationToFirebaseWithImage
          saveLocationToFirebaseWithImage(clickedLatLng, downloadURL);
        })});
      });
    }


// Move the code related to document ready and save functionality outside initMap:
document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('submit').addEventListener('click', save); // Assuming this is for a separate save functionality

  // ... other code related to the submit button (if needed)
});

initMap();
