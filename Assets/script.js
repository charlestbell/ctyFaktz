var searchInput = "";
var terms;
var population;
var pop;

//an array of objects that holds the funny fact description and the number accosiated with it.
var funFacts = [
  {
    description: "Kim's Convenience Stores",
    amount: 100,
  },
  {
    description: "Friendly neighborhood Spider men",
    amount: 100,
  },
  {
    description: "It clowns hiding in storm drains",
    amount: 100,
  },
  {
    description: "Street rats",
    amount: 100,
  },
  {
    description: "Scenic overlooks for parking",
    amount: 100,
  },
  {
    description: "Sketchy street meat carts",
    amount: 100,
  },
  {
    description: "Disney Princesses",
    amount: 100,
  },
  {
    description: "Autobots in disguise",
    amount: 100,
  },
  {
    description: "Mutant Ninja Turtles in Sewers",
    amount: 100,
  },
  {
    description: "Mutants",
    amount: 100,
  },
];

//Random number genorator to get random number for funny facts
function getrando() {
  var rando = Math.floor(Math.random() * 10);
  return rando;
}

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

    //create city name element
    var cityName = $("<h1>").text(places[0].formatted_address);
    //append city name to name div
    $("#usefulFactoids").append(cityName);
    // console.log(geonames[0].summary); //console log objects
    searchInput = places[0].name;

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
      //create sumamry element
      var summary = $("<p>").text(resp.geonames[0].summary);
      $("#usefulFactoids").append(summary);
    });
    //end of wiki api
    terms = ["Starbucks", "Resturants", "Museums", "Bowling Alley"];

    //openweatherapi

    var queryURL5Day = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=55165c51eb244bc563baf90a2d02b714`;

    //ajax call
    $.ajax({
      url: queryURL5Day,
      method: "GET",
    }).then(function (response) {
      pop = response.city.population;
      population = $("<p>").text(`Population: ${response.city.population}`);
      $("#usefulFactoids").append(population);
          //Funny facts
    for (var x = 0; x < 3; x++) {
      var index = getrando();
      var funFactAmounts = Math.round(pop / funFacts[index].amount);
      var funnyFacts = $("<p>").text(
        funFacts[index].description + ": " + funFactAmounts
      );
      $("#usefulFactoids").append(funnyFacts);
    }
    //end of funny facts
    });
    for (i = 0; i < terms.length; i++) {
      // yelp api
      const nameOfResponse = terms[i];
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

      function multiply(pop){
        if ( pop > 1000000) {
          var mult =  100000 ;
        } else {
          mult = 10000;
        };
        return mult;
      }

      multiply()

      $.ajax(settings).then(function (response) {
        console.log(response);
        // console.log("total" + response.total);
        // console.log("population" + pop);
        var perCapita = Math.ceil((response.total / pop) * multiply(pop) )  ;
        var items = $("<p>").text(nameOfResponse + " per capita: " + perCapita + "" );
        $("#usefulFactoids").append(items);
        console.log("pop = " + pop);
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
console.log(`pop: ${this.pop}`);
