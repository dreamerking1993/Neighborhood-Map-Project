var map;
var markers = [];
function initMap() {
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

  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 27.723875, lng: 85.357847},
      zoom: 13,
      styles: styles,
      mapTypeControl: false            
  });
                  
  //var Pashupati = {lat: 27.7105, lng: 85.3487}

  var locations = [
    {title: 'Pashupati Nath', location: {lat: 27.7105, lng: 85.3487}},
    {title: 'Bhaktapur Durbar Square', location: {lat: 27.6721, lng: 85.4283}},
    {title: 'Patan Durbar Square', location: {lat: 27.6727, lng: 85.3253}},
    {title: 'Basantapur', location: {lat: 27.7042, lng: 85.3065}},
    {title: 'Sundarijal', location: {lat: 27.7909, lng: 85.4272}},
    {title: 'Budhanilkantha', location: {lat: 27.7654, lng: 85.3653}},
    {title: 'Swayambhu', location: {lat: 27.7148, lng: 85.2903}}          
  ];        
        
  var largeInfowindow = new google.maps.InfoWindow();  
  var defaultIcon = makeMarkerIcon('0091ff');
  var highlightedIcon = makeMarkerIcon('FF0000');

  var bounds = new google.maps.LatLngBounds();

  for ( var i = 0; i<locations.length; i++){
      var position = locations[i].location;
      var title = locations[i].title;
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


  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);


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
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    }
  }

}
