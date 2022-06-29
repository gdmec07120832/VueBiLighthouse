<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 15:22:37
 * @LastEditTime: 2022-02-18 10:50:00
 * @LastEditors: Please set LastEditors
 * @Descripttion: 广告RoAS
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp5\index.vue
-->
<template>
    <div class="Comp4">
<!--        <Title :label="'广告RoAS'" :ps="'备注：数据仅统计SP广告'"/>-->
        <div class="titleBox" style="display: flex;align-items: center;">
            <Title :label="'广告RoAS'"/>
            <div style="flex: 1"></div>
            <Radio v-bind.sync="titleBox.radio"/>
            <a-month-picker v-if="titleBox.radio.model === '当月'" class="ml10" style="width: 150px" v-model="titleBox.month" :allowClear="false" valueFormat="YYYYMM"/>
<!--            <RangeMonthPicker v-if="titleBox.radio.model === '月度'" class="ml10" :value.sync="titleBox.rangeMonth" style="width: 200px"/>-->
            <YearPicker v-if="titleBox.radio.model === '月度'" class="ml10" :year.sync="titleBox.year" style="width: 150px"/>
        </div>
        <div style="width: calc(100% + 40px);height: 1px;background: #ccc;margin: 9.5px 0;transform: translateX(-20px)"></div>
<!--        <DatepickerV2 v-bind="dateV2"-->
<!--        style="position: absolute;top: 55px;right: 20px;z-index: 2;display: none"-->
<!--        :dayOrMonth.sync="dateV2.dayOrMonth"-->
<!--        :day2.sync="dateV2.day2"-->
<!--        :month1.sync="dateV2.month1"-->
<!--        :month2.sync="dateV2.month2"-->
<!--        />-->
<!--        <div class="ps" style="color: #888e99;line-height: 32px;font-size: 12px">备注：数据仅统计SP广告</div>-->
        <Day style="height: calc(100% - 52px)" v-if="titleBox.radio.model === '当月'" :titleBox="titleBox"/>
        <Month style="height: calc(100% - 52px)" v-else :titleBox="titleBox"/>
    </div>
</template>

<script>
import Title from '../../components/Title'
import moment from 'moment'
import DatepickerV2 from '../../components/DatepickerV2.vue'
import Day from './components/Day.vue'
import Month from './components/Month.vue'
import Radio from '../../components/Radio'
import RangeMonthPicker from "@/views/BIView/ProductSupply/OverseasCockpit/components/RangeMonthPicker";
import YearPicker from '@/views/BIView/ProductSupply/OverseasCockpit/components/YearPicker'
export default {
    components: {
        // DatepickerV2,
        Day,
        Month,
        Title,
        Radio,
        // RangeMonthPicker,
        YearPicker,
    },
    data() {
        return {
            titleBox: {
                radio: {
                    name: '',
                    arr: [
                        {label: '当月', value: '当月'},
                        {label: '月度', value: '月度'},
                    ],
                    model: '月度'
                },
                month: moment().format('YYYYMM'),
                year: moment().format('YYYY')
            },
            // dateV2: {
            //     dayOrMonth: 1,
            //     day2: moment(new Date()).format('YYYYMM'),
            //     monthType: 2,
            //     month1: moment(new Date()).format('YYYY') + '01',
            //     month2: moment(new Date()).format('YYYY') + '12',
            // }
        }
    },
    methods: {

    }
}
</script>

<style lang='scss' scoped>
.Comp4{
    position: relative;
    padding: 10px 20px;
    height: 100%;
    // flex: 1;
    // display: flex;
    // flex-direction: column;
}
</style>