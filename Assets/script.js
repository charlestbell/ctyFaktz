var searchInput = "";
let population;
let pop;
var usedFacts = [];

//Array which contains search parameters for yelp api call
var terms = [
  "Starbucks",
  "resturant",
  "museum",
  "bowling alley",
  "park",
  "McDonalds",
  "Chipotle",
  "hospital",
  "gym",
];

//an array of objects that holds the funny fact description and the number accosiated with it.
var funFacts = [
  {
    description: "Kim's Convenience Stores",
    amount: 0.000000645677865,
  },
  {
    description: "Friendly neighborhood Spider men",
    amount: 0.000000532345,
  },
  {
    description: "'IT' clowns hiding in storm drains",
    amount: 0.0000002,
  },
  {
    description: "Rodents Of Unusal Size",
    amount: 0.234567,
  },
  {
    description: "Dudes in long jackets selling fake watches",
    amount: 0.00003499,
  },
  {
    description: "Sketchy street meat carts",
    amount: 0.00088334,
  },
  {
    description: "Portals to Narnia",
    amount: 0.000001445,
  },
  {
    description: "Autobots in disguise",
    amount: 0.00000087234,
  },
  {
    description: "Mutant Ninja Turtles in Sewers",
    amount: 0.00000493,
  },
  {
    description: "Channing Tatems pretentending to be in high shool",
    amount: 0.0000007839,
  },
];

//Creates searchBox elemetn and appends it to the landing page
var inputBox = $("<input>")
  .attr("id", "pac-input")
  .attr("type", "text")
  .attr("placeholder", "Find a City!")
  .addClass("pac-input controls landingSearchBox rounded");

$("#searchFormEl").append(inputBox);

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
          match = true;
        }
      }
    }
  }
  usedFacts.push(rando);
  return rando;
}

async function getYelpResults(settings, x, nameOfResponse) {
  try {
    $.ajax(settings).then(function (response) {
      $(`#usefulFactoids${x}`).empty();
      var perCapita = Math.ceil(pop / response.total);
      var items = "A " + nameOfResponse + " every " + perCapita + " people.";
      $(`#usefulFactoids${x}`).append(items);
    });
  } catch (e) {
    console.error(e);
  } finally {
    $(".progress").addClass("hide");
  }
}

//Beginning of Google maps API
// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE&libraries=places">
function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 33.973019, lng: -117.328236 }, //sets the location when app is opened
    zoom: 11, //zoom increases as number increases
    mapTypeId: "roadmap",
  });

  // Create the search box and link it to the UI element.
  var input = document.querySelector("#pac-input");

  //Search box without auto correct
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", async () => {
    // Hide the landing page and reveal the search page
    if (!$("#landingPage").hasClass("hide")) {
      //If landing page is not hidden
      $("#landingPage").addClass("hide"); //Hide landing page
      $("#landingSearchCont").empty();
      $("#searchPage").removeClass("hide"); //Show search page
      $(".progress").removeClass("hide"); //Show Loading Bar
    } //End if

    //Reposition searchBox element and append it to new location on search page
    inputBox
      .removeClass()
      .attr("id", "pac-input")
      .attr("type", "text")
      .addClass("onSearchPage pac-input controls mainSearchBox rounded")
      .attr("placeholder", "Find a City!"); //reset the search bar to the placeholder text

    $("#searchBoxPage").append(inputBox);

    //Sets places to search request
    const places = searchBox.getPlaces();

    //if no results are found do nothing
    if (places.length == 0) {
      return;
    }

    // Clear out the old markers from map.
    markers.forEach((marker) => {
      marker.setMap(null);
    });

    markers = []; //Sets the array that contains markers to empty so that new locations can be added
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
    $(".cityName").text(searchInput);

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

    //GeoNames wikipedia api
    const geoSettings = {
      url:
        "http://api.geonames.org/wikipediaSearchJSON?q=" +
        searchInput +
        "&maxRows=10&username=hunter7",
      method: "GET",
    };
    $.ajax(geoSettings).then(function (resp) {
      //create sumamry element
      var summary = $("<p>").text(resp.geonames[0].summary); //font size set to large in css
      $("#citySummary").append(summary);
    });
    //end of wiki api

    //openweatherapi
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=55165c51eb244bc563baf90a2d02b714`;

    //Get city population from OpenWeathermap.org
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

        let funFactAmount = pop * funFacts[index].amount;
        if (funFactAmount < 1) {
          funFactAmount = 1;
        }

        var funFactAmounts = Math.round(funFactAmount);

        //gets fun fact description from array randomly
        var funnyFacts = funFacts[index].description;

        $(`#funFact${x}`).append(funnyFacts);
        $(`#funAmount${x}`).append(funFactAmounts);
      }
      //end of funny facts
    });
    //end of open weather api call

    //For loop that calls the yelp api
    //loop runs for each element in terms array

    for (i = 0; i < terms.length; i++) {
      // yelp api
      const nameOfResponse = terms[i];
      const x = i;
      var herokuApp = "https://kickflip-cors-anywhere.herokuapp.com/";
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
      // Wait for moment so that heroku doesn't throw a "too many requests per second" error
      await new Promise((resolve) => setTimeout(resolve, 200)); // Copied from a youtube video. https://www.youtube.com/watch?v=049FE6xa6_M
      getYelpResults(settings, x, nameOfResponse);
    }
  });
}

$("form").submit(function (e) {
  e.preventDefault();
});
