<template>
  <div class="scroll-showcase">
    <div class="scroll-container" ref="scrollContainer">
      <section class="section section-1" data-section="1">
        <div class="content">
          <h1>水利工程3D展示</h1>
          <p>滚动查看水库全景</p>
          <span class="scroll-hint">↓ 向下滚动</span>
        </div>
      </section>
      
      <section class="section section-2" data-section="2">
        <div class="content">
          <h2>水库大坝</h2>
          <p>雄伟的水库大坝工程</p>
        </div>
      </section>
      
      <section class="section section-3" data-section="3">
        <div class="content">
          <h2>水流系统</h2>
          <p>智能水流监测系统</p>
        </div>
      </section>
      
      <section class="section section-4" data-section="4">
        <div class="content">
          <h2>数据可视化</h2>
          <p>实时水位、流量监测</p>
        </div>
      </section>
    </div>
    
    <div class="canvas-container" ref="canvasContainer">
      <canvas ref="canvas"></canvas>
    </div>
    
    <button class="back-btn" @click="goBack">← 返回</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const scrollContainer = ref(null)
const canvasContainer = ref(null)
const canvas = ref(null)

let scene, camera, renderer, cube, particles
let animationId

const initThree = () => {
  // 场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a1628)
  
  // 相机
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5
  
  // 渲染器
  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  // 3D物体 - 水库模型（简化立方体代表）
  const geometry = new THREE.BoxGeometry(2, 2, 2)
  const material = new THREE.MeshPhongMaterial({ 
    color: 0x4fc3f7,
    shininess: 100,
    transparent: true,
    opacity: 0.8
  })
  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  
  // 粒子系统
  const particleCount = 500
  const particleGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x4fc3f7,
    size: 0.05,
    transparent: true,
    opacity: 0.6
  })
  
  particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)
  
  // 灯光
  const ambientLight = new THREE.AmbientLight(0x404040, 2)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)
  
  const pointLight = new THREE.PointLight(0x4fc3f7, 1, 100)
  pointLight.position.set(0, 0, 5)
  scene.add(pointLight)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  // 基础旋转
  cube.rotation.x += 0.001
  cube.rotation.y += 0.002
  
  // 粒子浮动
  particles.rotation.y += 0.0005
  
  // 根据滚动位置调整物体
  const scrollPercent = getScrollPercent()
  
  // 滚动时模型旋转和移动
  cube.rotation.x = scrollPercent * Math.PI * 2
  cube.rotation.y = scrollPercent * Math.PI * 2
  cube.position.y = -scrollPercent * 2
  cube.position.x = Math.sin(scrollPercent * Math.PI * 2) * 2
  
  // 相机移动
  camera.position.z = 5 - scrollPercent * 2
  
  renderer.render(scene, camera)
}

const getScrollPercent = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  return Math.min(Math.max(scrollTop / docHeight, 0), 1)
}

const handleScroll = () => {
  // 滚动时更新
}

const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const goBack = () => {
  window.location.href = '/'
}

onMounted(() => {
  initThree()
  animate()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', onResize)
  renderer.dispose()
})
</script>

<style scoped>
.scroll-showcase {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: #0a1628;
}

.canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.canvas-container canvas {
  width: 100%;
  height: 100%;
}

.scroll-container {
  position: relative;
  z-index: 2;
}

.section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.section-1 {
  background: linear-gradient(180deg, rgba(10,22,40,0.3) 0%, transparent 100%);
}

.section-2 {
  background: linear-gradient(180deg, transparent 0%, rgba(10,22,40,0.5) 50%, transparent 100%);
}

.section-3 {
  background: linear-gradient(180deg, transparent 0%, rgba(10,22,40,0.5) 50%, transparent 100%);
}

.section-4 {
  background: linear-gradient(180deg, transparent 0%, rgba(10,22,40,0.8) 100%);
}

.content {
  text-align: center;
}

.content h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #4fc3f7, #81d4fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #4fc3f7;
}

.content p {
  font-size: 1.5rem;
  color: #b0bec5;
}

.scroll-hint {
  display: block;
  margin-top: 2rem;
  color: #4fc3f7;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  padding: 10px 20px;
  background: rgba(79, 195, 247, 0.2);
  border: 1px solid #4fc3f7;
  color: #4fc3f7;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(79, 195, 247, 0.4);
}
</style>
