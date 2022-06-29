<!--
 * @Author: 黄浩
 * @Date: 2021-12-23 11:49:23
 * @LastEditTime: 2021-12-31 09:00:28
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\ChannelOverviewRealTimePerformance\components\RealTimeOverview\index.vue
-->
<template>
    <div class="parent">
        <Top :duration="duration" :currentTab="currentTab" :currentView="currentView" @callBack="currentTabChange"/>
        <div class="time">
            <div class="left">{{title}}—趋势分析</div>
            <div class="right">
                <SwitchButton style="margin-right: 8px" :label1="'同期对比'" :label2="'对比日期'" :currentBtn.sync="currentBtn"/>
                <a-date-picker :disabledDate="disabledDate" :allowClear="false" v-if="currentBtn === 1" style="width: 148px" size="small" v-model="date" valueFormat="YYYYMMDD"/>
            </div>
        </div>
        <Echarts v-if="show" :duration="duration" :currentView="currentView" :currentTab="currentTab" :date.sync="date" :currentBtn="currentBtn"/>
        <Bottom :duration="duration" :currentView="currentView" :currentTab="currentTab"/>
    </div>
</template>

<script>
import Top from './components/Top.vue'
import Echarts from './components/Echarts.vue'
import Bottom from './components/Bottom.vue'
import moment from 'moment'
import SwitchButton from './components/SwitchButton.vue'
export default {
    components: { Top, Echarts, Bottom, SwitchButton},
    props: {
        duration:{
            type: Number  
        },
        currentView: {
            type: Number
        },
        currentTab: {
            type: Number
        }
    },
    computed: {
        title() {
            let arr = ['全司', '全中', '品市']
            let arr1 = [arr[this.currentView - 1], '线上渠道', '线下渠道', '海外渠道']
            return arr1[this.currentTab - 1]
        }
    },
    data() {
        return {
            date: moment(new Date()).format('YYYYMMDD'),
            currentBtn: 0,
            show: false,
        }
    },
    mounted() {
        let that = this
        setTimeout(() => {
            that.show = true
        }, 100)
    },
    methods: {
        disabledDate(current) {
            return current && current > moment().startOf('day');
        },
        currentTabChange(val) {
            this.$emit('update:currentTab',val)
        }
    }
}
</script>

<style lang='scss' scoped>
.parent{
    padding: 20px;
    display: flex;
    flex-direction: column;
    .time{
        height: 44px;
        background: #FAFAFA;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        .left{
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #4D5053;
            line-height: 20px;
        }
        .right{
            display: flex;
            align-items: center;
        }
    }
}
</style>