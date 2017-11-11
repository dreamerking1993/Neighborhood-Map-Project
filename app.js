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


  }

  document.getElementById('zoom-to-area').addEventListener('click', function() {
    //debugger
    zoomToArea();
    //debugger
  })

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

  function zoomToArea() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('zoom-to-area-text').value;
    var request = {
       'address': address
        //componentRestrictions: {country: 'Nepal'}
      }

    if (address == '') {
      window.alert('You must enter an area, or address.');
    }
    else {
      geocoder.geocode(request, function(results, status) {
     //geocoder.geocode({componentRestrictions: {country: 'Nepal'}}, function(results, status)   
        if (status == 'OK') {
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
        } else {
          alert('We could not find the location: "'+ address +'" - try entering a more' +
                    ' specific place.');
        }
      });          
    }

  }  
               
}
