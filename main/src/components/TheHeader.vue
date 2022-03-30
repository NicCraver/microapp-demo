<template>
  <div class="TheHeader">
    <div class="icon-name">
      <a-dropdown placement="bottomCenter">
        <template #overlay>
          <a-menu>
            <!-- <a-menu-item>
              <template #icon>
                <SettingOutlined />
              </template>
              <span>个人设置</span>
            </a-menu-item> -->
            <a-menu-item @click="test">
              <template #icon>
                <LogoutOutlined />
              </template>
              <span>退出登录</span>
            </a-menu-item>
          </a-menu>
        </template>
        <div class="name">
          <a-avatar :size="24" class="icon">
            <template #icon>
              <img src="../assets/man.png" alt="" />
            </template>
          </a-avatar>
          <div>{{ loginName }}</div>
        </div>
      </a-dropdown>
    </div>
    <div class="message-tips" @click="getMessageList">
      <div class="message-tips">
        <a-badge :dot="messageList.length !== 0">
          <IconFont type="icon-lingdang" style="font-size: 24px" />
        </a-badge>
      </div>
    </div>
    <!-- <div class="message-tips" @click="getMessageList">
      <IconFont type="icon-lingdang" style="font-size: 24px" />
      <span class="circle"></span>
    </div> -->
    <!-- <div class="setting">
      <SettingOutlined />
    </div>  -->
    <div class="undeal-list">
      <div class="msg-div" v-if="msgAText">
        <i class="el-icon el-icon-warning orange"></i>
        <span class="msg">
          {{ msgAText }}
          <span class="text-button" @click="pageToFollowUpList('msgA')">去处理</span>
        </span>
        <i class="el-icon el-icon-close" @click="() => (msgAText = '')"></i>
      </div>
      <div class="msg-div" v-if="msgBText">
        <i class="el-icon el-icon-warning orange"></i>
        <span class="msg">
          {{ msgBText }}
          <span class="text-button" @click="pageToFollowUpList('msgB')">去处理</span>
        </span>
        <i class="el-icon el-icon-close" @click="() => (msgBText = '')"></i>
      </div>
      <div class="msg-div" v-if="msgCText">
        <i class="el-icon el-icon-warning red"></i>
        <span class="msg">
          {{ msgCText }}
          <span class="text-button" @click="pageToFollowUpList('msgC')">去处理</span>
        </span>
        <i class="el-icon el-icon-close" @click="() => (msgCText = '')"></i>
      </div>
    </div>
    <div class="message-list" v-show="showMessageListFlag" ref="messageListRef">
      <div class="title">通知列表</div>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" :tab="`待办（${messageList.length}）`"></a-tab-pane>
      </a-tabs>
      <div class="list">
        <div class="message" v-for="item in messageList">
          <div :class="['avatar', item.msgType === 'C' ? 'exceed' : 'load']">
            {{ item.msgType === 'C' ? '超期' : '待办' }}
          </div>
          <div class="content">
            <div class="date">{{ item.remindDate }}</div>
            <div class="msg">{{ item.title }}<span class="text-button" @click="handleMessage(item)">去处理</span></div>
            <div class="tips">{{ item.subTitle }}</div>
          </div>
        </div>
      </div>
      <div class="check-all" @click="handleMessage(false)">查看所有随访待办</div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { followUpAlerts, followUpAlertsList, logout } from '@/api/modules/layout'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons-vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

import '@/assets/abcIconFont'

const IconFont = createFromIconfontCN({
  scriptUrl: '',
})

const loginName = computed(() => {
  return sessionStorage.getItem('loginName') || '超级管理员'
})
const router = useRouter()
const test = async () => {
  try {
    await logout(sessionStorage.getItem('userId'))
    sessionStorage.clear()
    router.push('/login')
    // window?.location?.reload?.()
  } catch (err) {
    console.error(err)
  }
}

const msgAText = ref('')
const msgBText = ref('')
const msgCText = ref('')
const getWarnList = async () => {
  try {
    const res = await followUpAlerts({
      userId: sessionStorage.getItem('userId'),
    })
    msgAText.value = res.result.msgA
      ? `待办消息：${sessionStorage.getItem('loginName')}医生您好，${dayjs(new Date()).format('YYYY-MM-DD')}有随访任务（${
          res.result.msgA
        }条）今日截止，`
      : ''

    msgBText.value = res.result.msgB
      ? `待办消息：${sessionStorage.getItem('loginName')}医生您好，${dayjs(new Date()).format('YYYY-MM-DD')}可开始随访任务（${
          res.result.msgB
        }条）已生成，`
      : ''

    msgCText.value = res.result.msgC
      ? `超期消息：${sessionStorage.getItem('loginName')}医生您好，${dayjs(new Date()).format('YYYY-MM-DD')}需补录超期随访任务（${
          res.result.msgC
        }条），`
      : ''
    console.log('followUpAlerts', res)
  } catch {}
}

const pageToFollowUpList = (msgType) => {
  window.sessionStorage.removeItem('followupId')
  if (msgType === 'msgA') {
    msgAText.value = ''
  } else if (msgType === 'msgB') {
    msgBText.value = ''
  } else {
    msgCText.value = ''
  }
  let params = ''
  if (msgType === 'msgA') {
    params = `followupStartTime=${dayjs(new Date()).format('YYYY-MM-DD')}&followupEndTime=${dayjs(new Date()).format('YYYY-MM-DD')}`
  } else if (msgType === 'msgB') {
    params = 'initCode=1'
  } else {
    params = 'overdueFlg=1'
    window.sessionStorage.setItem('systemCall', '3')
  }
  window.sessionStorage.setItem('isFirstFromOtherPage', true)
  window.history.pushState({}, null, '/FU/FollowUpList?' + params + '&time=' + Date.now())
}

const messageList = ref([])
const getMessageList = async () => {
  try {
    const res = await followUpAlertsList({ terminalCode: 'PC', userId: window.sessionStorage.getItem('userId') })
    console.log('getMessageList====', res)
    messageList.value = res.result.map((item) => {
      if (item.msgType === 'A') {
        return {
          ...item,
          title: `${item.name}患者今日为随访截止日，请注意`,
          subTitle: `请在${item.nextFollowTime.split(' ')[0]}日前完成`,
        }
      } else if (item.msgType === 'B') {
        return {
          ...item,
          title: `${item.name}患者可开始随访`,
          subTitle: `请在${item.nextFollowTime.split(' ')[0]}日前完成`,
        }
      } else if (item.msgType === 'C') {
        return {
          ...item,
          title: `${item.name}患者随访任务已超期，请补录`,
          subTitle: `已超期${item.beyondDay}天`,
        }
      }
    })
    showMessageListFlag.value = true
  } catch (err) {
    console.error(err)
  }
}

const activeKey = ref('1')

const showMessageListFlag = ref(false)
const messageListRef = ref(null)

const handleMessage = (message) => {
  showMessageListFlag.value = false
  window.sessionStorage.setItem('isFirstFromOtherPage', true)
  if (!message) {
    window.history.pushState({}, null, '/FU/FollowUpList?time=' + Date.now())
    return
  }
  window.sessionStorage.setItem('followupId', message.followupId)
  if (message.msgType === 'C') {
    window.history.pushState({}, null, '/FU/FollowUpList?overdueFlg=1&time=' + Date.now())
  } else {
    window.history.pushState({}, null, '/FU/FollowUpList?time=' + Date.now())
  }
}

onMounted(() => {
  getWarnList()
  document.body.addEventListener('click', (e) => {
    showMessageListFlag.value = false
  })
  messageListRef.value.addEventListener('click', (e) => {
    e.stopPropagation()
  })
})
</script>

<style lang="scss" scoped>
.TheHeader {
  display: flex;
  align-items: center;
  .icon-name {
    padding: 0 10px;
    cursor: pointer;
    .name {
      font-size: 14px;
      color: #595959;
      .icon {
        margin-right: 10px;
      }
      display: flex;
      align-items: center;
    }
  }
  .icon-name:hover {
    background: #f6f6f6;
  }
  .setting {
    cursor: pointer;
    padding: 0 10px;
  }
  .setting:hover {
    background: #f6f6f6;
  }
  .undeal-list {
    position: fixed;
    top: 30px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 50%;
    .msg-div {
      display: flex;
      align-items: center;
      height: 36px;
      color: #85888e;
      padding: 0 14px;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0px 2px 2px 1px rgba(155, 155, 155, 40);
      margin-bottom: 38px;
      &:last-child {
        margin-bottom: 0;
      }
      .el-icon-warning {
        margin-right: 14px;
        &.orange {
          color: #ffa940;
          font-size: 16px;
        }
        &.red {
          color: #ff4d4f;
          font-size: 16px;
        }
      }
      .msg {
        flex: 1;
        .text-button {
          color: #446bbd;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      .el-icon-close {
        cursor: pointer;
      }
    }
  }
  .message-tips {
    cursor: pointer;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding: 0 10px;
    // position: relative;
    // .circle {
    //   position: absolute;
    //   display: inline-block;
    //   width: 8px;
    //   height: 8px;
    //   background: rgba(255, 77, 79, 100);
    //   border-radius: 50%;
    //   top: 15px;
    //   right: 0;
    // }
  }
  .message-tips:hover {
    background: #f6f6f6;
  }
  .temp-list {
    min-width: 360px;
    min-height: 500px;
    background: #f6f6f6;
  }
  .message-list {
    position: fixed;
    right: 52px;
    width: 360px;
    background: #fff;
    top: 65px;
    border-radius: 4px;
    box-shadow: 0px 1px 4px -1px rgba(0, 0, 0, 0.4);
    height: 650px;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    .title {
      line-height: 30px;
      text-align: center;
      font-size: 16px;
      padding-top: 10px;
    }
    .list {
      flex: 1;
      overflow: auto;
      .message {
        display: flex;
        padding: 15px;
        .avatar {
          line-height: 35px;
          text-align: center;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          color: #fff;
          &.exceed {
            background: rgba(255, 77, 79, 100);
          }
          &.load {
            background: rgba(255, 169, 64, 100);
          }
        }
        .content {
          flex: 1;
          margin-left: 11px;
          line-height: 1;
          display: flex;
          flex-direction: column;
          .date,
          .tips {
            font-size: 12px;
            color: rgba(117, 117, 117, 100);
          }
          .msg {
            padding: 5px 0;
            .text-button {
              color: #446bbd;
              text-decoration: underline;
              cursor: pointer;
              float: right;
            }
          }
        }
      }
    }
    .check-all {
      font-size: 12px;
      color: rgba(117, 117, 117, 100);
      text-decoration: underline;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
