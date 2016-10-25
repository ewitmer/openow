//add state object
//separate functions that change state of object
//add sort by ranking

var map;
var infowindow;
var pos = {lat: 43.161, lng: -77.610};
var posText = '';
var prevPage;
var nextPage;

function setState(prop, value){
  //state.prop = value;
}

function initMap() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('pac-input')),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
  }

function fillInAddress() {
    // Get the place details from the autocomplete object, update the current lng/lat coordinates,
    // place name, and display the place name on the page.
    var place = autocomplete.getPlace();
    pos.lat = place.geometry.location.lat();
    pos.lng = place.geometry.location.lng();
    posText = place.formatted_address;
    displayPlace()

   // setState(pos.lat, place.geometry.location.lat());

  }

//builds blank map then calls search function
function buildMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: pos,
    zoom: 13
  });
  infowindow = new google.maps.InfoWindow();
  searchMap();
}

//search map based on position, radius and types then displays results
function searchMap() {
  var service = new google.maps.places.PlacesService(map);

  //state.pos
  //state.typesArray
  var request = {
    location: pos,
    radius: $("select option:selected").text() * 1609.344,
    types: getTypesArray(),
    openNow: $("input[name='js-open']").prop("checked")
  };
  service.nearbySearch(request, displayResults)
}


function getTypesArray() {
  var indoorPlaces = ["aquarium", "art_gallery", "book_store", "bowling_alley", "gym", "library", "movie_theater", "museum"];
  var outdoorPlaces = ["amusement_park", "park", "stadium", "zoo"];
  var searchTypes = [];

  //state.isIndoor
  if ($("input[name='js-indoor']").prop( "checked" )) {
    searchTypes = searchTypes.concat(indoorPlaces);
  }
  if ($("input[name='js-outdoor']").prop( "checked" )) {
    searchTypes = searchTypes.concat(outdoorPlaces);
  }
  return searchTypes;
}
//builds and displays results with the help of a few helper functions
function displayResults(results, status, next_page_token) {

  var resultElement = '';
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);

      resultElement += '<li class="collection-item avatar">'+
          '<img src="'+addIcon(results[i])+'" alt="" class="circle">'+
          '<span class="title">'+addName(results[i])+'</span>'+
            '<p>'+addVicinity(results[i])+'</p>'+
            '<a href="#!" class="secondary-content">'+addRating(results[i])+'<i class="material-icons">grade</i></a>'+
            '</li>'
    }
  }
  $('#js-search-results').html(resultElement);
  //state.nextPage
  nextPage = next_page_token.l;
}

//helper function to create markers for map
function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

//helper function
function addName(place) {
  return (place.name) ? place.name : ""
}

//helper function
function addIcon(place) {
  return (place.icon) ? place.icon : ""
}

//helper function
function addVicinity(place) {
  return (place.vicinity) ? place.vicinity : ""
}

function addRating(place) {
  return (place.rating) ? place.rating : 'n/a'
}


//update lat+lng in pos object and display the location on the page when user uses 'find me'
function updateCoordinates(callback) {
  if(navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function(position) {

      pos.lat = position.coords.latitude,
      pos.lng = position.coords.longitude

        // and here you call the callback with whatever
        // data you need to return as a parameter.
      callback();
    })
  }
}

//function gets a name of the current placed based on lng/lat and reverse geocoding
function getLocation(callback) {
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({'location': pos}, function(results) {
    posText = results[0].formatted_address;

    callback();
  })
}

// displays place name on the page
function displayPlace() {
  $("#current-location").text(posText);
}


function toggleLoading(){
  $('#loading-text').toggleClass("visibility");
}

//on click update location based on where user is
$("#js-geolocate").on('click', function() {
    updateCoordinates(function() {
      getLocation(displayPlace);
      $("#pac-input").val('');
    })
  });

//on click builds a map
$('#js-search').on('click', function(e) {
  e.preventDefault();
  buildMap();
});

  $(document).ready(function() {
    $('select').material_select();
  });

    $(document).ready(function() {
    Materialize.updateTextFields();
  });
       

$(document).ready(function(){
      $('.parallax').parallax();
    });