<!--
 * @Author: 黄浩
 * @Date: 2021-12-23 15:17:57
 * @LastEditTime: 2021-12-31 09:08:46
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\ChannelOverviewRealTimePerformance\components\ChannelDetails\index.vue
-->
<template>
    <div class="ChannelDetails">
        <div class="titleBox">渠道明细</div>
        <div class="content">
            <a-tabs v-model="currentTab" type="card">
                <a-tab-pane :key="1" tab="线上店铺">
                </a-tab-pane>
                <a-tab-pane v-if="currentView !== 3" :key="2" tab="线上负责人&分组">
                </a-tab-pane>
                <a-tab-pane v-if="currentView !== 3" :key="3" tab="线下区域">
                </a-tab-pane>
            </a-tabs>
            <Tab1 :duration="duration" :currentTab="currentTab" :currentView="currentView" :currentChannel="currentChannel"/>
        </div>
    </div>
</template>

<script>
import Tab1 from './components/Tab1.vue'
export default {
    components: { Tab1},
    props: {
        currentView: {
            type: Number
        },
        currentChannel: {
            type: Number
        },
        duration: {
            type: Number
        }
    },
    data() {
        return {
            currentTab: 1
        }
    },
    methods: {
        callback(key) {
        },
    }
}
</script>

<style lang='scss' scoped>
.ChannelDetails{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .titleBox{
        display: flex;
        align-items: center;
        height: 56px;
        width: 100%;
        padding-left: 27px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC,sans-serif;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.88);
        line-height: 24px;
        border-bottom: 1px solid #F0F0F0;
    }
    .content{
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 18px 27px 0;
        /deep/ .ant-tabs-bar{
            margin: 0;
        }
      /deep/ .ant-tabs-tab:not(.ant-tabs-tab-active):hover {
          background: rgba(0,0,0,.05);
      }
    }
}
/deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab{
    margin-right: 0;
    border-radius: 0;
}
/deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active{
    &::before{
        height: 2px;
        background: #00B08D;
    }
}
</style>