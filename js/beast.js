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
        return {name: c["鳥獣名"], imageUrl: "#", data: c};
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
                b.citeUrl = c["元データ"];
              }
            });
          });
        });
    }).
    error(function(data, status, headers, config) {
    });

  $scope.click = function(name) {
    // 登録済みのレイヤーを全部削除
    map.getLayersByName("Circle").forEach(function(layer) {
      map.removeLayer(layer);
    });

    var beast = $scope.beasts.filter(function(b) {
      return b.name === name;
    });
    if (beast.length <= 0) { return; }
    beast = beast[0];

    // 円の描画参考: http://blog.be-style.jpn.com/article/55441141.html
    // createRegularPolygon 参考: http://osgeo-org.1560.x6.nabble.com/createRegularPolygon-circle-radius-units-td5000250.html

    var layer = new OpenLayers.Layer.Vector("Circle", {style: {
      strokeColor: "#FF6347",
        fillColor: "#FF6347",
        fillOpacity: 0.2,
        strokeWidth: 4,
        pointRadius: 10
    }});

    function createCircle(lat, lng, radius) {
      var point = new OpenLayers.Geometry.Point(lng, lat);
      point.transform(
          new OpenLayers.Projection("EPSG:4326"),
          map.getProjectionObject());

      var sunpoly = OpenLayers.Geometry.Polygon.createRegularPolygon(point, radius, 36, 0);
      var circle = new OpenLayers.Feature.Vector(sunpoly, null, null);
      return circle;
    };

    function getBeastCount(city) {
      var key, count = 1;
      for (key in beast.data) {
        if (key.indexOf(city) === 0) {
          count += parseInt(beast.data[key]) || 0;
        }
      }
      console.log(city + " => " + count);
      return Math.sqrt(count) * 1000;
    }

    layer.addFeatures([
        createCircle(36.05475, 136.22266, getBeastCount("福井市")),
        createCircle(36.08513, 136.2979, getBeastCount("永平寺町")),
        createCircle(36.21653, 136.23644, getBeastCount("あわら市")),
        createCircle(36.17164, 136.22752, getBeastCount("坂井市")),
        createCircle(35.97962, 136.49737, getBeastCount("大野市")),
        createCircle(36.05654, 136.51385, getBeastCount("勝山市")),
        createCircle(35.94989, 136.19524, getBeastCount("鯖江市")),
        createCircle(35.88149, 136.35935, getBeastCount("池田町")),
        createCircle(35.90068, 136.15885, getBeastCount("越前市")),
        createCircle(35.82333, 136.21069, getBeastCount("南越前町")),
        createCircle(35.97045, 136.1331, getBeastCount("越前町")),
        createCircle(35.63353, 136.08469, getBeastCount("敦賀市")),
        createCircle(35.59529, 135.96281, getBeastCount("美浜町")),
        createCircle(35.53497, 135.91132, getBeastCount("若狭町")),
        createCircle(35.48494, 135.75545, getBeastCount("小浜市")),
        createCircle(35.48578, 135.55083, getBeastCount("高浜町")),
        createCircle(35.47824, 135.61606, getBeastCount("おおい町")),
    ]);

    map.addLayer(layer);
  };
}
