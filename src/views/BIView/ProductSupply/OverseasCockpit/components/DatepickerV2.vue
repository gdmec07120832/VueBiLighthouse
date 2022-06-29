<!--
 * @Author: 黄浩
 * @Date: 2022-01-06 14:34:11
 * @LastEditTime: 2022-01-14 15:33:50
 * @LastEditors: Please set LastEditors
 * @Descripttion: 有日 月变换的日期选择器
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\components\DatepickerV2.vue
-->
<template>
    <div class="datepickerV2">
        <a-select :value="dayOrMonth" @change="change" style="width: 100px" dropdownClassName="overseasCockpitDatepickerSelect">
            <a-select-option :value="1" class="option" style="font-size: 12px!important;">
                按日统计
            </a-select-option>
            <a-select-option :value="2">
                按月统计
            </a-select-option>
        </a-select>
        <!-- 日单选项 -->
        <a-month-picker class="common" v-if="dayOrMonth === 1 && dayType === 1" :value="day2" 
        :allowClear="false" style="width: 100px" valueFormat="YYYYMM"
        @change="changeDay2" suffixIcon=" "
        />
        <!-- 日双选项 -->
        <div v-if="dayOrMonth === 1 && dayType === 2" style="display: flex;align-items: center" class="box1">
            <div class="border"></div>
            <div class="border" style="bottom: 0;top: calc(100% - 1px)"></div>
            <a-month-picker @change="changeDay1" class="common picker3" :value="day1" :allowClear="false" 
            style="width: 100px" valueFormat="YYYYMM" suffixIcon=" "
            />
            <div style="padding: 0 5px;border-top: 1px solid #d9d9d9;border-bottom: 1px solid #d9d9d9;height: 32px;display: flex;align-items: center;transform: translateX(-3px)">
                <a-icon type="swap-right" style="color: #999" />
            </div>
            <a-month-picker @change="changeDay2" class="picker2" :value="day2" :allowClear="false" 
            style="width: 100px;" valueFormat="YYYYMM" suffixIcon=" "
            />
        </div>
        <!-- 月单选项 -->
        <a-month-picker class="common" v-if="dayOrMonth === 2 && monthType === 1" :value="month2"
        :allowClear="false" style="width: 100px" valueFormat="YYYYMM"
        @change="changeMonth2" suffixIcon=" "
        />
        <!-- 月双选项 -->
        <div v-if="dayOrMonth === 2 && monthType === 2" style="display: flex;align-items: center" class="box2">
            <div class="border"></div>
            <div class="border" style="bottom: 0;top: calc(100% - 1px)"></div>
            <a-month-picker @change="changeMonth1" class="common picker3" :value="month1" :allowClear="false"
            style="width: 100px" valueFormat="YYYYMM" suffixIcon=" "
            />
            <div style="padding: 0 5px;border-top: 1px solid #d9d9d9;border-bottom: 1px solid #d9d9d9;height: 32px;display: flex;align-items: center;transform: translateX(-3px)">
                <a-icon type="swap-right" style="color: #999" />
            </div>
            <a-month-picker @change="changeMonth2" class="picker2" :value="month2" :allowClear="false" 
            style="width: 100px;" valueFormat="YYYYMM" suffixIcon=" "
            />
        </div>
        <!-- 月单选 年选择器 -->
        <a-date-picker class="common"
            v-if="dayOrMonth === 2 && monthType === 3"
            :allowClear="false"
            style="width: 100px"
            format="年(YYYY)"
            valueFormat="YYYY"
            suffixIcon=" "
            mode="year"
            :open="open"
            :value="month2"
            @openChange="openChange"
            @panelChange="panelChange"
        />
            <!-- :value="year" -->
            <!-- @change="changeMonth2" -->

    </div>
</template>

<script>
import moment from 'moment'
export default {
    props: {
        // 1表示按日统计 2表示按月统计
        dayOrMonth: {
            type: Number,
            default: 1
        },
        // 类型为1 单选项 为2 双选项  双选项时输出为day2
        dayType: {
            type: Number,
            default: 1
        },
        day1: {
            type: String,
            // default: moment(new Date()).format('MM') > 6 ? moment(new Date()).format('YYYY') + (moment(new Date()).format('MM') - 6) + '01' : (moment(new Date()).format('YYYY') - 1) + (12 - 6 + moment(new Date()).format('MM')) + '01'
        },
        day2: {
            type: String,
            // default: moment(new Date()).format('YYYYMMDD')
        },
        // 类型为1 单选项 为2 双选项 3为年选择器 单选项
        monthType: {
            type: Number,
            default: 1
        },
        month1: {
            type: String
        },
        month2: {
            type: String
        }
    },
    data() {
        return {
            // 1表示按日统计 2表示按月统计
            // dayOrMonth: 1,
            open: false,
            // year: moment(),
        }
    },
    methods: {
        openChange(status) {
            if (status) {
                this.open = true;
            } else {
                this.open = false;
            }
        },
        panelChange(value){
            // this.year = value;
            console.log(value.format('YYYY'));
            this.changeMonth2(value.format('YYYY'))
            this.open = false;
        },
        change(value) {
            this.$emit('update:dayOrMonth',value)
        },
        changeDay1(value) {
            this.$emit('update:day1',value)
        },
        changeDay2(value) {
            this.$emit('update:day2',value)
        },
        changeMonth1(value) {
            this.$emit('update:month1',value)
        },
        changeMonth2(value) {
            this.$emit('update:month2',value)
        }
    }
}
</script>

<style lang="scss">
.overseasCockpitDatepickerSelect{
    .ant-select-dropdown-menu-item{
        font-size: 12px;
    }
}
</style>
<style lang='scss' scoped>
.datepickerV2{
    display: flex;
    align-items: center;
    /deep/ .ant-select-selection{
        border-radius: 4px 0 0 4px;
    }
    /deep/ .ant-select-selection-selected-value{
        font-size: 12px;
    }
    .common /deep/ .ant-input{
        border-radius: 0 4px 4px 0;
        border-left: 0px;
        font-size: 12px;
    }
    .picker2 /deep/ .ant-input{
        border-radius: 0 4px 4px 0;
        border-left: 0px;
    }
    .picker3 /deep/ .ant-input{
        border-right: 0;
    }
    .box1, .box2 /deep/ .ant-input:hover{
        border-color: #d9d9d9;
    }
    .box1, .box2 /deep/ .ant-input:focus{
        border-color: #d9d9d9;
        box-shadow: none;
    }
    .box1, .box2{
        position: relative;
        .border{
            height: 1px;
            position: absolute;
            top: 0;
            width: 80%;
            background: #d9d9d9;
        }
    }
}
</style>