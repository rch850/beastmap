let map;

$(document).ready(function () {
  // マップの表示
  map = new ol.Map({
    target: "canvas",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([136.25, 35.85]),
      zoom: 9
    })
  });
});

// AngularJS のコントローラ
function BeastCtrl($scope, $http) {
  // データを読み込んで反映する
  $http.get("data/h24shichobetsu.json").
    success(function (data, status, headers, config) {
      $scope.beasts = data.chouju.map(function (c) {
        return { name: c["鳥獣名"], imageUrl: "#", data: c };
      });

      // カルーセルのセットアップ
      // 時間をあけて実行しないとうまくいかない
      setTimeout(function () {
        $("#owl-example").owlCarousel({
          slideSpeet: 1000
        });

        // キーボードでカルーセルを移動できるようにする
        $(window).keydown(function (e) {
          if (e.keyCode === 37) {        // 左
            $(".owl-carousel").data('owlCarousel').prev();
          } else if (e.keyCode === 39) { // 右
            $(".owl-carousel").data('owlCarousel').next();
          }
        });
      }, 300);

      // 画像一覧を取ってくる
      $http.get("data/chouju_images.json").
        success(function (data, status, headers, config) {
          $scope.beasts = $scope.beasts.map(function (b) {
            const c = data.chouju.find(c => b.name === c["鳥獣名"])
            if (c) {
              b.imageUrl = c["画像"];
              b.citeUrl = c["元データ"];
            }
            return b;
          });
        });
    }).
    error(function (data, status, headers, config) {
    });

  $scope.click = function (name) {
    // 登録済みのレイヤーを全部削除
    map.getLayers().forEach((layer, i) => {
      if (i !== 0) {
        map.removeLayer(layer)
      }
    })

    const beast = $scope.beasts.find(b => b.name === name);
    if (!beast) { return; }

    // 円の描画参考: https://gis.stackexchange.com/questions/187825/drawing-circle-with-openlayers3-but-not-seeing-on-map

    function createCircle(lat, lng, radius) {
      return new ol.Feature(
        new ol.geom.Circle(
          ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'), radius
        )
      )
    }

    function getBeastCount(city) {
      let key, count = 1;
      for (key in beast.data) {
        if (key.indexOf(city) === 0) {
          count += parseInt(beast.data[key]) || 0;
        }
      }
      console.log(city + " => " + count);
      return Math.sqrt(count) * 1000;
    }

    const vectorSource = new ol.source.Vector({
      projection: 'EPSG:4326',
      features: [
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
      ]
    })

    const layer = new ol.layer.Vector({
      source: vectorSource,
      style: [
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: "rgb(255 104 71)",
            width: 2
          }),
          fill: new ol.style.Fill({
            color: "rgb(255 104 71 / 20%)"
          })
        })
      ]
    })

    map.addLayer(layer);
  };
}
