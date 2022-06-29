<!--
 * @Author: 黄浩
 * @Date: 2021-12-23 11:49:23
 * @LastEditTime: 2021-12-31 09:00:28
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\ChannelOverviewRealTimePerformance\components\RealTimeOverview\index.vue
-->
<template>
    <div class="parent" style="height: calc(100% - 38px)">
        <Top class="Top" :duration="duration" :currentTab="currentTab" :currentView="currentView" @callBack="currentTabChange"/>
        <div class="time">
            <div class="left">{{title}}趋势分析</div>
            <div class="right">
                <SwitchButton :label1="'同期对比'" :label2="'对比日期'" :currentBtn.sync="currentBtn"/>
                <a-date-picker :disabledDate="disabledDate" :allowClear="false" v-if="currentBtn === 1" style="width: 150px;margin-left: 10px" size="small" v-model="date" valueFormat="YYYYMMDD"/>
            </div>
        </div>
        <Echarts :duration="duration" :currentView="currentView" :currentTab="currentTab" :date.sync="date" :currentBtn="currentBtn" style="height: calc(100% - 120px - 10px - 32px)!important;"/>
        <Bottom class="bottom mt10" :duration="duration" :currentView="currentView" :currentTab="currentTab" style="display: none"/>
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
        }
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
    //padding: 20px;
    margin-top: 10px;
    //display: flex;
    //flex-direction: column;
    /deep/ .Top{
        .item:nth-child(1){
            .row2{
                margin-top: 6px;
                font-size: 24px!important;
                line-height: 24px!important;
                font-weight: bold;
            }
            .row3:nth-child(3){
                margin-top: 12px;
            }
            .row3{
                height: 18px;
                line-height: 18px;
                font-size: 12px;
                span{
                    height: 18px;
                    line-height: 18px!important;
                    font-size: 12px!important;
                }
                span:nth-child(1){
                    color: #999!important;
                }
            }
        }
        .item:nth-child(2), .item:nth-child(3), .item:nth-child(4){
            padding-left: 10px;
            .row1{
                margin-top: 10px;
                height: 22px;
                line-height: 22px;
                font-size: 13px;
                .icon{
                    display: none;
                }
            }
            .row2{
                margin-top: 6px;
                font-size: 22px;
                line-height: 24px;
                font-weight: bold;
            }
            .row3:nth-child(3){
                margin-top: 12px;
            }
            .row3{
                height: 18px;
                line-height: 18px;
                font-size: 12px;
                span{
                    height: 18px;
                    line-height: 18px!important;
                    font-size: 12px!important;
                }
                span:nth-child(1){
                    color: #999!important;
                }
            }
        }
    }
    .time{
        margin-top: 10px;
        height: 32px;
        //background: #FAFAFA;
        display: flex;
        justify-content: space-between;
        align-items: center;
        //padding: 0 16px;
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
    .bottom{
        /deep/ .top {
            height: 25px;
            .col, .col1{
                height: 25px;
                line-height: 25px;
            }
            .border{
                height: 175px;
            }
        }
        /deep/ .content {
            & .row, & .row1{
                height: 25px;
                line-height: 25px;
            }
        }
    }
}
</style>