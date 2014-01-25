$(document).ready(function() {
  $("#owl-example").owlCarousel();
});
(function() {
  window.addEventListener("load", function() {
    var map = new OpenLayers.Map("canvas");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);

    //35.85455&lon=136.24695
    var lonLat = new OpenLayers.LonLat(136.25, 35.85)
      .transform(
        new OpenLayers.Projection("EPSG:4326"),
        new OpenLayers.Projection("EPSG:900913")
      );
    map.setCenter(lonLat, 9);
  });
})();
