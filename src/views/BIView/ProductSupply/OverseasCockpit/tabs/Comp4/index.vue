<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 15:22:37
 * @LastEditTime: 2022-02-18 10:48:58
 * @LastEditors: Please set LastEditors
 * @Descripttion: 广告投入
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp4\index.vue
-->
<template>
    <div class="Comp4">
        <div class="titleBox" style="display: flex;align-items: center;">
            <Title :label="'广告投入'"/>
            <div style="flex: 1"></div>
            <Radio v-bind.sync="titleBox.radio"/>
            <a-month-picker v-if="titleBox.radio.model === '当月'" class="ml10" style="width: 150px" v-model="titleBox.month" :allowClear="false" valueFormat="YYYYMM"/>
            <YearPicker v-if="titleBox.radio.model === '月度'" class="ml10" :year.sync="titleBox.year" style="width: 150px"/>
        </div>
        <div style="width: calc(100% + 40px);height: 1px;background: #ccc;margin: 9.5px 0;transform: translateX(-20px)"></div>
        <div style="position: absolute;top: 62px;right: 20px;display: flex;z-index: 2">
            <Radio v-bind="radio" :model.sync="radio.model" style="margin-right: 20px"/>
<!--            <DatepickerV2 v-bind="dateV2" -->
<!--            :dayOrMonth.sync="dateV2.dayOrMonth"-->
<!--            :day2.sync="dateV2.day2"-->
<!--            :month1.sync="dateV2.month1"-->
<!--            :month2.sync="dateV2.month2"-->
<!--            />-->
<!--            <virtual-select style="width: 200px;margin-left: 10px;margin-right: 0;"-->
<!--            v-model="type"-->
<!--            :options="typeArr.map((_) => ({ label: _ }))"-->
<!--            label="投放类型"-->
<!--            ></virtual-select>-->
        </div>
<!--        <div style="position: absolute;top: 94px;right: 0px;display: flex;align-items: center;z-index: 2">-->
<!--            &lt;!&ndash; <Radio v-bind="radio" :model.sync="radio.model"/> &ndash;&gt;-->
<!--            <virtual-select style="width: 188px;margin-left: 10px"-->
<!--                v-model="type"-->
<!--                :options="typeArr.map((_) => ({ label: _ }))"-->
<!--                label="投放类型"-->
<!--            ></virtual-select>-->
<!--        </div>-->
<!--/*        <div class="ps" style="color: #888e99;line-height: 32px;font-size: 12px">备注：数据仅统计SP广告</div>*/-->
        <Day v-if="titleBox.radio.model === '当月'" style="height: calc(100% - 52px)" :titleBox="titleBox" :type="type" :radioModel="radio.model"/>
        <Month v-else style="height: calc(100% - 52px)" :titleBox="titleBox" :type="type" :radioModel="radio.model"/>
    </div>
</template>

<script>
import Title from '../../components/Title'
import moment from 'moment'
// import DatepickerV2 from '../../components/DatepickerV2.vue'
import Radio from '../../components/Radio.vue'
// import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import Day from './components/Day.vue'
import Month from './components/Month.vue'
import YearPicker from "@/views/BIView/ProductSupply/OverseasCockpit/components/YearPicker";
export default {
    components: {
        // DatepickerV2,
        Radio,
        // VirtualSelect,
        Day,
        Month,
        Title,
        YearPicker,
    },
    created() {
        // this.getOption()
    },
    data() {
        return {
            titleBox: {
                radio: {
                    name: '',
                    arr: [
                        { label: '当月', value: '当月' },
                        { label: '月度', value: '月度' },
                    ],
                    model: '月度'
                },
                month: moment().format('YYYYMM'),
                year: moment().format('YYYY')
            },
            // dateV2: {
            //     dayOrMonth: 2,
            //     day2: moment().format('YYYYMM'),
            //     monthType: 2,
            //     month2: moment().format('YYYY')
            // },
            radio: {
                name: '口径',
                arr: [
                    { label: '支付口径', value: 1 },
                    { label: '发货口径', value: 2 },
                ],
                model: 1
            },
            type: [],
            typeArr: ['1','2']
        }
    },
    methods: {
        // 获取选项
        // async getOption() {
        //     let res =  await this.$fetchSql('oversea_cockpit', 'oversea_advt_input_src')
        //     this.typeArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.TARGETING_TYPE))))
        // },
    }
}
</script>

<style lang='scss' scoped>
@import '../../assets/styles.scss';
.Comp4{
    position: relative;
    padding: 10px 20px;
    height: 100%;
    // flex: 1;
    // display: flex;
    // flex-direction: column;
}
</style>