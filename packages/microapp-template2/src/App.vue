<template>
  <div id="microapp-template2">
    <transition name="zoom" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    $route(to, from) {
      // console.log('to=========', to)
      this.$setMenuPage(to.path)
    },
  },
}
</script>

<style>
.zoom-enter-active,
.zoom-leave-active {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: zoomIn;
}

.zoom-leave-active {
  animation-direction: reverse;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.95, 0.95, 0.95);
  }

  100% {
    opacity: 1;
  }
}
@keyframes zoomOut {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: scale3d(0.95, 0.95, 0.95);
  }
}
</style>
