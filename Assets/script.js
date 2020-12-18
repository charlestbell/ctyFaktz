<<<<<<< HEAD

// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE&libraries=places">
function initAutocomplete() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 33.973019, lng: -117.328236 }, //sets the location when app is opened
      zoom: 11, //zoom increases as number increases
      mapTypeId: "roadmap",
    });
    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();


      console.log(places);  //console log objects

      ///////////////////////
      places.forEach((place) => {

        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
  
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);

    });
  }

  //data api
  const geoSettings = {
    url: "http://api.geonames.org/wikipediaSearchJSON?q=eastvale&postalcode=92880&maxRows=10&username=hunter7",
    // url: "http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=hunter7",
    // url: "http://api.geonames.org/getJSON?geonameId=8096217&username=hunter7",//this is good alot of info but still need the geoname id
    // url: "http://api.geonames.org/wikipediaBoundingBoxJSON?north=34.033481&south=33.907677&east=-117.54897&west=-117.615501&username=hunter7", //this gets the summary
    method: "GET",
};
$.ajax(geoSettings).then(function (resp) {
    console.log("geonames");
    console.log(resp);
//     var newtag = $("<h1>").text(resp.geonames[0].summary);
//         $("h1").append(newtag);
});
const settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://world-geo-data.p.rapidapi.com/cities/8096217",
  "method": "GET",
  "headers": {
      "x-rapidapi-key": "7d0f311c39msh58381986eafbd8fp19ed1djsnfeb535bffdf7",
      "x-rapidapi-host": "world-geo-data.p.rapidapi.com"
  }
};


$.ajax(settings).done(function (response) {
  console.log(response);
  var newtag = $("<h1>").text(response.population);
      $("h1").append(newtag);
});
=======
let queryURL =
  "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyBxxikd5sBYySsC4ExQM_Y1plVzBP7Ljbk";
$.ajax({
  url: queryURL,
  method: "GET",
  dataType: "json",
}).then(function (response) {
  console.log(response);
});
>>>>>>> 81233e625a7ed0f98f1b14cf78fb9cf0b5f39d1f
