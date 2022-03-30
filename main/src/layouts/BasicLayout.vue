<template>
  <pro-layout
    v-model:collapsed="state.collapsed"
    v-model:selectedKeys="state.selectedKeys"
    v-model:openKeys="state.openKeys"
    :menu-data="menuData"
    v-bind="proConfig"
  >
    <template #headerContentRender>
      <div class="headerContentRender">
        <div style="flex: 1 1 0%">
          <div class="header-left">
            <div class="header-btn" @click="toggleCollapsed">
              <div v-if="state.collapsed">
                <MenuUnfoldOutlined style="font-size: 16px" />
              </div>
              <div v-else>
                <MenuFoldOutlined style="font-size: 16px" />
              </div>
            </div>
            <div>
              <a-breadcrumb>
                <a-breadcrumb-item v-for="(v, index) in state.breadcrumbData" :key="v.path">
                  <a v-if="v.meta.name && state.breadcrumbData.length - 1 !== index" @click="menuGoPage(v)" href="javascript:void(0);">{{
                    v.meta.title
                  }}</a>
                  <span v-else>{{ v.meta.title }}</span>
                </a-breadcrumb-item>
              </a-breadcrumb>
              <!-- <a-breadcrumb>
                <a-breadcrumb-item v-for="v in state.breadcrumbData" :key="v.path">
                  <a v-if="v.meta.name" @click="menuGoPage(v)" href="javascript:void(0);">{{ v.meta.title }}</a>
                  <span v-else>{{ v.meta.title }}</span>
                </a-breadcrumb-item>
              </el-breadcrumb> -->
            </div>
          </div>
        </div>
        <TheHeader />
      </div>
    </template>
    <template #menuHeaderRender>
      <router-link :to="{ path: '/' }">
        <!-- <img src="../assets/logo.png" /> -->
        <h1>系统</h1>
      </router-link>
    </template>
    <template #menuItemRender="{ item, icon }">
      <a-menu-item
        v-if="!item.meta.isShow"
        @click="menuGoPage(item)"
        :key="item.path"
        :disabled="item.meta?.disabled"
        :danger="item.meta?.danger"
      >
        <template #icon>
          <IconFont v-if="item.meta.icon" :type="item.meta.icon" />
        </template>
        <div>
          <span class="ant-pro-menu-item">
            <span class="ant-pro-menu-item-title">{{ item.meta.title }}</span>
          </span>
        </div>
      </a-menu-item>
    </template>
    <div :class="spinning ? 'pro-layout-main' : 'pro-layout-main1'">
      <a-spin :spinning="spinning" size="large">
        <div class="pro-layout-main-content">
          <!-- <el-scrollbar :height="scrollbarHeight"> -->
          <router-view v-slot="{ Component }">
            <transition name="zoom" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
          <!-- </el-scrollbar> -->
        </div>
      </a-spin>
    </div>
  </pro-layout>
</template>

<script setup>
import microApp, { getActiveApps } from '@micro-zoe/micro-app'
import { useStore } from 'vuex'
import { createFromIconfontCN, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import '../assets/abcIconFont'

import TheHeader from '../components/TheHeader.vue'
import SettingDrawer from '../components/SettingDrawer'

import useIndex from './index'

// icon
const IconFont = createFromIconfontCN({
  scriptUrl: '',
})

const store = useStore()
const router = useRouter()
const route = useRoute()

// loading
const spinning = ref(true)

// 滚动高度
const scrollbarHeight = ref(document.body.offsetHeight - 48 + 'px')

const { treeFilter, fnDisposeChildPath, getBreadcrumbById } = useIndex()

// 监听应用间切换 loading 状态
watchEffect(() => {
  spinning.value = store.state.app.appLoading
})

// 监听vuex app.path的变化，更改菜单激活状态和面包屑
watch(
  () => store.state.app.path,
  (newValue, oldValue) => {
    // console.log('store.state.app.path=========', newValue)
    // console.log('store.state.app', store.state.app)
    if (!newValue) return
    state.selectedKeys = []
    state.openKeys = []
    meunFindKeys(menuDataKeys, newValue)
    state.breadcrumbData = getBreadcrumbById(menuDataKeys, (node) => node.path === newValue)
    // console.log('store.state.app.isAcrossApplication', store.state.app.isAcrossApplication)
    // console.log('state', state)
    if (store.state.app.isAcrossApplication) {
      if (!getActiveApps().includes(store.state.app.appName)) {
        // 主应用跳转内部
        router.push(newValue)
      } else {
        microApp.setData(store.state.app.appName, { basePath: '/' + store.state.app.appName, path: fnDisposeChildPath(newValue) })
      }
      store.dispatch('app/setPath', '')
      store.dispatch('app/setIsAcrossApplication', false)
      store.dispatch('app/setAppName', '')
    }
  }
)

const menuDataKeys = JSON.parse(sessionStorage.getItem('menuDataKeys'))
const menuData = JSON.parse(sessionStorage.getItem('menuDataKeys'))

// 菜单数据
const state = reactive({
  collapsed: false, // default collapsed
  openKeys: [], // defualt openKeys
  selectedKeys: [], // default selectedKeys
  breadcrumbData: [],
})

// layout 配置
const proConfig = ref({
  layout: 'side',
  fixedHeader: true,
  fixSiderbar: true,
  splitMenus: false,
  menuHeaderRender: undefined,
  footerRender: undefined,
  headerRender: undefined,
})

onMounted(() => {
  treeFilter(menuData)
  let str = window.location.pathname
  state.selectedKeys = []
  state.openKeys = []
  state.breadcrumbData = getBreadcrumbById(menuDataKeys, (node) => node.path === str)
  meunFindKeys(menuDataKeys, str)
  // console.log('state', state)
})

// 菜单显示隐藏
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed
}

// 跳转方法
const menuGoPage = (item) => {
  // console.log('item', JSON.parse(JSON.stringify(item)))
  const appName = item.meta.name
  const path = item.path
  state.selectedKeys = []
  state.openKeys = []
  state.breadcrumbData = getBreadcrumbById(menuDataKeys, (node) => node.path === path)
  meunFindKeys(menuDataKeys, path)
  if (!appName) {
    router.push(path)
    // console.log('1111111111111', 1111111111111)
  } else {
    if (!getActiveApps().includes(appName)) {
      // 主应用跳转内部
      console.log('2222222222============', path)
      router.push(path)
    } else {
      // console.log('3333333333333', 3333333333333)
      // 主应用通过下发data数据控制子应用跳转
      microApp.setData(appName, { basePath: '/' + appName, path: fnDisposeChildPath(path) })
      store.dispatch('app/setPath', '')
    }
  }
}
function meunFindKeys(list, activePath) {
  // console.log('list', list)
  // console.log('activePath', activePath.split('/')[1])

  for (let i = 0; i < list.length; i++) {
    if (state.selectedKeys.length) {
      break
    }
    if (list[i].path !== activePath) {
      // console.log(list[i].children && !list[i].children.find((item) => item.path === activePath))
      if (list[i].children && list[i].children.length) {
        // console.log('list[i] push', list[i].name || list[i].meta.name)
        // console.log('list[i] push2', list[i])
        if (activePath.split('/')[1] === list[i].name || activePath.split('/')[1] === list[i].meta.name) {
          state.openKeys.push(list[i].path)
        }
        // console.log('state.openKeys', state.openKeys)
        const res = list[i].children.find((item) => item.path === activePath)
        if (!res) {
          // console.log('11111111111', !res)
          meunFindKeys(list[i].children, activePath)
        } else {
          // console.log(' state.openKeys.concat(res.path)', state.openKeys.concat(res.path))
          state.selectedKeys = state.openKeys.concat(res.path)
        }
      } else if (i === list.length - 1) {
        if (state.openKeys.length) {
          state.openKeys.pop()
        } else {
          state.openKeys = []
        }
      }
    } else {
      state.selectedKeys = state.openKeys.concat(list[i].path)
    }
  }
}
</script>
<style>
.ant-pro-basicLayout-content {
  margin: 0;
  overflow: hidden;
}
.ant-pro-global-header {
  padding: 0 !important;
}
.ant-pro-global-header-collapsed-button {
  display: none !important;
}
.ant-pro-basicLayout-content {
  position: relative;
  margin: 0 !important;
}
.ant-pro-sider-links {
  display: none;
}
.ant-menu-sub {
  background: #00317a !important;
}
.ant-pro-sider {
  position: relative;
  background-color: #134796 !important;
  border-right: 0;
  box-shadow: 2px 0 8px #1d23290d;
  transition: all 0.2s;
  z-index: 100;
}
.ant-menu.ant-menu-dark {
  background-color: #134796 !important;
}
.ant-menu-vertical .ant-menu-item:not(:last-child),
.ant-menu-vertical-left .ant-menu-item:not(:last-child),
.ant-menu-vertical-right .ant-menu-item:not(:last-child),
.ant-menu-inline .ant-menu-item:not(:last-child) {
  margin: 0 !important;
  line-height: 48px !important;
  height: 48px !important;
}
.ant-menu-submenu-selected .ant-menu-submenu-title {
  margin: 0 !important;
  line-height: 48px !important;
  height: 48px !important;
}
.ant-menu-item {
  margin: 0 !important;
  height: 48px !important;
  line-height: 48px !important;
}
.ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #446abd !important;
}
.ant-menu-item-icon {
  font-size: 20px !important;
}
</style>
<style lang="less" scoped>
.headerContentRender {
  display: flex;
  align-items: center;
  .header-left {
    display: flex;
    align-items: center;
    .header-btn {
      cursor: pointer;
      padding: 0 10px;
    }
  }
}
.pro-layout-main1 {
  background: #f0f2f5;
  height: calc(100vh - 48px);
}
.pro-layout-main {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
  height: calc(100vh - 48px);
  // padding: 20px 0 20px 20px;
  // .pro-layout-main-content {
  // margin-right: 20px;
  // height: calc(100vh - 88px);
  // margin: 10px;
  // background: #fff;
  // margin: 0 !important;
  overflow: auto;
  // }
}
</style>
