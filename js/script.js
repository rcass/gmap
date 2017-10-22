// https://developers.google.com/maps/documentation/geocoding/intro

function gMaps() {

  // setup global vars & config
  var jsonUrl = "./assets/locations.json";
  var styleUrl = "./assets/styles.json";
  var imgMarkerUrl = './assets/img/cat.svg';
  var markers = [];
  var gmapStyle;
  var defaultZoom = 13;
  var lgInfoWindow = {};
  var name = '';
  var img = '';


  // animate markers when clicked. Timeout is needed to stop animation
  var animateMarker = function (marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);

    // required to stop marker animation
    setTimeout(function () {
      marker.setAnimation(null);
    }, 700);

  };

  /**
   * Info Window Setup
   */
  lgInfoWindow = {
    window: function () {
      return new google.maps.InfoWindow({
        padding: 0,
      });
    },
  };

  var newWindow = lgInfoWindow.window();

  var infoWindowObj = {
    infoWindow: function populateInfoWindow(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker !== marker) {
        infowindow.marker = marker;
        infowindow.setContent('' +
          '<div class="info-box-custom" style="max-width: 400px; text-align: center;">' +
          '<h1 class="info-box-custom__title">' +
          marker.name +
          '</h1>' +
          '<img class="info-box-custom__img"  src="' +
          marker.img +
          '">' +
          '<span class="info-box-custom__description">' +
          // marker.description +
          '</span>' +
          '</div>'
        );

        infowindow.open(map, marker);

        // Close info window
        infowindow.addListener('closeclick', function () {
          infowindow.setMarker = null;
        });
      }
    },
  };

  // load style.json customize google maps style with SnazzyMaps
  $.getJSON(styleUrl, {
    format: "json",
  }).done(function (style) {
    gmapStyle = style;

    // load locations after loading styles
    loadLocations();
  });


  /**
   * Load location data from json file
   */
  function loadLocations() {
    $.getJSON(jsonUrl, {
      format: "json",
    }).done(function (data) {

      var dataObj = data;

      $.each(dataObj, function (key, val) {

        var lat = val.lat;
        var lng = val.lng;
        name = val.name;
        img = val.img;

        // this is used as a template for locations
        var positionObj = {
          lat: lat,
          lng: lng,
        };

        var marker = new google.maps.Marker({
          position: positionObj,
          animation: google.maps.Animation.DROP,
          icon: imgMarkerUrl,
          name: name,
          img: img,
          // description: description,
          // id: id
        });

        markers.push(marker);


        marker.addListener('click', function () {
          infoWindowObj.infoWindow(this, newWindow);
          animateMarker(this);
        });

      }); // $.each

      // finally load the map
      initMap();

    }).fail(function () {
      alert('Data didn\'t load. Something went terribly wrong 💣💣💣');
    });

  } // loadLocations();


  // init map after locations are loaded
  function initMap() {




    /**
     * The google.maps.event.addListener() event waits for
     * the creation of the infowindow HTML structure 'domready'
     * and before the opening of the infowindow defined styles
     * are applied.
     */
    google.maps.event.addListener(newWindow, 'domready', function () {
      var $iwOuter = $('.gm-style-iw'),
        $iwBackground = $iwOuter.prev(),
        $closeDiv = $iwOuter.next();
      // Added some js to help style close icons and default info box
      $iwOuter.next().addClass('gmap-close-btn');
      $closeDiv[0].innerHTML = '<img class="info-box-custom__icon" src="assets/img/close-icon.svg">';
      // Remove the background shadow DIV
      $iwBackground.children(':nth-child(2)').css({
        'display': 'none',
      });
      // Remove the white background DIV
      $iwBackground.children(':nth-child(4)').css({
        'display': 'none',
      });
    });




    // main map style
    var map = new google.maps.Map(document.getElementById('map'), {
      styles: gmapStyle,
      zoom: defaultZoom,
      center: {
        lat: 49.288312,
        lng: -123.0183267,
      },
    });

    zoomObj = {
      zoom: function () {
        zoom = map.getZoom();
        google.maps.event.addListenerOnce(map, 'bounds_changed', function () {

          this.setZoom(zoom > 15 ? 15 : zoom);

        });
      },
    };

    function showAllMarkers(data) {

      var bounds = new google.maps.LatLngBounds();
      var resultTotal;

      // Extend the boundaries of the map for each marker and display the marker
      for (var i = 0; i < markers.length; i++) {

        resultTotal = i;
        markers[i].setMap(map);
        bounds.extend(markers[i].position);

      }

      zoomObj.zoom();
      map.fitBounds(bounds);

      google.maps.event.addDomListener(window, 'resize', function () {
        map.fitBounds(bounds);
      });

    } // showAllMarkers();

    showAllMarkers();







  } // initMap();







} // gMaps