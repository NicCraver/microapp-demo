<template>
  <div class="anx-login-wrapper">
    <div id="back">
      <div class="backLeft"></div>
      <div class="backLeft2"></div>
    </div>
    <div id="slideBox">
      <div class="topLayer">
        <div class="right">
          <div class="login-conent">
            <div class="login-main">
              <div style="flex: 1">
                <div class="title">{{ title }}</div>
                <div>
                  <a-form class="anx-login-ruleForm" ref="formRef" :model="formState" :rules="rules">
                    <a-form-item ref="account" name="account">
                      <a-input placeholder="账号" v-model:value="formState.account" allow-clear @pressEnter="onSubmit()" />
                    </a-form-item>
                    <a-form-item ref="password" name="password">
                      <a-input-password
                        v-model:value="formState.password"
                        placeholder="密码"
                        allow-clear
                        style="margin-top: 5px"
                        @pressEnter="onSubmit()"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-button style="width: 100%; margin-top: 10px" type="primary" :loading="loading" @click="onSubmit">登录</a-button>
                    </a-form-item>
                  </a-form>
                </div>
              </div>
              <div class="login-footer">{{ now }} 平安联想智慧医疗版权所有</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { notification } from 'ant-design-vue'
import { CheckCircleFilled } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { userLogin, getToken } from '@/api/modules/login/index'
import { onMounted, ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import microApp, { getActiveApps } from '@micro-zoe/micro-app'
import { encryptsm3 } from '@/utils/utils'

const test = () => {
  console.log('test')
}
const formState = reactive({
  account: '',
  password: '',
})
const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      // console.log('values', formState, toRaw(formState))
      onLogin()
    })
    .catch((error) => {
      console.log('error', error)
    })
}

const title = window.g.APP_LOGIN_TITLE || '慢病管理中心 , 登录'
const formRef = ref()
const loading = ref(false)
const ruleForm = reactive({
  account: '',
  password: '',
})

// const rules = reactive({
//   account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
//   password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
// })

const now = computed(() => {
  return dayjs(new Date()).format('YYYY')
})

const router = useRouter()

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      onLogin()
    } else {
      console.log('error submit!')
      return false
    }
  })
}
// onMounted(() => {})

const onLogin = () => {
  loading.value = true
  userLogin({
    loginName: formState.account,
    pwd: encryptsm3(formState.password),
    loginType: '1',
  })
    .then((res) => {
      console.log('res', res)
      if (res.code === 0) {
        sessionStorage.setItem('roleIds', res.result.roleIds)
        sessionStorage.setItem('loginName', res.result.name)
        sessionStorage.setItem('userId', res.result.userId)
        sessionStorage.setItem('username', res.result.loginName)
        // ElNotification({
        //   offset: 55,
        //   title: '成功',
        //   message: '验证成功，即将跳转到首页',
        //   type: 'success',
        // })
        //成功
        // 获取token
        getToken(res.result.userId).then((result) => {
          console.log('result', result)
          sessionStorage.setItem('token', result.result.token)
          sessionStorage.setItem('secretKey', result.result.secretKey)
          getApplicationData()
        })
      } else {
        setTimeout(() => {
          loading.value = false
        }, 300)
        // $message({
        //   message: "用户名或密码错误",
        //   type: "error",
        // });
      }
    })
    .catch((err) => {
      setTimeout(() => {
        loading.value = false
      }, 300)
      console.log(err)
    })
}
function getApplicationData() {
  setTimeout(() => {
    loading.value = false

    notification['success']({
      message: '成功',
      description: '验证成功，即将跳转到首页',
      icon: h(CheckCircleFilled, { style: 'color: #72C140' }),
      duration: 2,
      top: '55px',
    })

    let menuDataKeys = [
      {
        path: '/app-manageModule/MedicalManage',
        name: 'app-manageModule',
        meta: { title: 'test', icon: 'icon-gailan' },
        children: [
          {
            path: '/app-manageModule/hospitalAdmin',
            meta: { title: 'test1-1', name: 'app-manageModule', lastNode: true },
            children: [
              {
                path: '/app-manageModule/hospitalDetail',
                meta: { title: 'test1-1-1', name: 'app-manageModule' },
              },
            ],
          },
          {
            path: '/app-manageModule/departmentAdmin',
            meta: { title: 'test1-2', name: 'app-manageModule', lastNode: true },
            children: [
              {
                path: '/app-manageModule/addDepartment',
                meta: { title: 'test1-2-1', name: 'app-manageModule' },
              },
            ],
          },
        ],
      },
      {
        path: '/app-manageModule2/MedicalManage',
        name: 'app-manageModule2',
        meta: { title: 'test2', icon: 'icon-gailan' },
        children: [
          {
            path: '/app-manageModule2/hospitalAdmin',
            meta: { title: 'test2-1', name: 'app-manageModule2', lastNode: true },
            children: [
              {
                path: '/app-manageModule2/hospitalDetail',
                meta: { title: 'test2-1-1', name: 'app-manageModule2' },
              },
            ],
          },
          {
            path: '/app-manageModule2/departmentAdmin',
            meta: { title: 'test2-2', name: 'app-manageModule2', lastNode: true },
            children: [
              {
                path: '/app-manageModule2/addDepartment',
                meta: { title: 'test2-2-1', name: 'app-manageModule2' },
              },
            ],
          },
        ],
      },
    ]
    sessionStorage.setItem('menuDataKeys', JSON.stringify(menuDataKeys))

    goPage('app-manageModule', '/app-manageModule/hospitalAdmin')
  }, 500)
}
const goPage = (appName, path) => {
  if (!getActiveApps().includes(appName)) {
    // 主应用跳转
    router.push(path)
  } else {
    let childPath = null
    // path的值形式如：/app-vue2/page2，这里/app-vue2是子应用的基础路由，/page2才是页面地址，所以我们需要将/app-vue2部分删除
    childPath = path.replace(/^\/app-[^/]+/, '')
    !childPath && (childPath = '/') // 防止地址为空
    // 主应用通过下发data数据控制子应用跳转
    microApp.setData(appName, { path: childPath })
  }
}
</script>
<style lang="scss">
.anx-login-wrapper {
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-text-fill-color: #ededed !important;
    // -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
  }
  input {
    background-color: transparent;
  }
  input:-webkit-autofill {
    // -webkit-box-shadow: 0 0 0px 1000px #fff inset !important; //关于解决输入框背景颜色
    -webkit-text-fill-color: rgba(0, 0, 0, 1) !important; //关于接输入框文字颜色
  }
  .ant-input-affix-wrapper .ant-input-suffix {
    display: flex;
    align-items: center;
    color: #bfbfbf;
    white-space: nowrap;
  }
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  overflow: hidden;
  height: 100%;

  .backLeft {
    position: absolute;
    left: 0;
    width: 60%;
    height: 100%;
    background: url('../../assets/login_bg.jpeg');
    background-size: cover;
    background-position: 50% 50%;
  }
  .backLeft2 {
    position: absolute;
    left: 46%;
    width: 40%;
    height: 100%;
    background: url('../../assets/login-bg-s.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
  }

  #back {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -999;
  }

  #slideBox {
    width: 30%;
    max-height: 100%;
    height: 100%;
    overflow: hidden;
    margin-left: 64%;
    position: absolute;
    // box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .topLayer {
    width: 200%;
    height: 100%;
    position: relative;
    left: 0;
    left: -100%;
  }

  .left {
    width: 50%;
    height: 100%;
    background: #2c3034;
    left: 0;
    position: absolute;
  }

  .right {
    width: 50%;
    height: 100%;
    // background: #fff;
    right: 0;
    position: absolute;
  }

  .login-conent {
    width: 300px;
    margin: 0 auto;
    top: 30%;
    position: absolute;
    left: 40%;
    margin-left: -100px;
    display: flex;
    justify-content: flex-end;
    .login-main {
      display: flex;
      flex-direction: column;
      .title {
        width: 100%;
        font-size: 30px;
        font-weight: bold;
        color: #272727;
      }
      .anx-login-ruleForm {
        margin-top: 20px;
      }
      .anx-login-button {
        width: 306px;
        margin-top: 15px;
        color: #fff;
        background: #134a96 !important;
        border: 1px solid #134a96 !important;
        font-size: 18px;
      }
      .login-footer {
        position: fixed;
        margin-left: 50px;
        bottom: 0;
        text-align: center;
        padding: 20px;
      }
    }
    // @media only screen and (max-width: 1920px) {
    //   // screen and 前两个可以省略。
    //   .login-main {
    //     margin-right: 350px;
    //   }
    // }
    // @media only screen and (max-width: 1680px) {
    //   // screen and 前两个可以省略。
    //   .login-main {
    //     margin-right: 240px;
    //   }
    // }
    // @media only screen and (max-width: 1440px) {
    //   // screen and 前两个可以省略。
    //   .login-main {
    //     margin-right: 200px;
    //   }
    // }
    // @media only screen and (max-width: 1350px) {
    //   // screen and 前两个可以省略。
    //   .login-main {
    //     margin-right: 180px;
    //   }
    // }
    // @media only screen and (max-width: 1280px) {
    //   // screen and 前两个可以省略。
    //   .login-main {
    //     margin-right: 150px;
    //   }
    // }
  }

  .off {
    background: none;
    color: #03a9f4;
    box-shadow: none;
  }

  .right .off:hover {
    background: #eee;
    color: #03a9f4;
    box-shadow: none;
  }
  .left .off:hover {
    box-shadow: none;
    color: #03a9f4;
    background: #363a3d;
  }
}
</style>
