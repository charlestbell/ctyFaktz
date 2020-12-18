let heroku = "https://cors-anywhere.herokuapp.com/";
let queryURL =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=mongolian%20grill&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&locationbias=circle:2000@47.6918452,-122.2226413&key=AIzaSyBxxikd5sBYySsC4ExQM_Y1plVzBP7Ljbk";
$.ajax({
  url: heroku + queryURL,
  method: "GET",
  dataType: "json",
}).then(function (response) {
  console.log(response);
});
