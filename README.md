# BaiduMapTrackRender.vue 百度地图轨迹绘制

# Installation 安装
```sh
npm install baidu-map-track-render-vue --save
```

# Import 引入
recommended: import vue component directly
建议直接引入vue组件
```js
  import BaiduMapTrackRender from 'baidu-map-track-render-vue/src/BaiduMapTrackRender.vue'
```

Or import common or esm
```js
  import BaiduMapTrackRender from 'baidu-map-track-render-vue'
```
# Usage 使用
```html
<BaiduMap ak="your key" :points="points" :style="{width: '680px', height: '480x'}"></BaiduMap>
```
The ponit type is WGS84. Example points:
坐标是WGS84类型的. 示例点:
```js
points: [
  [116.399, 39.910],
  [116.405, 39.920],
  [116.423493, 39.907445]
]
```
# Important 注意事项
  1. 此组件仅连接给定的点
  2. 此组件将转换坐标为BD09,所以仅能接受中国地区坐标
  3. 一定要指定高度, 否则高度为0, 组件将不可见

  1. This component will only render given points to track
  2. This component will convert the coordinates to BD09, so can only accept the coordinates of the Chinese region
  3. Be sure to specify the height, otherwise the height is 0, the component will not be visible
