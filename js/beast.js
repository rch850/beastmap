$(document).ready(function() {
  // マップの表示
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
}
