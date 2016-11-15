mapboxAccessToken = 'pk.eyJ1Ijoibm9haGciLCJhIjoiaDZOQVlFayJ9.sKF3imccqs6EJE57Y3j2SA';

startingBounds = [47.27, -120.82];
var colorPalatte = {
  'gray': '#DF5330',
  'dark_gray': '#505555',
  'green': '#238594',
  'orange': '#DF5330',
  'red': '#DF5330'
}

function getZoom() {
  return 7;
}

var map = L.map('map').setView(startingBounds, getZoom());

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken , {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.light'
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

function style(feature) {
    return {
        //fillColor: getColor(feature.properties.density),
        weight: 1,
        opacity: 1,
        color: colorPalatte.green,
        fillOpacity: 0
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: colorPalatte.dark_gray,
        fillOpacity: 0
    });

    info.update(layer.feature.properties);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}


function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
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

if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
    }
}


// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4> Housing Trust Fund Map </h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.district_n 
        : 'Hover over a state');
};

info.addTo(map);

geojson = L.geoJson(ldshapes, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);