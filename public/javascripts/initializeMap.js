var map;
var eventIdToMarker = {};
var eventIdToMarkerImagePath = {};
// var markerToEventId = {};

var colorMap = {
  'black' : '#000000',
  'blue' : '#0062EE',
  'green' : '#86D750',
  'orange' : '#FF9A02',
  'pink' : '#FF5EAB',
  'purple' : '#8837BD',
  'red' : '#D30124',
  'yellow' : '#FFD43C'
};

var colorNames = Object.keys(colorMap);

function simpleStringify (object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};

function initMap() {
  map = new google.maps.Map(document.getElementById('allmap'), {
    center: {lat: 39.915, lng: 116.404},
    zoom: 4
  });

  $.getJSON('/tempForMarker', function(data) {
      localStorage.removeItem('selectedEventId');
      var colorIndex = 0;
      
      for (var i in data) {
        var eventId = data[i]._id;
        var latitude = data[i].areaCoordinates[1];
        var longitude = data[i].areaCoordinates[0];
        var myLatLng = {lat: latitude, lng: longitude};

        var colorName = colorNames[colorIndex];
        var markerImagePath = 'images/map-marker-' + colorName + '.png';
        var colorIndicatorHashvalue = colorMap[colorName]
        eventIdToMarkerImagePath[eventId] = markerImagePath;

        // marker.title stores the id of the corresponding event (temp)
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: eventId,
          icon: markerImagePath
        });
        
        eventIdToMarker[eventId] = marker;
        // markerToEventId[simpleStringify(marker)] = eventId;
        // console.log('simpleStringify(marker): ' + simpleStringify(marker));

        var colorIndicatorCSSId = '#indicator_' + eventId;
        $(colorIndicatorCSSId).css('background', colorIndicatorHashvalue);

        colorIndex = (colorIndex + 1) % colorNames.length;

        marker.addListener('click', function() {
          this.setIcon('images/map-marker-selected.png');

          // marker.title stores the id of the corresponding event (temp)
          var thisEventId = this.title;      
          var selectedEventCellCSSId = '#cell_' + thisEventId;
          $(selectedEventCellCSSId).css('background', colorMap['pink']);      

          var oldSelectedEventId = localStorage.getItem('selectedEventId');
          if (oldSelectedEventId != null) {
            var oldSelectedMarker = eventIdToMarker[oldSelectedEventId];
            var oldSelectedMarkerImagePath = eventIdToMarkerImagePath[oldSelectedEventId];
            oldSelectedMarker.setIcon(oldSelectedMarkerImagePath);

            var oldSelectedEventCellCSSId = '#cell_' + oldSelectedEventId;
            $(oldSelectedEventCellCSSId).css('background', '#FFFFFF');
          }

          // marker.title stores the id of the corresponding event (temp)
          localStorage.setItem('selectedEventId', this.title);
        });
      }

      // console.log('markerToEventId: ' + JSON.stringify(markerToEventId));

      map.addListener('click', function() {
        for (eventId in eventIdToMarker) {
          var marker = eventIdToMarker[eventId];
          // marker.title stores the id of the corresponding event (temp)
          var originalImagePath = eventIdToMarkerImagePath[marker.title];
          marker.setIcon(originalImagePath);

          var oldSelectedEventCellCSSId = '#cell_' + eventId;
          $(oldSelectedEventCellCSSId).css('background', '#FFFFFF');
        }
      });          
  });
};