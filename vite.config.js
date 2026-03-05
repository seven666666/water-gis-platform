import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5174
  },
  cesium: {
    cesiumBaseUrl: 'https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/'
  }
})
