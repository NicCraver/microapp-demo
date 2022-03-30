import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import(/* webpackChunkName: "page2" */ './views/Demo/index.vue'),
  },
  {
    path: '/page2',
    name: 'page2',
    component: () => import(/* webpackChunkName: "page2" */ './views/page2.vue'),
  },
  {
    path: '/page3-3',
    name: 'page3-3',
    component: () => import(/* webpackChunkName: "page2" */ './views/page2.vue'),
  },
  {
    // 组织管理
    path: '/organAdmin',
    name: 'organAdmin',
    component: () => import('./views/OrganManage/OrganAdmin/index.vue'),
  },
  {
    // 新增组织测试
    path: '/organAdmin/addOrgan',
    name: 'addOrgan',
    component: () => import('./views/OrganManage/OrganAdmin/addOrgan.vue'),
  },
  {
    // 用户管理
    path: '/userAdmin',
    name: 'userAdmin',
    component: () => import('./views/OrganManage/UserAdmin/index.vue'),
  },
  {
    // 角色管理
    path: '/permissionAdmin/roleAdmin',
    name: 'roleAdmin',
    component: () => import('./views/OrganManage/PermissionAdmin/RoleAdmin/index.vue'),
  },
  {
    // 角色授权
    path: '/permissionAdmin/RoleAuthorization',
    name: 'roleAuthorization',
    component: () => import('./views/OrganManage/PermissionAdmin/RoleAuthorization/index.vue'),
  },
  {
    // 菜单管理
    path: '/menuManagement',
    name: 'menuManagement',
    component: () => import('./views/OrganManage/MenuManagement/index.vue'),
  },
  {
    // 应用管理
    path: '/applicationManagement',
    name: 'applicationManagement',
    component: () => import('./views/OrganManage/ApplicationManagement/index.vue'),
  },
  {
    // 医院管理
    path: '/hospitalAdmin',
    name: 'hospitalAdmin',
    component: () => import('./views/MedicalManage/HospitalAdmin/index.vue'),
  },
  {
    // 医院详情
    path: '/hospitalDetail',
    name: 'hospitalDetail',
    component: () => import('./views/MedicalManage/HospitalAdmin/HospitalDetail.vue'),
  },
  {
    // 科室管理
    path: '/departmentAdmin',
    name: 'departmentAdmin',
    component: () => import('./views/MedicalManage/DepartmentAdmin/index.vue'),
  },
  {
    // 新增科室
    path: '/addDepartment',
    name: 'addDepartment',
    component: () => import('./views/MedicalManage/DepartmentAdmin/AddDepartment.vue'),
  },
  {
    // 医生管理
    path: '/doctorAdmin',
    name: 'doctorAdmin',
    component: () => import('./views/MedicalResourceManage/DoctorAdmin/index.vue'),
  },
  {
    // 医生详情
    path: '/doctorDetail',
    name: 'doctorDetail',
    component: () => import('./views/MedicalResourceManage/DoctorAdmin/DoctorDetail.vue'),
  },
]

export default routes
