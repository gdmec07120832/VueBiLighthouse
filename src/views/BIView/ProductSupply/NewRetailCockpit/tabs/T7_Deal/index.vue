<template>
    <div class="Deal">
        <div class="header">
            <Title class="title" :label="type === '支付口径' ? '成交毛利率' : '采购毛利率'"/>
            <span>（成品）</span>
            <div></div>
            <a-radio-group v-model="radio">
                <a-radio value="当月">
                    当月
                </a-radio>
                <a-radio value="月度">
                    月度
                </a-radio>
            </a-radio-group>
            <span v-if="radio === '当月'">
                统计月份
                <a-month-picker class="ml10" :disabledDate="disabledDate" v-model="month" :allowClear="false" valueFormat="YYYYMM"/>
            </span>
            <span v-if="radio === '月度'">
                统计年份
                <a-date-picker v-model="year"
                class="ml10"
                :disabledDate="disabledDate"
                @change="onChange"
                @openChange="openChange"
                @panelChange="panelChange"
                :open="open" mode="year"
                :allowClear="false"
                format="YYYY"
                valueFormat="YYYY"
                />
            </span>
        </div>
        <a-radio-group v-model="type" class="type">
            <a-radio value="支付口径">
                支付口径
            </a-radio>
            <a-radio value="发货口径">
                发货口径
            </a-radio>
        </a-radio-group>
        <CurrentMonth :month="month" :type="type" v-if="radio === '当月'"/>
        <Monthly :year="year" :type="type" v-if="radio === '月度'"/>
        <Jump v-if="type === '支付口径'" style="display: none"/>
    </div>
</template>

<script>
import Title from '../../components/Title'
import moment from "moment";
import base from '../../utils/base'
import CurrentMonth from './tabs/CurrentMonth'
import Jump from '../../components/Jump'
import Monthly from './tabs/Monthly'
export default {
    name: 'Deal',
    mixins: [base],
    components: {
        Title,
        CurrentMonth,
        Jump,
        Monthly,
    },
    data() {
        return {
            radio: '当月',
            type: '支付口径',
            // month: moment(new Date()).format('YYYYMM'),
            month: moment(new Date()).format('DD') === '01' ? moment(new Date()).subtract(1, 'month').format('YYYYMM') : moment().format('YYYYMM'),
            year: moment(new Date()).format('YYYY'),
            open: false
        }
    },
    methods: {
        onChange(val) {
            this.year = val
        },
        openChange(status) {
            if(status) {
                this.open = true
            }else {
                this.open = false
            }
        },
        panelChange(val){
            this.year = moment(val).format('YYYY')
            this.open = false
        }
    }
}
</script>

<style lang="scss" scoped>
.Deal {
    position: relative;
    .header {
        height: 38px;
        padding-bottom: 10px;
        border-bottom: 1px solid #F0F0F0;
        display: flex;
        align-items: center;
        position: relative;
        > span:nth-last-child(1) {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #000000;
            line-height: 22px;
        }
        > span:nth-child(2) {
            margin-top: 2px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(0, 0, 0, 0.88);
            line-height: 20px;
        }
        > div:nth-child(3) {
            flex: 1;
        }
    }
    .type{
        position: absolute;
        top: 59px;
        right: 0;
    }

}
</style>