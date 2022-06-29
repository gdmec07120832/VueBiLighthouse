<template>
  <div>
    <div class="index-banner"></div>
    <div class="flex" style="align-items: flex-start; padding-top: 3.5%;
     width: 92.5%; margin-left: 7.5%">
      <div style="flex: 0 0 50%">
        <div style="color: rgba(0, 0, 0, .9); font-size: 15px; line-height: 1.8">
          <p>数字做了很多很好的事情，但还可以更多、更好，平台将致力于长盛数据生态；</p>
          <p>人人都是经营分析师，期待您的idea，共创更有力的数字境界，驱动业务前行；</p>
          <p>基于业务价值链、集团商业模式，现已建成8大模块，点击顶栏菜单即可进入。</p>
        </div>
        <div style="color: #bfbfbf; margin-top: 20px; font-size: 12px">
          <p>Version 3.0</p>
          <p>Version 2.0 (19.10.10-21.08.31)</p>
          <p>Version 1.0 (18.07.01-19.10.10)</p>
        </div>
      </div>
      <div style="flex: 0 0 50%">
        <div class="flex s-tabs">
          <div v-for="(item, index) in tabs" :key="index" @click="curTab = index"
               class="tab-item" :class="{active: curTab === index}">{{ item }}
          </div>
        </div>
        <div style="padding-left: 20px">
          <keep-alive>
            <component :is="curTabComp"></component>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectManagerList from '@/views/BIView/IndexPage/components/projectManagerList'
import updateLogs from '@/views/BIView/IndexPage/components/updateLogs'
import versionLogs from '@/views/BIView/IndexPage/components/versionLogs'

export default {
  name: 'IndexPage',
  components: { ProjectManagerList },
  computed: {
    curTabComp () {
      return [updateLogs, ProjectManagerList, versionLogs][this.curTab]
    }
  },
  data () {
    return {
      curTab: 0,
      tabs: [
        '更新公告', '产品经理', '版本记录'
      ]
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
/deep/ {
  font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

.index-banner {
  width: 100%;
  padding-bottom: 23.4%;
  background: url("~@/assets/images/index-banner.jpeg") no-repeat 0 0/100% 100%;
}


.s-tabs {
  color: rgba(0, 0, 0, .8);

  .tab-item {
    color: #999;
    font-size: 12px;
    padding: 0 20px 8px;
    cursor: pointer;
    line-height: 24px;
    border-bottom: 2px solid transparent;

    &.active {
      color: #46BCA0;
      border-bottom: 2px solid #46BCA0;
    }
  }
}
</style>
