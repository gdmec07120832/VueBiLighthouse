<template>
  <div class="flex flex-end top-menu-right-area">
    <div style="height: 24px; cursor: pointer" @click="gotoMetricExplore" id="MetricEntryIcon">
      <page-entry-icon style="width: 20px" />
    </div>
    <a class="ml15" style="height: 24px">
      <video-icon style="width: 20px" @click="openTutorial" />
    </a>
    <a-badge class="ml15" :count="todoCount" :dot="true" :offset="[-2, 4]">
      <bell-icon style="width: 20px; cursor: pointer" ref="notifyTrigger"  />
    </a-badge>
    <div class="ml15 user-area">
      <a-dropdown :trigger="['hover']" :overlayStyle="{ minWidth: '80px' }">
        <div class="flex" style="cursor: pointer">
          <span class="text-ellipsis nowrap mr5">你好，{{ userInfo.alias }}</span>
          <div class="flex flex-end">
            <user-icon style="font-size: 16px"></user-icon>
            <a-icon style="font-size: 16px" type="caret-down" />
          </div>
        </div>
        <a-menu slot="overlay">
          <a-menu-item @click="changePassword" v-if="userInfo.extUser">修改密码</a-menu-item>
          <a-menu-divider v-if="userInfo.extUser" rootPrefixCls="ant-menu" />
          <a-menu-item @click="logout">
            <a href="javascript:void 0;"><a-icon type="import" class="mr5" />退出登录</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { createDialog } from '@/utils/helper'
import TutorialModal from '@/components/Layout/TutorialModal/TutorialModal'
import UserIcon from '@/assets/svg/user.svg'
import VideoIcon from '@/assets/svg/video.svg'
import BellIcon from '@/assets/svg/bell.svg'
import PageEntryIcon from '@/assets/svg/pageEntry.svg'
import { resetState } from '@/store'
import ChangePassword from '@/components/Layout/ChangePassword'
import { mapState } from 'vuex'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import Vue from 'vue'
import TodoList from './TodoList'

const TutorialService = createDialog(TutorialModal)
const ChangePasswordService = createDialog(ChangePassword)
export default {
  name: 'TopMenuRight',
  components: {
    UserIcon,
    VideoIcon,
    BellIcon,
    PageEntryIcon
  },
  computed: {
    ...mapState('user', ['userInfo']),
  },
  data() {
    return {
      todoCount: 0
    }
  },
  mounted() {
    this.getTodoList()
  },
  methods: {
    renderTodoList(data) {
      const Ins = Vue.extend(TodoList)

      tippy(this.$refs.notifyTrigger, {
        theme: 'light',
        maxWidth: 'none',
        trigger: 'mouseenter click',
        interactiveDebounce: 75,
        interactive: true,
        appendTo: document.body,
        content: () => {
          return new Ins({
            propsData: {
              data: data,
            },
          }).$mount().$el
        },
      })
    },
    getTodoList() {
      this.$axios.get('/api/user/getDataReportingTodoList').then(({ data }) => {
        const {reportWarningCount} = data
        this.todoCount = reportWarningCount
        this.renderTodoList(data)
      })
    },
    gotoMetricExplore() {
      this.$router.push({
        name: 'metricExplore'
      })
    },
    openTutorial() {
      TutorialService.create.call(this, {
        destroy: true,
      })
    },
    changePassword() {
      ChangePasswordService.create(this)
    },
    logout() {
      this.$axios.get('/logout').then(() => {
        resetState()
        const redirectUrl = window.location.origin
        window.location.replace(`${process.env.VUE_APP_SSO_LOGIN_PAGE}?redirectUrl=${redirectUrl}`)
      })
    },
  },
}
</script>

<style scoped lang="scss">
.top-menu-right-area {
  //border-bottom: 2px solid transparent;
  padding-left: 20px;
  user-select: none;
  align-items: center;
}

.user-area {
  display: flex;
  margin-right: 20px;
  flex: 0 1 145px;
  align-items: center;
  color: #fff;
}

.notify-icon {
  color: #fff;
  //transform: translateY(1px);
  padding: 8px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 6px;
  &:hover {
    background: #cfcfcf40;
  }
}
</style>
