# 跳转报错 demo

## 安装依赖

```
yarn bootstrap
```

### 启动

```
yarn dev
```
### 删除依赖

```
yarn rimraf
```

### bug描述
账号密码随意

登录后

1. 从test1-1 点击跳转详情页再点浏览器返回
2. 重复操作几次，从详情页点击test2(另一个子应用)的菜单
3. 控制台报错

vue-router.esm-bundler.js?6c02:72 [Vue Router warn]: Error with push/replace State DOMException: Failed to execute 'replaceState' on 'History': A history state object with URL 'http://localhost:3000undefined/' cannot be created in a document with origin 'http://localhost:3000' and URL 'http://localhost:3000/app-manageModule/hospitalDetail'.

vue-router.esm-bundler.js?6c02:552 Uncaught (in promise) DOMException: Failed to execute 'replace' on 'Location': 'http://localhost:3000undefined' is not a valid URL.



