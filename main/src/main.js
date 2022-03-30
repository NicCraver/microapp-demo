import '@ant-design-vue/pro-layout/dist/style.css'
// import './styles/element/index.scss'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store'
import microApp from '@micro-zoe/micro-app'

import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout'

import 'ant-design-vue/es/modal/style'
import 'ant-design-vue/es/message/style'
import 'ant-design-vue/es/notification/style'
import ant from './utils/ant-design-vue'
microApp.start({
  // disableScopecss: <true></true>,
})

import sharedData from './shared'
microApp.setGlobalData(sharedData)

const app = createApp(App)

app.use(ant)
app.use(ProLayout)
app.use(PageContainer)
app.use(store)
app.use(router).mount('#app')
