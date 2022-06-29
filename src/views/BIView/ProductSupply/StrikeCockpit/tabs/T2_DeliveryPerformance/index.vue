<template>
    <div class="T2_DeliveryPerformance">
        <div class="header">
            <Title class="title" style="z-index: 2" :label="tab.value"/>
            <div style="flex: 1"></div>
            <a-button v-for="(option, index) in tab.options"
                      @click="tab.value = option"
                      :key="index"
                      :class="tab.value === option ? 'active' : ''"
                      :style="{'margin-right': index !== tab.options.length - 1 ? '8px' : ''}"
                      class="btn"
            >
                {{ option }}
            </a-button>
        </div>
        <DeliveryPerformance style="height: calc(100% - 48px)" class="mt10" v-if="tab.value === '发货业绩'"/>
        <OrderFlow style="height: calc(100% - 48px)" class="mt10" v-if="tab.value === '订单流转'"/>
        <SpotRatio style="height: calc(100% - 48px)" class="mt10" v-if="tab.value === '当月发货比例'"/>
    </div>
</template>

<script>
import Title from '../../components/Title'
import DeliveryPerformance from './DeliveryPerformance'
import OrderFlow from "./OrderFlow";
import SpotRatio from './SpotRatio'
export default {
    name: 'T2_DeliveryPerformance',
    components: {
        Title,
        DeliveryPerformance,
        OrderFlow,
        SpotRatio,
    },
    data() {
        return {
            tab: {
                value: '发货业绩',
                options: ['发货业绩', '订单流转', '当月发货比例']
            },
        }
    }
}
</script>

<style lang="scss" scoped>
.T2_DeliveryPerformance{
    .header {
        height: 38px;
        padding-bottom: 10px;
        border-bottom: 1px solid #F0F0F0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        position: relative;
        .btn {
            border-radius: 5px;
            border: 1px solid #DCDFE6;
        }
        .active {
            background: #46BCA0;
            color: #fff;
        }
    }
}
</style>