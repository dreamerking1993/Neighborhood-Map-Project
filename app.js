var map, largeInfowindow, defaultIcon, bounds, highlightedIcon, s;
let searchedForText;
var markers = [];
var locations = [
  {title: 'Pashupatinath Temple', location: {lat: 27.7105, lng: 85.3487}},
  {title: 'Bhaktapur Durbar Square', location: {lat: 27.6721, lng: 85.4283}},
  {title: 'Patan Durbar Square', location: {lat: 27.6727, lng: 85.3253}},
  {title: 'Kathmandu Durbar Square', location: {lat: 27.7043, lng: 85.3074}},
  {title: 'Sundarijal', location: {lat: 27.7909, lng: 85.4272}},
  {title: 'Budhanilkantha Temple', location: {lat: 27.7654, lng: 85.3653}},
  {title: 'Swayambhunath', location: {lat: 27.7148, lng: 85.2903}},
  {title: 'Boudhanath', location: {lat: 27.7214, lng: 85.3619}},
  {title: 'Changu Narayan T', location: {lat: 27.7162, lng: 85.4278}}                      
]; 

var styles = [
  {
    featureType: 'water',
    stylers: [
      { color: '#19a0d8' }
    ]
  },{
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#ffffff' },
      { weight: 6 }
    ]
  },{
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#e85113' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#efe9e4' },
      { lightness: -40 }
    ]
  },{
    featureType: 'transit.station',
    stylers: [
      { weight: 9 },
      { hue: '#e85113' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [
      { visibility: 'off' }
    ]
  },{
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      { lightness: 100 }
    ]
  },{
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      { lightness: -100 }
    ]
  },{
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      { visibility: 'on' },
      { color: '#f0e4d3' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#efe9e4' },
      { lightness: -25 }
    ]
  }
];

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 27.723875, lng: 85.357847},
        zoom: 13,
        styles: styles,
        mapTypeControl: false            
    });
                    
          
    largeInfowindow = new google.maps.InfoWindow();  
    defaultIcon = makeMarkerIcon('0091ff');
    highlightedIcon = makeMarkerIcon('FF0000');

    bounds = new google.maps.LatLngBounds();

    placeMarker(ViewModel.locationList());

    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);


}

function placeMarker(place) {
    markers =[];
    for ( var i = 0; i<place.length; i++){
        var position = place[i].location;
        var title = place[i].title;
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
          // Push the marker to our array of markers.
        markers.push(marker);
        bounds.extend(markers[i].position);

        marker.addListener('mouseover', function() {
          this.setIcon(highlightedIcon);
        });  

        marker.addListener('mouseout', function() {
          this.setIcon(defaultIcon);
        });       

        marker.addListener('click',function() {
          populateInfoWindow(this, largeInfowindow);
        });

    }  
}


function makeMarkerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
      return markerImage;
}

function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    //infowindow.setContent('<p>' + s + '<p>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.marker = null;
    });
  }
}


var ViewModel = {
    self: this,
    query: ko.observable(''),
    locationList: ko.observableArray([]),
    ram: function() {    
        for(var j = 0; j<locations.length; j++) {
            this.locationList.push(locations[j]);
        }
    },       

    popInfo: function(place) {
        var index = locations.indexOf(place);
        populateInfoWindow(markers[index], largeInfowindow);
        passPlaceName(place.title);
        startFetch(10, 200);


    },

    search: function(value) {
        ViewModel.locationList.removeAll();
        for( var k = 0; k<locations.length; k++) {
            if (locations[k].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                ViewModel.locationList.push(locations[k]);
                markers[k].setVisible(true);
                largeInfowindow.close();
            }
            else {
                markers[k].setVisible(false);
            }
        }

    }
    
}  
function passPlaceName (name) {
    searchedForText = name;
}

/* #########fetching data from wikipedia */
var textbox = document.getElementById("textbox");
    //var button = document.getElementById("button");
    //var searchKeyword = document.getElementById("search-keyword").val;
    const searchField = document.querySelector('#search-keyword');
    //let searchedForText;
        
    var tempscript = null, minchars, maxchars, attempts;

    function startFetch(minimumCharacters, maximumCharacters, isRetry) {
      event.preventDefault();
      //searchedForText = searchField.value;
      if (tempscript) return; // a fetch is already in progress
      if (!isRetry) {
        attempts = 0;
        minchars = minimumCharacters; // save params in case retry needed
        maxchars = maximumCharacters;
        //button.disabled = true;
        //button.style.cursor = "wait";
      }
      tempscript = document.createElement("script");
      tempscript.type = "text/javascript";
      tempscript.id = "tempscript";
      tempscript.src = "http://en.wikipedia.org/w/api.php"
        + "?action=query&prop=extracts&exintro=&explaintext=&titles=" + searchedForText + " "
        + "&exchars="+maxchars+"&format=json&callback=onFetchComplete&requestid="
        + Math.floor(Math.random()*999999).toString();
      document.body.appendChild(tempscript);
      // onFetchComplete invoked when finished
      //https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Kathmandu
    }

    function onFetchComplete(data) {
      document.body.removeChild(tempscript);
      tempscript = null
      s = getFirstProp(data.query.pages).extract;
      if(s == undefined) {
        //debugger
        alert("Error, wikipedia search gives no result");
      } else {
          s = htmlDecode(stripTags(s));
          if (s.length > minchars || attempts++ > 5) {
            textbox.value = s;
            largeInfowindow.setContent('<p>' + s + '<p>');

            //button.disabled = false;
            //button.style.cursor = "auto";
          } else {
            startFetch(0, 0, true); // retry
          }
        }  
    }

    function getFirstProp(obj) {
      for (var i in obj) return obj[i];
    }

    // This next bit borrowed from Prototype / hacked together
    // You may want to replace with something more robust
    function stripTags(s) {
      return s.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "");
    }
    function htmlDecode(input){
      var e = document.createElement("div");
      e.innerHTML = input;
      return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

/*############################################## */

ViewModel.ram();
ViewModel.query.subscribe(ViewModel.search);

ko.applyBindings(ViewModel);