<template>
    <div class="StorePerformance">
        <div class="text-xxl text-black mb10 pl20" style="font-weight: 600;">店铺业绩</div>
        <div class="text-xs text-gary mb10 pl20">备注：【1】报表今日为实时数据，每5分钟刷新一次；【2】数据源为新平台，有效其实数据为2015年5月；【3】数据统计时间为订单支付时间；【4】收入店铺19年之前为客服店铺，之后为原始店铺；【5】特殊需求无法统计，一切以新平台系统数据为准。</div>
        <Overview ref="Overview" @updatePropObj="updatePropObj"/>
        <Detailed v-if="propObj" :overview="overview" v-bind="propObj" class="mt20"/>
    </div>
</template>

<script>
import Overview from './tabs/Overview/index.vue'
import Detailed from './tabs/Detailed/index.vue'
import moment from "moment";
export default {
    name: "StorePerformance",
    components: {
        Overview,
        Detailed,
    },
    mounted() {
        // this.propObj = this.$refs?.Overview.propObj
        console.log(this.dateV3)
    },
    data() {
        return {
            overview: {},
            propObj: null,
        }
    },
    methods: {
        updatePropObj(val) {
            this.propObj = val
        }
    }
}
</script>

<style lang="scss" scoped>
.StorePerformance{
    height: 100vh;
    min-width: 1320px;
    padding: 20px 2%;
    overflow-y: scroll;
    background: #f5f5f5;
}
</style>