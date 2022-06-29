<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 16:58:25
 * @LastEditTime: 2022-02-17 13:54:06
 * @LastEditors: Please set LastEditors
 * @Descripttion: 采购成本
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp6\index.vue
-->
<template>
    <div class="Comp6">
<!--        <Title :label="'采购成本'" :ps="'备注：<br/>当月采购成本=上月发货量*当月平均采购价；<br/>上月采购成本=上月发货量*上月平均采购价。'"/>-->
        <div class="titleBox" style="display: flex;align-items: center;">
            <Title :label="'采购成本'" :ps="'备注：<br/>当月采购成本=上月发货量*当月平均采购价；<br/>上月采购成本=上月发货量*上月平均采购价。'"/>
            <div style="flex: 1"></div>
<!--            <Radio v-bind.sync="titleBox.radio"/>-->
<!--            <a-month-picker v-if="titleBox.radio.model === '指标'" class="ml10" style="width: 150px" v-model="titleBox.month" :allowClear="false" valueFormat="YYYYMM"/>-->
<!--            <RangeMonthPicker v-if="titleBox.radio.model === '明细'" class="ml10" :value.sync="titleBox.rangeMonth" style="width: 200px"/>-->
            <div class="text-xs text-black mr10">统计年份</div>
            <YearPicker :year.sync="year"/>
        </div>
        <div style="width: calc(100% + 40px);height: 1px;background: #ccc;margin: 9.5px 0;transform: translateX(-20px)"></div>
        <div class="select">
            <!-- <Radio v-if="dateV2.dayOrMonth === 2" v-bind="radio" :model.sync="radio.model" style="margin-right: 20px"/> -->
            <DatepickerV3 v-bind="dateV2" 
            :dayOrMonth.sync="dateV2.dayOrMonth"
            :day2.sync="dateV2.day2"
            :month1.sync="dateV2.month1"
            :month2.sync="dateV2.month2"
            style="display: none"
            />
            <!-- <Datepicker :date1.sync="month1" :date2.sync="month2" :size="'default'"/> -->
        </div>
        <Type style="height: calc(100% - 52px)" :dateV2="dateV2" :year="year"/>
        <!-- <Type1 style="flex: 1" v-if="radio.model === 1" :dateV2="dateV2"/> -->
        <!-- <Type2 style="flex: 1" v-else :dateV2="dateV2"/> -->
    </div>
</template>

<script>
// import Radio from '../../components/Radio'
// import Datepicker from '../../components/Datepicker'
import Title from '../../components/Title'
import DatepickerV3 from '../../components/DatepickerV3'
import moment from 'moment'
import Type from './components/Type'
// import RangeMonthPicker from '../../components/RangeMonthPicker'
// import Type1 from './components/Type1'
// import Type2 from './components/Type2'
import YearPicker from '../../components/YearPicker'

export default {
    components: {
        // Radio,
        DatepickerV3,
        // Datepicker,
        // Type1,
        // Type2,
        Type,
        Title,
        YearPicker,
    },
    // watch: {
    //     'titleBox.radio.model': {
    //         handler(val){
    //             if(val === '指标')this.dateV2.dayOrMonth = 1
    //             else if(val === '明细')this.dateV2.dayOrMonth = 2
    //         }
    //     },
    //     'titleBox.month': {
    //         handler(val){
    //             this.dateV2.day2 = val
    //         }
    //     },
    //     'titleBox.rangeMonth': {
    //         handler(val){
    //             this.dateV2.month1 = val[0].format('YYYYMM')
    //             this.dateV2.month2 = val[1].format('YYYYMM')
    //         },
    //         deep: true
    //     }
    // },
    data() {
        return {
            // titleBox: {
            //     radio: {
            //         name: '',
            //         arr: [
            //             {label: '指标', value: '指标'},
            //             {label: '明细', value: '明细'},
            //         ],
            //         model: '指标'
            //     },
            //     month: moment().format('YYYYMM'),
            //     rangeMonth: [
            //         moment().startOf('year'),
            //         moment().endOf('year'),
            //     ],
            // },
            year: moment().format('YYYY'),
            radio: {
                name: '展示方式',
                arr: [
                    { label: '趋势图', value: 1 },
                    { label: '明细表', value: 2 },
                ],
                model: 1
            },
            // month1: moment(new Date()).format('YYYYMM') - 100 + '',
            // month2: moment(new Date()).format('YYYYMM'),
            dateV2: {
                options: ['核心指标', '趋势明细'],
                dayOrMonth: 1,
                day2: moment(new Date()).format('YYYYMM'),
                monthType: 2,
                month1: moment(new Date()).format('YYYY') + '01',
                month2: moment(new Date()).format('YYYY') + '12',
            },
        }
    },
}
</script>

<style lang='scss' scoped>
.Comp6{
    padding: 10px 20px;
    position: relative;
    height: 100%;
    // flex: 1;
    // display: flex;
    // flex-direction: column;
    .select{
        position: absolute;
        right: 20px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>