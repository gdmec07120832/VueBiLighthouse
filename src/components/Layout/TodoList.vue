<template>
  <div style="width: 320px; margin: auto -9px">
    <div>
      <div v-if="!reportWarningCount" style="height: 450px" class="flex flex-center">
        <a-empty :image="emptyIcon" description="暂无填报待办~" />
      </div>
      <div v-else style="min-height: 200px">
        <div class="text-center" style="line-height: 40px; color: rgba(0, 0, 0, 0.6)">
          你有{{ reportWarningCount }}条待填报事项
        </div>

        <div class="notification-content" @click="jumpToFillItem(item)" v-for="(item, index) in list" :key="item.id">
          <div class="notification-title">{{index + 1}}. {{ item.excelName }}</div>
          <div class="flex flex-between">
            <span class="endTime">{{item.endTime}}</span>
            <span class="timeTip" :class="{error: item.betweenDaysNumber <=0, warn: item.betweenDaysNumber > 0}">{{calcTimeTip(item)}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="notification-footer" @click="jumpToFillIndex">
      前往【填报工作台】查看更多
    </div>
  </div>
</template>

<script>
import { Empty } from 'ant-design-vue'

export default {
  name: 'TodoList',
  props: {
    data: Object,
  },
  computed: {
    reportWarningCount() {
      return this.data?.reportWarningCount
    },
    list() {
      return (this.data?.workbenchDtos || []).slice(0, 5)
    },
  },
  data() {
    return {
      emptyIcon: Empty.PRESENTED_IMAGE_SIMPLE,
    }
  },
  methods: {
    jumpToFillIndex () {
      window.open(this.data.todoUrl)
    },
    jumpToFillItem (item) {
      window.open(item.url)
    },
    calcTimeTip(item) {
      const {betweenDaysNumber} = item
      if(betweenDaysNumber < 0) {
        return `超过${Math.abs(betweenDaysNumber)}天`
      } else {
        return `剩余${betweenDaysNumber}天`
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.notification-content {
  padding: 12px;
  border-top: 1px solid rgba(244, 245, 247, 1);
  transition: all .3s;
  &:hover {
    cursor: pointer;
    background-color: rgba(249, 250, 251, 1);
    padding-left: 16px;
  }
}
.notification-title {
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(112, 114, 117);
  margin-bottom: 5px;
}

.timeTip {
  font-size: 12px;
  padding: 0 10px;
  border-radius: 10px;
  &.error {
    color: rgb(240,82,82);
    background-color: rgb(253, 232, 232);
  }
  &.warn {
    color: rgb(194, 120, 3);
    background-color: rgb(253, 246, 178);
  }
}

.endTime {
  font-size: 12px;
  color: rgb(158, 158, 158);
}

.notification-footer {
  line-height: 55px;
  color: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgb(244, 245, 247);
  text-align: center;
  &:hover {
    cursor: pointer;
  }
}
</style>
