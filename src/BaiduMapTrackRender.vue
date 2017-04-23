<template>
  <div class="baidu-map-track-render-vue">
    <div class="baidu-map-track-render-vue__map" :id="id"></div>
  </div>
</template>
<script>
function windowLoaded() {
  return new Promise(function(resolve, reject) {
    if (document && document.readyState === 'complete') {
      resolve()
    } else {
      window.addEventListener('load', function once() {
        resolve()
        window.removeEventListener('load', once)
      })
    }
  })
}

function unset(obj, prop) {
  obj[prop] = undefined
  try {
    delete obj[prop]
  } catch (e) {}
}
//
function loadBaiduMap(ak) {
  const fun = loadBaiduMap
  return windowLoaded().then(() => {
    if (fun.loaded) {
      return window.BMap
    } else if (!fun.requested) {
      fun.requested = true
      window._BaiduMapLoadedCallback = () => { fun.loaded = true; unset(window, '_BaiduMapLoadedCallback') }
      const script = document.createElement('script')
      script.src = `http://api.map.baidu.com/api?v=2.0&ak=${ak}&callback=_BaiduMapLoadedCallback`// 此为v2.0版本的引用方式
      // http://api.map.baidu.com/api?v=1.4&ak=您的密钥&callback=initialize"; //此为v1.4版本及以前版本的引用方式
      document.body.appendChild(script)
      return new Promise(function(resolve, reject) {
        const requestInterval = window.setInterval(function () {
          if (fun.loaded) {
            window.clearInterval(requestInterval)
            resolve(window.BMap)
          }
        }, 10)
      })
    }
  })
}

export default {
  props: {
    points: {},
    ak: {}
  },
  data() {
    return {
      id: 'BaiduMap_' + this._uid
    }
  },
  mounted() {
    this.$nextTick(() => {
      loadBaiduMap(this.ak).then((BMap) => {
        if (this.points) {
          this.convertPoints(this.points, BMap).then(({points}) => {
            var map = new BMap.Map(this.id)
            var center = this.getCenter(points, BMap)
            map.centerAndZoom(center, 15)
            map.enableScrollWheelZoom()

            for (let i = 0; i < points.length; i++) {
              const prev = points[i - 1]
              if (prev) {
                const current = points[i]
                const polyline = new BMap.Polyline([
                  prev,
                  current,
                ], {strokeColor: 'blue', strokeWeight: 2, strokeOpacity: 0.5})   // 创建折线
                map.addOverlay(polyline)   // 增加折线
              }
            }
          })
        }
      })
    })
  },
  methods: {
    mapReady(BMap) {
      if (this.points) {
        this.convertPoints(this.points, BMap).then(({points}) => {
          var map = new BMap.Map('map')
          var center = this.getCenter(points, BMap)
          map.centerAndZoom(center, 15)
          map.enableScrollWheelZoom()

          for (let i = 0; i < points.length; i++) {
            const prev = points[i - 1]
            if (prev) {
              const current = points[i]
              const polyline = new BMap.Polyline([
                prev,
                current,
              ], {strokeColor: 'blue', strokeWeight: 2, strokeOpacity: 0.5})   // 创建折线
              map.addOverlay(polyline)   // 增加折线
            }
          }
        })
      }
    },
    getCenter(points, BMap) {
      let maxX = points[0].lng
      let maxY = points[0].lat
      let minX = points[0].lng
      let minY = points[0].lat
      for (const p of points) {
        if (p.lng < minX) {
          minX = p.lng
        }
        if (p.lng > maxX) {
          maxX = p.lng
        }
        if (p.lat < minY) {
          minY = p.lat
        }
        if (p.lat > maxY) {
          maxY = p.lat
        }
      }
      return new BMap.Point((maxX + minX) / 2, (maxY + minY) / 2)
    },
    convertPoints(points, BMap) {
      const convertor = new BMap.Convertor()
      //
      const BMapPoints = []
      for (const point of points) {
        BMapPoints.push(new BMap.Point(point[0], point[1]))
      }
      //
      const promises = []
      const n = 100
      for (let i = 0, j = 0; j < points.length; i++, j += n) {
        promises.push(new Promise((resolve, reject) => {
          const start = i * n
          const end = start + n
          convertor.translate(BMapPoints.slice(start, end), 1, 5, (data) => { resolve(data) })
        }))
      }
      return Promise.all(promises).then((datas) => {
        const resultPoints = []
        for (const data of datas) {
          for (const point of data.points) {
            resultPoints.push(point)
          }
        }
        return { points: resultPoints, dataArr: datas }
      })
    }
  }
}
</script>
<style>
.baidu-map-track-render-vue{
  width: 680px;
  height: 480px;
}
.baidu-map-track-render-vue__map{
  width: 100%;
  height: 100%;
}
</style>
