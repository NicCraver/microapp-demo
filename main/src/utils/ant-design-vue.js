import { Button, ConfigProvider, Form, Input, Menu, Breadcrumb, Spin, Dropdown, Avatar, Tabs, Badge } from 'ant-design-vue'
const ant = {
  install(Vue) {
    Vue.use(Button)
    Vue.use(ConfigProvider)
    Vue.use(Form)
    Vue.use(Input)
    Vue.use(Menu)
    Vue.use(Spin)
    Vue.use(Dropdown)
    Vue.use(Avatar)
    Vue.use(Breadcrumb)
    Vue.use(Tabs)
    Vue.use(Badge)
  },
}
export default ant
