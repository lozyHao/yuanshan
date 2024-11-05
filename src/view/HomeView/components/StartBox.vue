<script setup lang="ts"></script>

<template>
  <div class="start-box flex-1 rounded-xl flex overflow-hidden drop-shadow-lg">
    <div
      class="h-full flex-1 min-w-60 flex flex-col items-center justify-center"
    >
      <div
        class="flex-center bg-opacity3-fff color-013D3A font-bold text-xl w-90% max-w-70 h-12 rounded-xl transition-colors cursor-pointer"
      >
        即刻创作
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.start-box {
  width: calc(100% - 160px);
  max-width: 1280px;
  background-image: @home-bg-img;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
