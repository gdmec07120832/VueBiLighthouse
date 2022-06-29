<template>
    <div class="PaymentPerformance">
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
        <PaymentPerformance style="height: calc(100% - 48px);" class="mt10" v-if="tab.value === '支付业绩'"/>
        <RealTimePerformance style="height: calc(100% - 48px);" class="mt10" v-if="tab.value === '实时业绩'"/>
    </div>
</template>

<script>
import Title from '../../components/Title'
import PaymentPerformance from './PaymentPerformance/index'
import RealTimePerformance from './RealTimePerformance/index'
import moment from 'moment'
export default {
    components: {
        Title,
        PaymentPerformance,
        RealTimePerformance,
    },
    data() {
        return {
            tab: {
                value: '实时业绩',
                options: ['实时业绩', '支付业绩']
            },
        }
    },
    methods: {
        clickPanel(curName) {
            console.log(curName)
        }
    }
}
</script>

<style lang="scss" scoped>
.PaymentPerformance {
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