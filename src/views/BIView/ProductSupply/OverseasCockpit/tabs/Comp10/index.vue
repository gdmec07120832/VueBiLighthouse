<!--
 * @Author: 黄浩
 * @Date: 2022-01-10 09:53:53
 * @LastEditTime: 2022-02-17 15:05:16
 * @LastEditors: Please set LastEditors
 * @Descripttion: 退款率
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp10\index.vue
-->
<template>
    <div class="Comp10" style="position: relative">
        <div class="titleBox" style="display: flex;align-items: center;">
            <Title :label="'退款率'" :ps="'备注：因平台数据存在滞后，数据截止至前天。'"/>
            <div style="flex: 1"></div>
            <div class="text-xs text-black">统计年份</div>
            <YearPicker class="ml10" :year.sync="titleBox.year"/>
        </div>
        <div style="width: calc(100% + 40px);height: 1px;background: #ccc;margin: 9.5px 0;transform: translateX(-20px)"></div>
        <Month :titleBox="titleBox" style="height: calc(100% - 45px)"/>
    </div>
</template>

<script>
import moment from 'moment'
import Title from '../../components/Title'
import Month from './components/MonthV2'
import YearPicker from '../../components/YearPicker'
export default {
    components: {
        Title,
        Month,
        YearPicker,
    },
    data() {
        return {
            titleBox: {
                year: moment().format('YYYY')
            },
        }
    },
}
</script>

<style lang='scss' scoped>
.Comp10{
    flex: 1;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
}
</style>