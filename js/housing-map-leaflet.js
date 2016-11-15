mapboxAccessToken = 'pk.eyJ1Ijoibm9haGciLCJhIjoiaDZOQVlFayJ9.sKF3imccqs6EJE57Y3j2SA';

startingBounds = [47.27, -120.82];

colorPalatte = {
  'gray': '#DF5330',
  'dark_gray': '#505555',
  'green': '#238594',
  'orange': '#DF5330',
  'red': '#C4222A',
  'dark_red': '#C4222A',
};

function getZoom() {
  zoom = 7
  return zoom;
}

var map = L.map('map', {zoomControl: false}).setView(startingBounds, getZoom());

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken , {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.light'
}).addTo(map);

new L.Control.Zoom({ position: 'topright' }).addTo(map);

var districtNumberDiv = document.getElementById('districtNumber');

function style(feature) {
    return {
        //fillColor: colorPalatte.orange,
        weight: 2,
        opacity: 1,
        color: colorPalatte.green,
        fillOpacity: 0
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        //fillColor: colorPalatte.orange,
        weight: 3,
        color: colorPalatte.dark_gray,
        fillOpacity: 0.2,
    });

    districtNumberDiv.update(layer.feature.properties);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}


function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });

    if (feature.properties) {
        layer.bindPopup("<span id='storyTitle'>Jane Doe's Story</span><br> from Legislative District " + feature.properties.district_n
          + '<br><span><img width="100%" src="assets/story-photo.png"</span>'
          + '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac dapibus enim, et aliquam nisi. Praesent eu laoreet risus, quis malesuada tellus. Vivamus vestibulum ef citur tortor, eu faucibus mi sollicitudin vitae. Ut eu sagittis sapien, a luctus dolor.</p>'
         );
    }
};

districtNumber.update = function (props) {
  this.innerHTML = props.district_n
}

geojson = L.geoJson(ldshapes, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);