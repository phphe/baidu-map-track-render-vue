/*!
 * baidu-map-track-render-vue v1.0.6
 * phphe <phphe@outlook.com> (https://github.com/phphe)
 * https://github.com/phphe/baidu-map-track-render-vue.git
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.BaiduMapTrackRender = factory());
}(this, (function () { 'use strict';

function windowLoaded() {
  return new Promise(function (resolve, reject) {
    if (document && document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', function once() {
        resolve();
        window.removeEventListener('load', once);
      });
    }
  });
}

function unset(obj, prop) {
  obj[prop] = undefined;
  try {
    delete obj[prop];
  } catch (e) {}
}
//
function loadBaiduMap(ak) {
  var fun = loadBaiduMap;
  return windowLoaded().then(function () {
    if (fun.loaded) {
      return window.BMap;
    } else if (!fun.requested) {
      fun.requested = true;
      window._BaiduMapLoadedCallback = function () {
        fun.loaded = true;unset(window, '_BaiduMapLoadedCallback');
      };
      var script = document.createElement('script');
      script.src = 'http://api.map.baidu.com/api?v=2.0&ak=' + ak + '&callback=_BaiduMapLoadedCallback'; // 此为v2.0版本的引用方式
      // http://api.map.baidu.com/api?v=1.4&ak=您的密钥&callback=initialize"; //此为v1.4版本及以前版本的引用方式
      document.body.appendChild(script);
      return new Promise(function (resolve, reject) {
        var requestInterval = window.setInterval(function () {
          if (fun.loaded) {
            window.clearInterval(requestInterval);
            resolve(window.BMap);
          }
        }, 10);
      });
    }
  });
}

var BaiduMapTrackRender = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "baidu-map-track-render-vue" }, [_c('div', { staticClass: "baidu-map-track-render-vue__map", attrs: { "id": _vm.id } })]);
  }, staticRenderFns: [],
  props: {
    points: {},
    ak: {}
  },
  data: function data() {
    return {
      id: 'BaiduMap_' + this._uid
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      loadBaiduMap(_this.ak).then(function (BMap) {
        if (_this.points) {
          _this.convertPoints(_this.points, BMap).then(function (_ref) {
            var points = _ref.points;

            var map = new BMap.Map(_this.id);
            var center = _this.getCenter(points, BMap);
            map.centerAndZoom(center, 15);
            map.enableScrollWheelZoom();

            for (var i = 0; i < points.length; i++) {
              var prev = points[i - 1];
              if (prev) {
                var current = points[i];
                var polyline = new BMap.Polyline([prev, current], { strokeColor: 'blue', strokeWeight: 2, strokeOpacity: 0.5 }); // 创建折线
                map.addOverlay(polyline); // 增加折线
              }
            }
          });
        }
      });
    });
  },

  methods: {
    getCenter: function getCenter(points, BMap) {
      var maxX = points[0].lng;
      var maxY = points[0].lat;
      var minX = points[0].lng;
      var minY = points[0].lat;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var p = _step.value;

          if (p.lng < minX) {
            minX = p.lng;
          }
          if (p.lng > maxX) {
            maxX = p.lng;
          }
          if (p.lat < minY) {
            minY = p.lat;
          }
          if (p.lat > maxY) {
            maxY = p.lat;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return new BMap.Point((maxX + minX) / 2, (maxY + minY) / 2);
    },
    convertPoints: function convertPoints(points, BMap) {
      var convertor = new BMap.Convertor();
      //
      var BMapPoints = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var point = _step2.value;

          BMapPoints.push(new BMap.Point(point.lng, point.lat));
        }
        //
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var promises = [];
      var n = 100;

      var _loop = function _loop(i, j) {
        promises.push(new Promise(function (resolve, reject) {
          var start = i * n;
          var end = start + n;
          convertor.translate(BMapPoints.slice(start, end), 1, 5, function (data) {
            resolve(data);
          });
        }));
      };

      for (var i = 0, j = 0; j < points.length; i++, j += n) {
        _loop(i, j);
      }
      return Promise.all(promises).then(function (datas) {
        var resultPoints = [];
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = datas[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var data = _step3.value;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = data.points[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _point = _step4.value;

                resultPoints.push(_point);
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        return { points: resultPoints, dataArr: datas };
      });
    }
  }
};

return BaiduMapTrackRender;

})));
