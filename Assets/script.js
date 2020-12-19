var searchInput = "";
var terms;
var population;
var pop;
// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE&libraries=places">
function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 33.973019, lng: -117.328236 }, //sets the location when app is opened
    zoom: 11, //zoom increases as number increases
    mapTypeId: "roadmap",
  });

  //Auto complete parameters which limits the search to cities
  // var options = {
  // types: ['(cities)'],
  // componentRestrictions: {country: "us"} //sets the search to a specific country
  //  };

  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");

  //Search box without auto correct
  const searchBox = new google.maps.places.SearchBox(input);

  //Search box with auto correct
  // const searchBox = new google.maps.places.Autocomplete(input, options);

  //attaches search bar to map
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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
    /////////////////////////////////////
    console.log(places);

    //create city name element
    var cityName = $("<h1>").text(places[0].formatted_address);
    //append city name to name div
    $(".name").append(cityName);

    // console.log(geonames[0].summary); //console log objects
    searchInput = places[0].name;

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
    //wikipedia api
    const geoSettings = {
      url:
        "http://api.geonames.org/wikipediaSearchJSON?q=" +
        searchInput +
        "&maxRows=10&username=hunter7",
      //   // url: "http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=hunter7",
      //   // url: "http://api.geonames.org/getJSON?geonameId=8096217&username=hunter7",//this is good alot of info but still need the geoname id
      //   // url: "http://api.geonames.org/wikipediaBoundingBoxJSON?north=34.033481&south=33.907677&east=-117.54897&west=-117.615501&username=hunter7", //this gets the summary
      method: "GET",
    };
    $.ajax(geoSettings).then(function (resp) {
      console.log("geonames");
      console.log(resp);
      //create sumamry element
      var summary = $("<p>").text(resp.geonames[0].summary);
      $(".summary").append(summary);
    });
    //end of wiki api
     terms = ["Starbucks", "Resturants", "Museums", "Bowling Alley"];

    
  // });
// }

    //openweatherapi

    var queryURL5Day = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=55165c51eb244bc563baf90a2d02b714`;

    //ajax call
    $.ajax({
      url: queryURL5Day,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      console.log(response.city.population);
      pop = response.city.population;
      population = $("<p>").text(`Population: ${response.city.population}`);
      $(".summary").append(population);
    });
    var queryURLcur = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=55165c51eb244bc563baf90a2d02b714`;

    $.ajax({
      url: queryURLcur,
      method: "GET",
    }).then(function (response) {
      console.log(`weather`);
      console.log(response);
    });
    //end of open weather

    for ( i = 0; i < terms.length; i++) {
      // yelp api
      const nameOfResponse = terms[i]
      var herokuApp = "https://cors-anywhere.herokuapp.com/";
      var settings = {
        async: true,
        crossDomain: true,
        url:
          herokuApp +
          "https://api.yelp.com/v3/businesses/search?term=" +
          terms[i] +
          "&location=" +
          searchInput +
          "&limit=50&offset=51",
        method: "GET",
        headers: {
          Authorization:
            "Bearer vvvcCtcJU8SYfZfJOTtjqBoJWMEil9uycqIhOZ29UVDqHxQezCjKDUbSCkeAwmsrX4sRpOZffUZihfpWj08qre6NrhPhTeVzhBOhHjNcjDN2XHLYFvPVcgvDl5TZX3Yx",
          // "Access-Control-Allow-Origin": "*"
        },
      
      };

      $.ajax(settings).then(function (response) {
        // console.log(nameOfResponse);
        // console.log("total" + response.total);
        // console.log("population" + pop);
        var perCapita = (response.total / pop) ;
        var items = $("<p>").text(nameOfResponse+ " per capita: " + perCapita);
        $(".summary").append(items);
      });
    }
  });
}

//data api

//     var newtag = $("<h1>").text(resp.geonames[0].summary);
//         $("h1").append(newtag);

// const settings = {
//   async: true,
//   crossDomain: true,
//   url: "https://world-geo-data.p.rapidapi.com/cities/8096217",
//   method: "GET",
//   headers: {
//     "x-rapidapi-key": "7d0f311c39msh58381986eafbd8fp19ed1djsnfeb535bffdf7",
//     "x-rapidapi-host": "world-geo-data.p.rapidapi.com",
//   },
// };

// $.ajax(settings).done(function (response) {
//   console.log(response);
//   var newtag = $("<h1>").text(response.population);
//   $("h1").append(newtag);
// });

let heroku = "https://cors-anywhere.herokuapp.com/";
let queryURL =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=restaurants+in+sydney&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&locationbias=circle:2000@47.6918452,-122.2226413&key=AIzaSyBxxikd5sBYySsC4ExQM_Y1plVzBP7Ljbk";

$.ajax({
  url: heroku + queryURL,
  method: "GET",
  dataType: "json",
}).then(function (response) {
  //   console.log("places sydney");
  //   console.log(response);
});
