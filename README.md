# 水利GIS平台 (water-gis-platform)

## 项目概述
- 目标：基于 Cesium + Three.js 的水库河流监测可视化系统
- 技术栈：Vue 3 + Vite + Cesium + Three.js + ECharts
- **无需 Cesium Token**，使用高德地图底图

## 🚀 快速开始

```bash
npm install
npm run dev
```

## ⚠️ Cesium 配置注意

本项目使用**高德地图**替代 Cesium Ion，无需 Token。

如果遇到错误，检查：
1. 不要使用 `Cesium.createWorldTerrain()` (Cesium 1.104+ 已移除)
2. 不要设置 `terrain: false` (会报错)
3. 需禁用 Ion 相关功能：skyBox, skyAtmosphere, 大气层等

详见 `memory/cesium-amap-config.md
