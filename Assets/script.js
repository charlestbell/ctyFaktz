var searchInput = "";
var terms;
var population;
var pop;
var usedFacts = [];

//an array of objects that holds the funny fact description and the number accosiated with it.
var funFacts = [
  {
    description: "Kim's Convenience Stores",
    amount: 8.5,
  },
  {
    description: "Friendly neighborhood Spider men",
    amount: 20,
  },
  {
    description: "'IT' clowns hiding in storm drains",
    amount: 8,
  },
  {
    description: "Street rats",
    amount: 2,
  },
  {
    description: "Scenic overlooks for parking",
    amount: 11.25,
  },
  {
    description: "Sketchy street meat carts",
    amount: 10.75,
  },
  {
    description: "Disney Princesses",
    amount: 12,
  },
  {
    description: "Autobots in disguise",
    amount: 9,
  },
  {
    description: "Mutant Ninja Turtles in Sewers",
    amount: 15,
  },
  {
    description: "Mutants",
    amount: 1.5,
  },
];
//Function to determine the fun fact amount based of of population total
function amount(population, index) {
  var amount;
  if (population < 50000) amount = funFacts[index].amount * 100;
  else if (population > 50000 && population < 150000)
    amount = funFacts[index].amount * 200;
  else if (population > 150000 && population < 250000)
    amount = funFacts[index].amount * 300;
  else if (population > 250000 && population < 350000)
    amount = funFacts[index].amount * 400;
  else if (population > 350000 && population < 450000)
    amount = funFacts[index].amount * 500;
  else if (population > 450000 && population < 550000)
    amount = funFacts[index].amount * 600;
  else if (population > 550000 && population < 650000)
    amount = funFacts[index].amount * 700;
  else if (population > 650000 && population < 750000)
    amount = funFacts[index].amount * 800;
  else if (population > 750000 && population < 850000)
    amount = funFacts[index].amount * 90;
  else amount = funFacts[index].amount * 10000;

  return amount;
}

//Random number genorator to get random number for funny facts
//function also checks if random number has already been generated in current sequence
function getrando() {
  var match = true;
  while (match) {
    match = false;
    var rando = Math.floor(Math.random() * 10);
    if (usedFacts[0] === null) {
      //If used fact array is empty push random number to array
      usedFacts.push(rando);
      match = false;
    } else {
      for (var x = 0; x < usedFacts.length; x++) {
        if (usedFacts[x] === rando) {
          console.log(`Issue found`);
          match = true;
        }
      }
    }
  }
  console.log(usedFacts);
  usedFacts.push(rando);
  return rando;
}
//beginning of Google maps API
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
  // var usedFacts = [];  //////////////////////////////\\\\\\\\\\

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    $(".progress").removeClass("hide"); //Show Loading Bar

    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers from map.
    markers.forEach((marker) => {
      marker.setMap(null);
    });

    markers = [];
    usedFacts = []; //Sets the array that contains the fun fact indexes that have bveen used to null or empty.

    $("#cityDetails").empty(); //Empties out element that contains the city name and population
    $("#citySummary").empty();

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    //create city name element
    var cityName = $("<h4>")
      .text(places[0].formatted_address)
      .addClass("bold-text mt-1");

    //append city name to name div
    $("#cityDetails").append(cityName);

    //Stores the user input in a variable for later use
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
      // url: "http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=hunter7",
      // url: "http://api.geonames.org/getJSON?geonameId=8096217&username=hunter7",//this is good alot of info but still need the geoname id
      // url: "http://api.geonames.org/wikipediaBoundingBoxJSON?north=34.033481&south=33.907677&east=-117.54897&west=-117.615501&username=hunter7", //this gets the summary
      method: "GET",
    };
    $.ajax(geoSettings).then(function (resp) {
      //create sumamry element
      var summary = $("<p>").text(resp.geonames[0].summary);
      $("#citySummary").append(summary);
    });
    //end of wiki api

    //openweatherapi
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=55165c51eb244bc563baf90a2d02b714`;

    //ajax call
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      pop = response.city.population;
      population = $("<p>").text(`Population: ${response.city.population}`);
      $("#cityDetails").append(population);

      //Funny facts
      for (var x = 0; x < 4; x++) {
        $(`#funFact${x}`).empty();
        $(`#funAmount${x}`).empty();

        var index = getrando(); //Gets random number that has not been called

        var funFactAmounts = Math.round(pop / amount(pop, index));
        var funnyFacts = funFacts[index].description; //gets fun fact description from array randomly
        $(`#funFact${x}`).append(funnyFacts);
        $(`#funAmount${x}`).append(funFactAmounts);
      }
      //end of funny facts
    });
    //end os open weather api call

    //Array which contains search parameters for yelp api call
    terms = [
      "Starbucks",
      "resturant",
      "museum",
      "bowling alley",
      "park",
      "McDonalds",
    ];

    //For loop that calls the yelp api
    //loop runs for each element in terms array
    for (i = 0; i < terms.length + 1; i++) {
      // yelp api
      const nameOfResponse = terms[i];
      const x = i;
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
        $(`#usefulFactoids${x}`).empty();
        var perCapita = Math.ceil(pop / response.total);

        var items =
          "There is 1 " + nameOfResponse + " per " + perCapita + " people.";
        $(`#usefulFactoids${x}`).append(items);
        $(".progress").addClass("hide"); //Hide Loading Bar
      });
    }
  });
}

$("form").submit(function (e) {
  e.preventDefault();
});

$("form").keypress(function (event) {
  if (event.key == "Enter") {
    $("#searchButton").click();
  }
});

$("#searchButton").click(function () {
  initAutocomplete();
});

//Google places api | Need to look into this to see if we can pull pictures from it
//Currently not in use
// let heroku = "https://cors-anywhere.herokuapp.com/";
// let queryURL =
//   "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=restaurants+in+sydney&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&locationbias=circle:2000@47.6918452,-122.2226413&key=AIzaSyBxxikd5sBYySsC4ExQM_Y1plVzBP7Ljbk";
// $.ajax({
//   url: heroku + queryURL,
//   method: "GET",
//   dataType: "json",
// }).then(function (response) {});
