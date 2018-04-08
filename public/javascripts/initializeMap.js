var map;
var eventIdToMarker = {};
var eventIdToMarkerImagePath = {};

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
var colorNamesArray = Object.keys(colorMap);

var selectedMarkerImagePath = 'images/map-marker-selected.png';

// 1. Get the selected eventId from localStorage
// 2. un-highlight event's marker and event's cell
function unselectMarkerAndCell() {
  var oldSelectedEventId = localStorage.getItem('selectedEventId');
  
  if (oldSelectedEventId != null) {
    var oldSelectedMarker = eventIdToMarker[oldSelectedEventId];
    var oldSelectedMarkerImagePath = eventIdToMarkerImagePath[oldSelectedEventId];
    oldSelectedMarker.setIcon(oldSelectedMarkerImagePath);

    var oldSelectedCell = $('#cell_' + oldSelectedEventId);
    oldSelectedCell.css('background', '#FFFFFF');
  }
};

// 1. Get the marker from the eventIdToMarker map
// 2. Highlight event's marker and event's cell
function selectMarkerAndCell(eventId) {
  var marker = eventIdToMarker[eventId];

  marker.setIcon(selectedMarkerImagePath);

  var table = $('.list-group');
  var selectedCell = $('#cell_' + eventId);
  selectedCell.css('background', colorMap['pink']);
  scrollToCertainCell(table, selectedCell);

  localStorage.setItem('selectedEventId', eventId);
};

function assignColorToColorIndicator(colorName, eventId, markerImagePath) {
  var colorIndicatorHashvalue = colorMap[colorName]      
  var colorIndicatorCSSId = '#indicator_' + eventId;
  $(colorIndicatorCSSId).css('background', colorIndicatorHashvalue);    
}

// Helper method from:
// https://stackoverflow.com/questions/2905867/how-to-scroll-to-specific-item-using-jquery?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
// NEED TO FIGURE OUT WHY IT WORKS
function scrollToCertainCell(container, targetCell) {
  container.animate({
      scrollTop: targetCell.offset().top - container.offset().top + container.scrollTop()
  });
};

function initMap() {
  map = new google.maps.Map(document.getElementById('allmap'), {
    center: {lat: 39.915, lng: 116.404},
    zoom: 4
  });

  $.getJSON('/tempForMarker', function(data) {
      localStorage.removeItem('selectedEventId');
      
      for (var i in data) {
        (function(){
        var eventId = data[i]._id;
        var eventName = data[i].name;
        var latitude = data[i].areaCoordinates[1];
        var longitude = data[i].areaCoordinates[0];
        var myLatLng = {lat: latitude, lng: longitude};

        var colorIndex = i % colorNamesArray.length;
        var colorName = colorNamesArray[colorIndex];    
        var markerImagePath = 'images/map-marker-' + colorName + '.png';
        
        assignColorToColorIndicator(colorName, eventId, markerImagePath);
        eventIdToMarkerImagePath[eventId] = markerImagePath;

        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: eventName,
          icon: markerImagePath
        });
        eventIdToMarker[eventId] = marker;

        marker.addListener('click', function() {
          // console.log('marker clicked');
          unselectMarkerAndCell();
          selectMarkerAndCell(eventId);          
        });

        var selectedCell = $('#cell_' + eventId);
        selectedCell.click(function(){          
          unselectMarkerAndCell();
          selectMarkerAndCell(eventId);          
        });
       }());
      }

      map.addListener('click', function() {
        // console.log('map clicked');
        unselectMarkerAndCell();
      });          
  });
};