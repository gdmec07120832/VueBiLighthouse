<!--
 * @Author: 黄浩
 * @Date: 2021-12-23 09:04:45
 * @LastEditTime: 2021-12-23 16:50:19
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\ChannelOverviewRealTimePerformance\components\RealTimeOverview\components\SwitchButton.vue
-->
<template>
    <div class="switchButton">
        <div @click="clickEvent(0)" class="default" :class="currentBtn === 0 && 'active'">{{label1}}</div>
        <div @click="clickEvent(1)" class="default" :class="currentBtn === 1 && 'active'">{{label2}}</div>
    </div>
</template>

<script>
export default {
    props: {
        label1: {
            type: String,
        },
        label2: {
            type: String,
        },
        // 0是第一个
        currentBtn: {
            type: Number
        },
    },
    data() {
        return {
        }
    },
    methods: {
        clickEvent(val) {
            if(val === this.currentBtn) return
            this.$emit('update:currentBtn',val)
        }
    }
}
</script>

<style lang='scss' scoped>
.switchButton{
    display: flex;
    align-items: center;
    height: 28px;
    padding: 0 2px;
    background: #F1F1F1;
    border-radius: 4px;
    border: 1px solid #E9E9E9;
    .default{
        width: 72px;
        height: 20px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC,sans-serif;
        color: #666666;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;
        &:not(.active):hover {
          background: rgba(0,0,0,.1);
        }
        &:not(:last-child) {
          margin-right: 2px;
        }
    }
    .active{
      background: #00B08D;
      font-size: 12px;
      color: #fff;
    }
}
</style>