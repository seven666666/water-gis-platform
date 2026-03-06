<template>
  <div class="app-container">
    <div id="cesiumContainer" class="cesium-view"></div>
    <div class="control-panel">
      <h2>水利GIS监测平台</h2>
      <div class="status">
        <span class="label">状态:</span>
        <span :class="['value', status]">{{ statusText }}</span>
      </div>
      <div class="actions">
        <button @click="initCesium">加载地图</button>
        <button @click="addReservoir">添加水库</button>
        <button @click="addRiver">添加河流</button>
        <button @click="toggleThree">Three.js效果</button>
      </div>
    </div>
    <div class="data-panel" v-if="showData">
      <h3>监测数据</h3>
      <div class="data-item" v-for="item in mockData" :key="item.name">
        <span class="name">{{ item.name }}</span>
        <span class="value">{{ item.value }}</span>
        <span class="unit">{{ item.unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as Cesium from 'cesium'
import * as THREE from 'three'

const status = ref('idle')
const statusText = ref('未初始化')
const showData = ref(false)
const cesiumViewer = ref(null)
const threeScene = ref(null)

const mockData = ref([
  { name: '水库水位', value: 145.6, unit: 'm' },
  { name: '流量', value: 328.5, unit: 'm³/s' },
  { name: '水质等级', value: 'II', unit: '' },
  { name: '入库流量', value: 156.2, unit: 'm³/s' }
])

const initCesium = () => {
  status.value = 'loading'
  statusText.value = '加载中...'
  
  try {
    // 使用高德地图底图
    const amapImageryProvider = new Cesium.UrlTemplateImageryProvider({
      url: 'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      credit: '高德地图'
    })
    
    // 创建Viewer
    cesiumViewer.value = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: amapImageryProvider,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: true,
      sceneModePicker: true,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      infoBox: false,
      selectionIndicator: false
    })
    
    // 飞向中国区域
    cesiumViewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(116.4, 39.9, 500000)
    })
    
    status.value = 'ready'
    statusText.value = '已就绪'
    showData.value = true
  } catch (e) {
    console.error('地图初始化失败:', e)
    status.value = 'error'
    statusText.value = '加载失败: ' + e.message
  }
}

const addReservoir = () => {
  if (!cesiumViewer.value) return
  // 添加水库标记点
  const position = Cesium.Cartesian3.fromDegrees(116.4, 39.9, 0)
  cesiumViewer.value.entities.add({
    position: position,
    billboard: {
      image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMWFiZWMyIi8+PHRleHQgeD0iMjAiIHk9IjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjE2Ij7lrZfmtanhtak8L3RleHQ+PC9zdmc+',
      width: 40,
      height: 40
    },
    name: '示例水库'
  })
}

const addRiver = () => {
  if (!cesiumViewer.value) return
  // 添加河流线
  const positions = Cesium.Cartesian3.fromDegreesArray([
    116.3, 39.8,
    116.35, 39.85,
    116.4, 39.9,
    116.45, 39.95
  ])
  
  cesiumViewer.value.entities.add({
    name: '示例河流',
    polyline: {
      positions: positions,
      width: 5,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.2,
        color: Cesium.Color.BLUE
      })
    }
  })
}

const toggleThree = () => {
  if (!cesiumViewer.value) return
  alert('Three.js 集成功能开发中...\n需实现 Cesium 与 Three.js 坐标系同步')
}

onMounted(() => {
  statusText.value = '点击"加载地图"开始'
})
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.cesium-view {
  width: 100%;
  height: 100%;
}

.control-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 8px;
  color: #fff;
  min-width: 200px;
}

.control-panel h2 {
  margin-bottom: 15px;
  font-size: 18px;
}

.status {
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.status .label {
  color: #888;
}

.status .value.ready {
  color: #4caf50;
}

.status .value.loading {
  color: #ff9800;
}

.status .value.idle {
  color: #888;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.actions button {
  padding: 10px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.actions button:hover {
  background: #1565c0;
}

.data-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 8px;
  color: #fff;
  min-width: 250px;
}

.data-panel h3 {
  margin-bottom: 15px;
  font-size: 16px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.data-item .name {
  color: #888;
}

.data-item .value {
  font-weight: bold;
  color: #4caf50;
}
</style>
