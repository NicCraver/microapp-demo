<template>
  <div id="app-container">
    <a-config-provider v-if="hasToken">
      <BasicLayout></BasicLayout>
    </a-config-provider>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import microApp, { getActiveApps } from '@micro-zoe/micro-app'
import SettingDrawer from './components/SettingDrawer'
import BasicLayout from './layouts/BasicLayout.vue'
const hasToken = ref()
const route = useRoute()
const router = useRouter()
watch(
  () => route.path,
  (newValue, oldValue) => {
    if (newValue === '/login') {
      hasToken.value = null
    } else {
      hasToken.value = sessionStorage.getItem('token')
    }
  }
)
onMounted(() => {
  hasToken.value = sessionStorage.getItem('token')
  if (!hasToken.value) {
    router.push('/login')
  }
})
</script>

<style>
#app {
  height: 100%;
}

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
