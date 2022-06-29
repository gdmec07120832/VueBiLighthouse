<!--
 * @Author: 黄浩
 * @Date: 2022-01-06 09:47:34
 * @LastEditTime: 2022-01-10 15:46:29
 * @LastEditors: Please set LastEditors
 * @Descripttion: 海外驾驶舱的时间选择器
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\components\Datepicker.vue
-->
<template>
    <div class="Datepicker">
        <a-month-picker @change="change1" :value="date1" format="年月(YYYY-MM)" valueFormat="YYYYMM" :size="size" style="width: 150px" :allowClear="false"/>
        <div style="line-height: auto;margin: 0 10px;white-space:nowrap;">--</div>
        <a-month-picker @change="change2" :value="date2" format="年月(YYYY-MM)" valueFormat="YYYYMM" :size="size" style="width: 150px" :allowClear="false"/>
    </div>
</template>

<script>
export default {
    props: {
        date1: {
            type: String
        },
        date2: {
            type: String
        },
        size: {
            type: String,
            default: 'small'
        }
    },
    data() {
        return {
            
        }
    },
    methods: {
        change1(date) {
            this.$emit('update:date1',date)
        },
        change2(date) {
            this.$emit('update:date2',date)
        },
    }
}
</script>

<style lang='scss' scoped>
.Datepicker{
    height: auto;
    display: flex;
    align-items: center;
    .border{
        width: 100%;
        height: 1px;
    }
}
</style>