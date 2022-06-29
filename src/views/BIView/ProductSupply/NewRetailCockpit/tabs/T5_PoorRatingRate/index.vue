<template>
    <div class="PoorRatingRate">
        <div class="header" style="display: flex;align-items: center">
            <Title class="title" :label="'线下评价'"/>
            <div style="flex: 1"></div>
            <span style="font-size: 12px">
                统计月份
                <a-month-picker :disabledDate="disabledDate" v-model="month" :allowClear="false" class="ml10" valueFormat="YYYYMM"/>
            </span>
        </div>
        <div class="main">
            <div class="panel">
                <div class="switch">
                    <span>是否剔除代购</span>
                    <a-switch :checked="checked"  checked-children="是" un-checked-children="否" default-checked @change="onChange" size="small"/>
                </div>
                <div class="first">
                    <div class="line1">评价率</div>
                    <div class="line2">{{handleNum('percent_double_dot', panel.MTD_APRS_ALL_RATE)}}</div>
                    <div class="line3">
                        <span>评价数</span>
                        <span>{{handleNum('round', panel.MTD_APRS_ALL_CNT)}}</span>
                    </div>
                    <div class="line3">
                        <span>成交数</span>
                        <span>{{handleNum('round', panel.MTD_VLUM_CNT)}}</span>
                    </div>
                    <div class="line3">
                        <span>同比</span>
                        <span :class="[computeColor(panel.YOY_APRS_ALL_RATE)]">{{handleNum('percent_double_dot', panel.YOY_APRS_ALL_RATE)}}</span>
                    </div>
                </div>
                <div class="second">
                    <div class="line1">
                        好评率
                    </div>
                    <div class="line2">
                        {{handleNum('percent_double_dot', panel.MTD_APRS_GOOD_RATE)}}
                    </div>
                    <div class="line3">
                        <span>好评数</span>
                        <span>{{handleNum('round', panel.MTD_APRS_GOOD_CNT)}}</span>
                    </div>
                    <div class="line3">
                        <span>同比</span>
                        <span :class="[computeColor(panel.YOY_APRS_GOOD_RATE)]">{{handleNum('percent_double_dot', panel.YOY_APRS_GOOD_RATE)}}</span>
                    </div>
                </div>
                <div class="second">
                    <div class="line1">
                        中评率
                    </div>
                    <div class="line2">
                        {{handleNum('percent_double_dot', panel.MTD_APRS_MID_RATE)}}
                    </div>
                    <div class="line3">
                        <span>中评数</span>
                        <span>{{handleNum('round', panel.MTD_APRS_MID_CNT)}}</span>
                    </div>
                    <div class="line3">
                        <span>同比</span>
                        <span>{{handleNum('percent_double_dot', panel.YOY_APRS_MID_RATE)}}</span>
                    </div>
                </div>
                <div class="second">
                    <div class="line1">
                        差评率
                    </div>
                    <div class="line2">
                        {{ handleNum('percent_double_dot', panel.MTD_APRS_BAD_RATE) }}
                    </div>
                    <div class="line3">
                        <span>差评数</span>
                        <span>{{handleNum('round', panel.MTD_APRS_BAD_CNT)}}</span>
                    </div>
                    <div class="line3">
                        <span>同比</span>
                        <span :class="[computeColor(panel.YOY_APRS_BAD_RATE, 'bad')]">{{handleNum('percent_double_dot', panel.YOY_APRS_BAD_RATE)}}</span>
                    </div>
                </div>
            </div>
            <div class="select">
                <span>评价详情</span>
                <a-radio-group v-model="evaluate">
                    <a-radio :value="item" v-for="item in evaluateOptions" :key="item">
                        {{item}}
                    </a-radio>
                </a-radio-group>
            </div>
            <div class="echartsBox">
                <Table ref="table" @click="clickTable" v-bind="table" class="table"/>
                <v-chart ref="line" class="line" :options="line" autoresize></v-chart>
            </div>
            <Table v-bind="table1" class="table1"/>
            <Jump style="display: none"/>
        </div>
    </div>
</template>

<script>
import Title from '../../components/Title'
import moment from 'moment'
import Table from '../../components/Table'
import base from '../../utils/base'
import Jump from '../../components/Jump'
export default {
    name: 'PoorRatingRate',
    mixins: [ base ],
    components: {
        Title,
        Table,
        Jump,
    },
    async created() {
        this.line = await this.createLine()
        this.line.yAxis[0].axisLabel.formatter = function(value) {
            if(value === 0) return '0%'
            else return (value * 100).toFixed(2) + '%'
        }
        this.line.grid.bottom = 0
        this.line.series[0].data = []
        this.line.series[0].name = '当期'
        this.line.series[1].data = []
        this.line.series[1].name = '同期'
        this.line.xAxis.data = []
        let that = this
        // this.line.tooltip.formatter = function (params) {
        //     let fun = (num) => {
        //         let colors = ['#5B8FF9', '#DFDFDF']
        //         return `<div style="width: 10px;height: 4px;background: ${colors[num]};display: inline-block;margin: 1px 5px 1px 0"></div>`
        //     }
        //     let div1 = fun(0), div2 = fun(1)
        //     let str = `统计日期：${params[0].data[0]}<br/>${div1}${that.evaluate}：${that.handleNum('percent', params[1].data[1], true)}<br/>${div2}同期${that.evaluate}：${that.handleNum(1, params[0].data[1], true)}`
        //     // let str1 = `统计日期：${moment(params[0].data[2]).format('YYYY-MM-DD')}<br/>占比：${that.handleNum(2, params[1].data[1], true)}`
        //     return str
        //     // return that.radioModel === 1 ? str : str1
        // }
        this.getOverView()
        this.getArea()
        this.getTrend()
        this.getTable()
    },
    beforeDestroy() {
        this.line === null ? this.line = null : null
    },
    mounted() {
        this.$refs.table.$el.children[0].children[1].classList.add('active')
    },
    watch: {
        condiction() {
            this.getOverView()
            this.getArea()
            this.getTrend()
            this.getTable()
        },
        evaluate: {
            handler() {
                console.log(11)
                this.handleData('area', this.areaData)
                this.handleData('trend', this.trendData, this.trendData1)
            }
        }
    },
    computed: {
        condiction() {
            return this.month + '-' + this.checked
        }
    },
    data() {
        return {
            // month: moment(new Date()).format('YYYYMM'),
            month: moment(new Date()).format('DD') === '01' ? moment(new Date()).subtract(1, 'month').format('YYYYMM') : moment().format('YYYYMM'),
            checked: true,
            panel: {
                MTD_APRS_ALL_CNT: null,
                MTD_APRS_ALL_RATE: null,
                MTD_APRS_BAD_CNT: null,
                MTD_APRS_BAD_RATE: null,
                MTD_APRS_GOOD_CNT: null,
                MTD_APRS_GOOD_RATE: null,
                MTD_APRS_MID_CNT: null,
                MTD_APRS_MID_RATE: null,
                MTD_VLUM_CNT: null,
                YOY_APRS_ALL_RATE: null,
                YOY_APRS_BAD_RATE: null,
                YOY_APRS_GOOD_RATE: null,
                YOY_APRS_MID_RATE: null,
            },
            evaluateOptions: ['评价率', '好评率', '中评率', '差评率'],
            evaluate: '评价率',
            table: {
                index: 'PoorRatingRate_A',
                labelData: ['区域', '汇总', '东区', '南区', '西区', '北区'],
                tableData: [
                    [null, null, null, null, null, null],
                    [null, null, null, null, null, null],
                ]
            },
            table1: {
                index: 'PoorRatingRate_B',
                labelData: ['字段', '评价率', '好评率', '中评率', '差评率'],
                tableData: [
                    [null, null, null, null, null],
                    [null, null, null, null, null],
                ]
            },
            line: null,
            S_OR_N: '汇总',
            trendData: [],
            trendData1: [],
            areaData: [],
        }
    },
    methods: {
        computeColor(val, type) {
            if(val === null || val === undefined || val === '--') return
            if(type === 'bad') {
                if(val <= 0) return 'red'
                else if(val > 0) return 'green'
            }
            else {
                if(val >= 0) return 'red'
                else if(val < 0) return 'green'
            }
        },
        clickTable(e) {
            let text = e.target.innerText
            let keys = ['汇总', '东区', '西区', '南区', '北区']
            if(keys.indexOf(text) > -1) {
                this.S_OR_N = text
                this.getTrend()
                // if(text === keys[0]) this.handleData('trend', this.trendData)
                // else this.handleData('trend', this.trendData)
                // this.handleData('trend', this.trendData)
                let children = e.target.parentElement.children
                for(let i = 1; i < children.length; i++) {
                    children[i].setAttribute('class', 'row')
                }
                e.target.classList.add('active')
            }
        },
        onChange(checked) {
            this.checked = checked
        },
        async getOverView() {
            let query = {
                MDATE: this.month
            }
            this.checked ? query.IF_SHOPPER = '一般评价' : null
            let res =  await this.$fetchSql('new_retail', 'new_retail_bad_sum', query)
            this.handleData('overView', res.data)
            console.log(res.data)
        },
        async getArea() {
            let query = {
                MDATE: this.month
            }
            this.checked ? query.IF_SHOPPER = '一般评价' : null
            let res =  await this.$fetchSql('new_retail', 'new_retail_bad_area', query)
            this.areaData = res.data.concat()
            this.handleData('area', res.data)
            console.log(res.data)
        },
        async getTrend() {
            let query = {
                YDATE: moment(this.month).format('YYYY'),
                S_OR_N: this.S_OR_N
            }
            this.checked ? query.IF_SHOPPER = '一般评价' : null
            let res =  await this.$fetchSql('new_retail', 'new_retail_bad_trend', query)
            query.YDATE = query.YDATE - 1 + ''
            let res1 =  await this.$fetchSql('new_retail', 'new_retail_bad_trend', query)
            this.trendData = res.data.concat()
            this.trendData1 = res1.data.concat()
            this.handleData('trend', res.data, res1.data)
            // this.handleData('table', res.data)
        },
        async getTable() {
            let query = {
                YDATE: moment(this.month).format('YYYY'),
                S_OR_N: '汇总'
            }
            this.checked ? query.IF_SHOPPER = '一般评价' : null
            let res =  await this.$fetchSql('new_retail', 'new_retail_bad_trend', query)
            this.handleData('table', res.data)
        },
        handleData(type, source, source1) {
            if(type === 'overView') {
                for(let key in this.panel) {
                    this.panel[key] = null
                }
                if(!source.length) return
                this.panel = source[0]
            }
            else if(type === 'area') {
                this.table.tableData = []
                if(!source.length) return
                let arr = []
                arr.push(source.filter(_ => _.S_OR_N === '汇总')[0])
                arr.push(source.filter(_ => _.S_OR_N === '东区')[0])
                arr.push(source.filter(_ => _.S_OR_N === '南区')[0])
                arr.push(source.filter(_ => _.S_OR_N === '西区')[0])
                arr.push(source.filter(_ => _.S_OR_N === '北区')[0])
                let keys = []
                if(this.evaluate === '评价率') keys = ['MTD_APRS_ALL_RATE', 'YOY_APRS_ALL_RATE']
                else if(this.evaluate === '好评率') keys = ['MTD_APRS_GOOD_RATE', 'YOY_APRS_GOOD_RATE']
                else if(this.evaluate === '中评率') keys = ['MTD_APRS_MID_RATE', 'YOY_APRS_MID_RATE']
                else if(this.evaluate === '差评率') keys = ['MTD_APRS_BAD_RATE', 'YOY_APRS_BAD_RATE']
                this.table.tableData = keys.map((key, index) => {
                    return [
                        index === 0 ? this.evaluate : '同比',
                        ...arr.map(_ => _[key])
                    ]
                })
                console.log(this.table.tableData)
            }
            else if(type === 'trend') {
                this.line.xAxis.data = []
                this.line.series[0].data = []
                this.line.series[1].data = []
                this.$refs?.line?.$refs?.echarts?.clear()
                if(!source.length) return
                let arr = source.filter(_ => _.MONTH_DATE !== '累计')
                let arr1 = source1.filter(_ => _.MONTH_DATE !== '累计')
                if(!arr.length && !arr1.length) return
                arr.sort((a, b) => moment(a.MONTH_DATE).format('x') - moment(b.MONTH_DATE).format('x'))
                arr1.sort((a, b) => moment(a.MONTH_DATE).format('x') - moment(b.MONTH_DATE).format('x'))
                let obj = {
                    评价率: ['MONTH_DATE', 'MTD_APRS_ALL_RATE', 'AGO_APRS_ALL_RATE'],
                    好评率: ['MONTH_DATE', 'MTD_APRS_GOOD_RATE', 'AGO_APRS_GOOD_RATE'],
                    中评率: ['MONTH_DATE', 'MTD_APRS_MID_RATE', 'AGO_APRS_MID_RATE'],
                    差评率: ['MONTH_DATE', 'MTD_APRS_BAD_RATE', 'AGO_APRS_BAD_RATE']
                }
                let keys = obj[this.evaluate]
                this.line.series[0].data = arr.map(item => {
                    return keys.map((key, index) => {
                        if(key === 'MONTH_DATE' && moment(item.MONTH_DATE).format('x') <= moment(this.month).format('x')) return moment(item[key]).format('M月')
                        else if(key === 'MONTH_DATE' && moment(item.MONTH_DATE).format('x') > moment(this.month).format('x')) return key + index
                        return item[key]
                    })
                })
                this.line.series[1].data = arr1.map(item => {
                    return [
                        moment(item[keys[0]]).format('M月'),
                        item[keys[1]]
                    ]
                })
                this.line.xAxis.data = []
                for(let i = 0; i < 12; i++) {
                    this.line.xAxis.data.push(`${i + 1}月`)
                }
            }
            else if(type === 'table') {
                this.table1.tableData = []
                if(!source.length) return
                let arr = source.filter(_ => _.MONTH_DATE !== '累计')
                arr.sort((a, b) => moment(a.MONTH_DATE).format('x') - moment(b.MONTH_DATE).format('x'))
                arr.unshift(source.filter(_ => _.MONTH_DATE === '累计')[0])
                let keys = ['MONTH_DATE','MTD_APRS_ALL_RATE', 'MTD_APRS_GOOD_RATE', 'MTD_APRS_MID_RATE', 'MTD_APRS_BAD_RATE']
                this.table1.tableData = arr.map(item => {
                    return keys.map(key => {
                        return item[key]
                    })
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.red{
    color: #ff5953
}
.green{
    color: #00a854
}
.PoorRatingRate {
    .header {
        height: 38px;
        padding-bottom: 10px;
        border-bottom: 1px solid #F0F0F0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }

    .main {
        height: calc(100% - 48px);
        .panel {
            position: relative;
            margin-top: 13px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            .switch{
                z-index: 1;
                position: absolute;
                right: 0;
                top: 0;
                span:nth-child(1) {
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #000000;
                    line-height: 22px;
                    margin-right: 10px;
                }
            }
            .first {
                padding-left: 4px;
                position: relative;
                .line1 {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: rgba(0, 0, 0, 0.64);
                    line-height: 22px;
                    margin-bottom: 6px;
                }

                .line2 {
                    font-size: 24px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #333333;
                    line-height: 24px;
                    margin-bottom: 12px;
                }

                .line3 {
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #999999;
                    line-height: 18px;
                    overflow: hidden;

                    span:nth-child(1) {
                        float: left;
                    }

                    span:nth-child(2) {
                        float: right;
                        padding-right: 52px;
                    }
                }
            }
            .first::before{
                content: '';
                width: 1px;
                height: calc(100% - 20px);
                background: #F0F0F0;
                display: inline-block;
                position: absolute;
                right: 0;
                top: 20px;
            }
            .second {
                padding-top: 22px;
                padding-left: 50px;
                position: relative;
                .line1 {
                    font-size: 13px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: rgba(0, 0, 0, 0.64);
                    line-height: 22px;
                    margin-bottom: 4px;
                }

                .line2 {
                    font-size: 18px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #3C3C3C;
                    line-height: 24px;
                    margin-bottom: 7px;
                }

                .line3 {
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 18px;
                    overflow: hidden;

                    span:nth-child(1) {
                        float: left;
                    }

                    span:nth-child(2) {
                        float: right;
                        padding-right: 50px;
                    }
                }
            }
            .second::before{
                content: '';
                width: 1px;
                height: calc(100% - 20px);
                background: #F0F0F0;
                display: inline-block;
                position: absolute;
                right: 0;
                top: 20px;
            }
            .second:nth-last-child(1)::before{
                display: none;
            }
        }
        .select{
            margin-top: 20px;
            span:nth-child(1) {
                margin-right: 10px;
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #000000;
                line-height: 20px;
            }
        }
        .echartsBox{
            margin-top: 18px;
            height: calc(100% - 363px);
            display: flex;
            .table{
                width: 25%;
                margin-right: 30px;
                /deep/ .col1 .row{
                    cursor: pointer;
                    text-decoration: underline;
                    // color: #4C89FF;
                }
                /deep/ .col1 .row:hover{
                    cursor: pointer;
                    text-decoration: underline;
                    color: #4C89FF;
                }
                /deep/ .col1 .active{
                    color: #4C89FF;
                }
                /deep/ .col1 .row:nth-child(1) {
                    cursor: text;
                    text-decoration: none;
                    color: rgba(0, 0, 0, 0.88);
                }
                /deep/ .col1 .row:nth-child(2) {
                    // font-weight: 600;
                }
                /deep/ .col1, /deep/ .col{
                    display: grid;
                    grid-template-rows: repeat(6, 1fr);
                    .row{
                        height: 100%;
                    }
                    .row::before{
                        content: '';
                        display: inline-block;
                        vertical-align: middle;
                        height: 100%;
                    }
                }
            }
            .line{
                width: 75%!important;
                height: 100%!important;
                overflow: visible;
            }
        }
        .table1{
            margin-top: 17px;
            /deep/ .row{
                height: 28px;
                line-height: 28px;
            }
        }
    }
}
</style>