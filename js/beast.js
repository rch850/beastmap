var map;

$(document).ready(function() {
  // マップの表示
  map = new OpenLayers.Map("canvas");
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

// AngularJS のコントローラ
function BeastCtrl($scope, $http) {
  // データを読み込んで反映する
  $http.get("data/h24shichobetsu.json").
    success(function(data, status, headers, config) {
      $scope.beasts = data.chouju.map(function(c) {
        return {name: c["鳥獣名"], imageUrl: "#"};
      });

      // カルーセルのセットアップ
      // 時間をあけて実行しないとうまくいかない
      setTimeout(function() {
        $("#owl-example").owlCarousel();
      }, 300);

      // 画像一覧を取ってくる
      $http.get("data/chouju_images.json").
        success(function(data, status, headers, config) {
          data.chouju.forEach(function(c) {
            $scope.beasts.forEach(function(b) {
              if (b.name === c["鳥獣名"]) {
                b.imageUrl = c["画像"];
              }
            });
          });
        });
    }).
    error(function(data, status, headers, config) {
    });

  $scope.click = function(name) {
    function createCircle(lat, lng) {
      // 円の描画参考: http://blog.be-style.jpn.com/article/55441141.html
      // createRegularPolygon 参考: http://osgeo-org.1560.x6.nabble.com/createRegularPolygon-circle-radius-units-td5000250.html

      var point = new OpenLayers.Geometry.Point(lat, lng);
      point.transform(
          new OpenLayers.Projection("EPSG:4326"),
          map.getProjectionObject());

      var sunpoly = OpenLayers.Geometry.Polygon.createRegularPolygon(point, 8000, 36, 0);
      var circle = new OpenLayers.Feature.Vector(sunpoly, null, null);
      var layer = new OpenLayers.Layer.Vector("Circle", {style: {
        strokeColor: "#FF6347",
          fillColor: "#FF6347",
          fillOpacity: 0.2,
          strokeWidth: 4,
          pointRadius: 10
      }});
      layer.addFeatures([circle]);

      return layer;
    }
    map.addLayer(createCircle(136.25, 35.85));
  };
}
