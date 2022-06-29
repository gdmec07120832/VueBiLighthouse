<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 15:26:58
 * @LastEditTime: 2022-02-28 14:03:46
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp4\components\Day.vue
-->
<template>
    <div class="Day">
<!--        <div class="header">-->
<!--            <div class="left">-->
<!--                <div class="line">-->
<!--                    <div class="l">-->
<!--                        广告投入-->
<!--                    </div>-->
<!--                    <div class="v" :style="[{color: computeColor(0, panel.v0)}]" @contextmenu.prevent="openMenu($event)">-->
<!--                        {{this.handleNum(2, panel.v0, true)}}-->
<!--                    </div>-->
<!--                    <div class="l">-->
<!--                        广告费-->
<!--                    </div>-->
<!--                    <div class="v" @contextmenu.prevent="openMenu($event)">-->
<!--                        {{this.handleNum(1, panel.v1, true)}}-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="line">-->
<!--                    <div class="l">-->
<!--                        环比-->
<!--                    </div>-->
<!--                    <div class="v" :style="[{color: computeColor(1, panel.v2)}]" @contextmenu.prevent="openMenu($event)">-->
<!--                        {{this.handleNum(2, panel.v2)}}-->
<!--                    </div>-->
<!--                    <div class="l">-->
<!--                        目标-->
<!--                    </div>-->
<!--                    <div class="v" @contextmenu.prevent="openMenu($event)">-->
<!--                        {{this.handleNum(1, panel.v3, true)}}-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <Border style="padding: 5px 40px;"/>-->
<!--            <div class="right">-->
<!--                <div class="line">-->
<!--                    <div class="l">-->
<!--                        上期广告费-->
<!--                    </div>-->
<!--                    <div class="v" @contextmenu.prevent="openMenu($event)" style="padding-left: 20px">-->
<!--                        {{this.handleNum(1, panel.v4, true)}}-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="line">-->
<!--                    <div class="l">-->
<!--                        上期差值-->
<!--                    </div>-->
<!--                    <div class="v" @contextmenu.prevent="openMenu($event)" style="padding-left: 20px">-->
<!--                        {{this.handleNum(1, panel.v5)}}-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <CopyBoard ref="CopyBoard"/>-->
<!--        </div>-->
        <Panel v-bind="panel1" class="panel"/>
        <div class="echartTitle mt20">
            广告投放情况
        </div>
        <v-chart ref="barAndLine" class="chart" style="overflow: visible;height: calc(100% - 339px);margin-bottom: 10px" :options="echart1" autoresize></v-chart>
        <div class="table">
            <Table v-bind="table"/>
            <Table v-bind="table1" style="margin: 10px 0"/>
        </div>
    </div>
</template>

<script>
// import Border from '../../../components/Border.vue'
import _ from 'lodash'
import Table from '../../../components/Table.vue'
import base from '../../../utils/base.js'
import moment from 'moment'
// import CopyBoard from '../../../components/CopyBoard.vue'
import Panel from '../../../components/Panel'
export default {
    mixins: [ base ],
    components: {
        // Border,
        Table,
        // CopyBoard,
        Panel,
    },
    async created() {
        this.echart1 = await _.cloneDeep(this.echartModel)
        this.getOvData()
        this.getData()
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
    },
    props: {
        titleBox: {
            type: Object
        },
        // 口径
        radioModel: {
            type: Number,
            default: 1
        },
        // 投放类型
        type: {
            type: Array,
            default: () => []
        },
    },
    watch: {
        'titleBox.month': {
            handler() {
                this.getOvData()
                this.getData()
            }
        },
        radioModel: {
            handler() {
                this.handleData(1, this.ovData)
                this.handleData(2, this.tableData)
                this.handleData(3, this.tableData)
                this.echart1.legend.data = ['花费', '广告投入占比']
                this.echart1.series[1].name = '广告投入占比'
            }
        },
        type: {
            handler(val, oval) {
                if(val.toString() === oval.toString()) return
                this.getOvData()
                this.getData()
            }
        }
    },
    computed:{
        panel1(){
            // 1为支付 2 为发货
            let payFlag = this.radioModel === 1 ? true : false
            return {
                name: '当月',
                tabIndex: 'Comp6',
                row: 4,
                column: 2,
                area: [
                    ['a_label', 'a_value'],
                    ['b_label', 'b_value'],
                    ['c_label', 'c_value'],
                    ['d_label', 'd_value'],
                ],
                map: [
                    {areaName: 'a_label', value: '投入占比目标', className: 'label'},
                    {areaName: 'a_value', keyName: 'ADV_INVESTMENT_TARGET', className: 'value', valueFormat: 'tenThousand'},
                    {areaName: 'b_label', value: '日累计投入占比', className: 'label'},
                    {areaName: 'b_value', keyName: payFlag ? 'PAY_RATE' : 'SPEND_RATE', className: 'value', valueFormat: 'percent_one_dot'},
                    {areaName: 'c_label', value: '日累计花费', className: 'label'},
                    {areaName: 'c_value', keyName: 'SPEND', className: 'value', valueFormat: 'tenThousand'},
                    {areaName: 'd_label', value: '日累计支付业绩', className: 'label'},
                    {areaName: 'd_value', keyName: payFlag ? 'EST_PAY_AMOUNT_CH' : 'ACT_PRICE_CH', className: 'value', valueFormat: 'tenThousand'},
                ],
                dataSource: this.panel1DataSource
            }
        }
    },
    data() {
        let that = this
        return {
            panel1DataSource: {
                ADV_INVESTMENT_TARGET: '--',
                SPEND: '--',
                PAY_RATE: '--',
                SPEND_RATE: '--'
            },
            echartModel: {
                tooltip: {
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    formatter: function (params) {
                        if(!params.length) return ''
                        let str = `${params[0].axisValue}<br/>`
                        params.forEach(item => {
                            let formatStr = 'normal'
                            if(item.seriesName === '花费') formatStr = 'round'
                            else if(['广告投入占比'].includes(item.seriesName)) formatStr = 'percent_one_dot'
                            str += `${item.marker}${item.seriesName}：${that.handleNum(formatStr, item.data[1])}<br/>`
                        })
                        return str
                    },
                    // formatter: function(params) {
                    //     let fun = (num) => {
                    //         let colors = ['#f6bd16', '#6395f9']
                    //         return `<div style="border-radius: 5px;width: 10px;height: 10px;background: ${colors[num]};display: inline-block;margin: 1px 5px 1px 0"></div>`
                    //     }
                    //     let div1 = fun(0), div2 = fun(1)
                    //     let str = `统计日期：${moment(params[0].data[2]).format('YYYY-MM-DD')}<br/>${div1}占比：${that.handleNum(2, params[1].data[1], true)}<br/>${div2}花费：${that.handleNum(1, params[0].data[1], true)}`
                    //     // let str1 = `统计日期：${moment(params[0].data[2]).format('YYYY-MM-DD')}<br/>占比：${that.handleNum(2, params[1].data[1], true)}`
                    //     return str
                    //     // return that.radioModel === 1 ? str : str1
                    // },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ccc'
                },
                legend: {
                    top: '0%',
                    left: 'center',
                    orient: 'horizontal',
                    align: 'left',
                    itemWidth: 13,
                    itemHeight: 13,
                    data: ['花费', '广告投入占比'],
                    icon: 'circle',
                    selectedMode: false
                },
                color: ['#6395f9', '#f6bd16', '#6d88b6', '#2ebfbe', '#5b8ff9'],
                grid: {
                    left: '0%',
                    right: '0%',
                    top: '9%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: {
                    name: '统计日期',
                    type: 'category',
                    data: [],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    // axisLabel: {
                    //     formatter: function(val){
                    //         return moment(val).format('D日')
                    //     }
                    // },
                    nameTextStyle: {
                        color: 'transparent'
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: false,
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            formatter: function(val){
                                return that.handleNum('round', val)
                            }
                        },
                    },
                    {
                        type: 'value',
                        show: false,
                        splitLine: {
                            show: false,
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '花费',
                        data: [],
                        type: 'bar',
                        smooth: true,
                        yAxisIndex: 0,
                        barWidth: 20,
                        itemStyle: {
                            barBorderRadius: [10, 10, 0, 0]
                        },
                    },
                    {
                        name: '广告投入占比',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        yAxisIndex: 1,
                    }
                ]
            },
            echart1: null,
            table: {
                index: '广告投入占比_当月',
                type: 2,
                labelData: ['日期', '花费', '支付业绩', '广告投入占比'],
                tableData: []
            },
            table1: {
                index: '广告投入占比_当月',
                type: 2,
                labelData: ['日期', '花费', '支付业绩', '广告投入占比'],
                tableData: []
            },
            tableData: [],
            panel: {
                v0: null,
                v1: null,
                v2: null,
                v3: null,
                v4: null,
                v5: null,
            },
            ovData: {}
        }
    },
    methods: {
        openMenu(e) {
            this.$refs.CopyBoard.openMenu(e, e.target.innerText)
        },
        computeColor(p, value) {
            if(p === 0) {
                if(value === 0 || value === null) return
                if(this.panel.v5 >= 0) return '#ff5953'
                else return '#00a854'
            }else if(p === 1) {
                if(value < 0) return '#ff5953'
                else if(value > 0) return '#00a854'
            }
        },
        // 获取概览 清空数据--获取数据--赋值进入中转
        async getOvData() {
            this.ovData = {}
            let query = {
                // MDATE: this.dateV2.day2,
                START_TIME: this.titleBox.month + '01',
                END_TIME: moment(this.titleBox.month + '01').endOf('month').format('YYYYMMDD')
            }
            // if(this.type.length) query.TARGETING_TYPE = this.type.toString()
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_advt_input_ov',query)
            // this.ovData = res.data[0]
            this.ovData = res.data
            this.handleData(1, res.data)
        },
        // 计算比值 或 同比
        handleReachOrYoY(type, a, b){
            if(type === 'reach'){
                if([null, undefined].includes(a) || [null, undefined, 0].includes(b)) return null
                else return a / b
            }
            else if(type === 'YOY'){
                if([null, undefined].includes(a) || [null, undefined, 0].includes(b)) return null
                else return (a - b) / b
            }
        },
        // type 1概览 2table 3chart
        handleData(type, source) {
            if(type === 1) {
                // let payFlag = this.radioModel
                // let arr = [
                //     payFlag === 1 ? 'PTD_PAY_RATE' : 'PTD_SEND_RATE',
                //     'PTD_COST_AMT',
                //     payFlag === 1 ? 'LAST_PAY_RATE' : 'LAST_SEND_RATE',
                //     'PTD_COST_TGT',
                //     'LAST_COST_AMT',
                //     'LAST_COST_DIFF'
                // ]
                // arr.forEach((key, index) => {
                //     this.panel['v' + index] = source[key]
                // })
                let arr = source.concat()
                this.panel1DataSource = {
                    PTD_COST_TGT: '--',
                    PTD_COST_AMT: '--',
                    PTD_PAY_RATE: '--',
                    PTD_SEND_RATE: '--'
                }
                if(!arr.length) return
                this.panel1DataSource = arr[0]
            }
            else if(type === 2) {
                let daysInMonth = moment(this.titleBox.month + '01').daysInMonth() <= 30 ? 15 : 16
                if(!source.length) {
                    this.table.tableData = []
                    this.table1.tableData = []
                    for(let i = 0; i < daysInMonth; i++) {
                        this.table.tableData.push(['/', '/', '/', '/'])
                        this.table1.tableData.push(['/', '/', '/', '/'])
                    }
                    return
                }
                // 一个月的一半
                let payOrNot = this.radioModel === 1 ? true : false
                let lables = ['日期', '花费', payOrNot ? '支付业绩' : '发货业绩', '广告投入占比']
                this.table.labelData = lables.concat()
                this.table1.labelData = lables.concat()
                let keys = ['TDATE', 'SPEND', payOrNot ? 'EST_PAY_AMOUNT_CH' : 'ACT_PRICE_CH', payOrNot ? 'pay_reach' : 'send_reach']
                let arr = source.concat()
                arr.sort((a, b) => moment(a.TDATE).format('x') - moment(b.TDATE).format('x'))
                arr = arr.map(item => {
                    let isAfter = moment(item.TDATE).format('YYYYMMDD') > moment().format('YYYYMMDD')
                    return keys.map(key => {
                        if(key === 'TDATE') return moment(item[keys[0]]).format('D日')
                        if(['SPEND', 'EST_PAY_AMOUNT_CH', 'ACT_PRICE_CH'].includes(key)) return !isAfter ? item[key] : null
                        if(key === 'pay_reach' || key === 'send_reach') return !isAfter ? this.handleReachOrYoY('reach', item[keys[1]], item[keys[2]]) : null
                        return item[key]
                    })
                })
                this.table.tableData = arr.slice(0, daysInMonth).concat()
                this.table1.tableData = arr.slice(daysInMonth, arr.length).concat()
                // 补偿
                for(let i = 0; i < daysInMonth * 2 - arr.length; i++) {
                    this.table1.tableData.push(lables.map(_ => '/'))
                }
                this.table.tableData = this.table.tableData.concat()
            // 清理echart--处理数据--赋值
            }
            else if(type === 3) {
                this.$refs?.barAndLine?.$refs?.echarts.clear()
                this.echart1 = _.cloneDeep(this.echartModel)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                this.echart1.series[1].data = []
                if(!source.length) return
                this.$refs?.chart1?.$refs?.echarts.clear()
                this.echart1 = _.cloneDeep(this.echartModel)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                this.echart1.series[1].data = []
                let arr = source.concat()
                arr.forEach(item => {
                    item.pay_reach = this.handleReachOrYoY('reach', item.SPEND, item.EST_PAY_AMOUNT_CH)
                    item.send_reach = this.handleReachOrYoY('reach', item.SPEND, item.ACT_PRICE_CH)
                })
                arr.sort((a, b) => moment(a.TDATE).format('x') - moment(b.TDATE).format('x'))
                // x轴
                // this.echart1.xAxis.data = arr.filter(_ => moment(_.TDATE).format('x') <= moment().format('x')).map(_ => moment(_.TDATE).format('D日'))
                // this.echart1.xAxis.data = arr.filter(_ => moment(_.TDATE).format('x') <= moment().format('x')).map(_ => _.TDATE)
                this.echart1.xAxis.data = []
                for(let i = 0; i < moment(this.titleBox.month + '01').daysInMonth(); i++) {
                    this.echart1.xAxis.data.push(i + 1 + '日')
                }
                // bar
                let keys = ['TDATE', 'SPEND']
                this.echart1.series[0].data = arr.map((item, index) => {
                    let isAfter = moment(item.TDATE).format('x') > moment().format('x')
                    if(isAfter) return 'null' + index
                    return keys.map(key => {
                        if(key === 'TDATE') return moment(item[key]).format('D日')
                        return item[key]
                    })
                })
                // line
                let flag = this.radioModel === 1 ? true : false
                let keys1 = ['TDATE', flag ? 'pay_reach' : 'send_reach']
                this.echart1.series[1].data = arr.map((item, index) => {
                    let isAfter = moment(item.TDATE).format('x') > moment().format('x')
                    if(isAfter) return 'null' + index
                    return keys1.map(key => {
                        if(key === 'TDATE') return moment(item[key]).format('D日')
                        return item[key]
                    })
                })
            }
        },
        async getData() {
            let query = {
                MDATE: this.titleBox.month
                // TARGETING_TYPE: this.type.toString()
            }
            // if(this.type.length) query.TARGETING_TYPE = this.type.toString()
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_advt_input_d', query)
            res.data.sort((a, b) => a.TDATE_DAY - b.TDATE_DAY)
            this.tableData = res.data.concat()
            this.handleData(2, res.data)
            this.handleData(3, res.data)
        }
    }
}
</script>

<style lang='scss' scoped>
.Day{
    flex: 1;
    // display: flex;
    // flex-direction: column;
    //.header{
    //    display: flex;
    //    height: 64px;
    //    //margin: 10px 0 0;
    //    .left, .right{
    //        .line{
    //            display: flex;
    //            .l, .v{
    //                font-size: 12px;
    //                line-height: 32px;
    //            }
    //            .l{
    //                width: 70px;
    //            }
    //            .v{
    //                width: 100px;
    //                cursor: text;
    //            }
    //            .v:nth-child(4) {
    //                width: auto;
    //            }
    //        }
    //    }
    //}
    /deep/ .panel{
        width: 150px;
        height: auto;
        .row{
            margin-top: 10px;
            &:nth-child(1){
                margin-top: 0;
            }
            .column:nth-child(1){
                width: 100px;
                flex: none;
            }
        }
    }
    .table{
        /deep/ .row {
            height: 22px;
            line-height: 22px;
        }
        // flex: 1;
        // display: flex;
        // flex-direction: column;
    }
}
</style>