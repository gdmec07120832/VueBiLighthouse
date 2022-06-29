<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 15:27:04
 * @LastEditTime: 2022-02-28 14:03:56
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp4\components\Month.vue
-->
<template>
    <div class="Month" style="position: relative">
        <Panel class="panel" v-bind="panel1"/>
        <div class="mt20">广告投放情况</div>
        <v-chart ref="barAndLine" class="chart" style="margin: 0 0 30px;overflow: visible;height: calc(100% - 295px);" :options="echart1"
                 autoresize></v-chart>
        <Table class="table" v-bind="table"/>
    </div>
</template>

<script>
import _ from 'lodash'
import Table from '../../../components/Table.vue'
import moment from 'moment'
import base from '../../../utils/base.js'
import Panel from '../../../components/Panel'
export default {
    mixins: [base],
    components: {
        Table,
        Panel,
    },
    props: {
        titleBox: {
            type: Object,
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
    computed: {
        panel1(){
            // 1为支付 2 为发货
            let payFlag = this.radioModel === 1 ? true : false
            return {
                name: '当月',
                tabIndex: 'Comp6',
                row: 3,
                column: 4,
                area: [
                    ['a_label', 'a_value', 'b_label', 'b_value'],
                    ['c_label', 'c_value', 'd_label', 'd_value'],
                    ['e_label', 'e_value', 'f_label', 'f_value'],
                ],
                map: [
                    {areaName: 'a_label', value: '月累计投入占比', className: 'label'},
                    {areaName: 'a_value', keyName: payFlag ? 'PAY_RATE' : 'SPEND_RATE', className: 'value', valueFormat: 'percent_one_dot'},
                    {areaName: 'b_label', value: '同期月累计投入占比', className: 'label'},
                    {areaName: 'b_value', keyName: payFlag ? 'TQ_PAY_RATE' : 'TQ_SPEND_RATE', className: 'value', valueFormat: 'percent_one_dot'},
                    {areaName: 'c_label', value: '月累计花费', className: 'label'},
                    {areaName: 'c_value', keyName: 'SPEND', className: 'value', valueFormat: 'round'},
                    {areaName: 'd_label', value: '同期月累计花费', className: 'label'},
                    {areaName: 'd_value', keyName: 'TQ_SPEND', className: 'value', valueFormat: 'round'},
                    {areaName: 'e_label', value: payFlag ? '月累计支付业绩' : '月累计发货业绩', className: 'label'},
                    {areaName: 'e_value', keyName: payFlag ? 'EST_PAY_AMOUNT_CH' : 'ACT_PRICE_CH', className: 'value', valueFormat: 'round'},
                    {areaName: 'f_label', value: payFlag ? '同期月累计支付业绩' : '同期月累计发货业绩', className: 'label'},
                    {areaName: 'f_value', keyName: payFlag ? 'TQ_EST_PAY_AMOUNT_CH' : 'TQ_ACT_PRICE_CH', className: 'value', valueFormat: 'round'},

                ],
                dataSource: this.panel1DataSource
            }
        }
    },
    watch: {
        'titleBox.year': {
            handler() {
                this.getOvData()
                this.getData()
            }
        },
        radioModel: {
            handler() {
                this.handleData('table', this.tableData)
                this.handleData('trend', this.tableData)
                this.handleData('overView', this.ovData)
                this.echart1.legend.data = ['花费', '广告投入占比']
            }
        },
        type: {
            handler() {
                this.getData()
            }
        }
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel)
        this.getOvData()
        this.getData()
    },
    beforeDestroy() {
        if (this.echart1 !== null) this.echart1 = null
    },
    data() {
        let that = this
        return {
            ovData: [],
            panel1DataSource: {},
            echartModel: {
                tooltip: {
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    // formatter: function(params) {
                    //     let fun = (num) => {
                    //         let colors = ['#f6bd16', '#6395f9']
                    //         return `<div style="border-radius: 5px;width: 10px;height: 10px;background: ${colors[num]};display: inline-block;margin: 1px 5px 1px 0"></div>`
                    //     }
                    //     let div1 = fun(0), div2 = fun(1)
                    //     let flag = moment(params[0].data[0]).format('x') > moment(moment(new Date()).format('YYYYMMDD')).format('x')
                    //     let str = `统计日期：${moment(params[0].data[0]).format('YYYY-MM-DD')}<br/>${div1}占比：${flag ? '--' : that.handleNum(2, params[1].data[1], true)}<br/>${div2}花费：${flag ? '--' : that.handleNum(1, params[0].data[1], true)}`
                    //     return str
                    // },
                    formatter: function (params) {
                        if (!params.length) return ''
                        let str = `${params[0].axisId.replace('0', '')}：${params[0].axisValue}<br/>`
                        params.forEach(item => {
                            let formatStr = 'normal'
                            if (item.seriesName === '花费') formatStr = 'round'
                            else if (['广告投入占比'].includes(item.seriesName)) formatStr = 'percent_one_dot'
                            str += `${item.marker}${item.seriesName}：${that.handleNum(formatStr, item.data[1])}<br/>`
                        })
                        return str
                    },
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
                    name: '统计月份',
                    type: 'category',
                    data: [],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
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
                            formatter: (value) => {
                                return that.handleNum('round', value)
                            }
                        }
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
                        }
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
                index: '广告投入占比_月度',
                type: 2,
                labelData: ['日期', '投入占比目标', '实际占比', '花费', '支付业绩', '同期占比'],
                tableData: []
            },
            tableData: []
        }
    },
    methods: {
        async getOvData() {
            this.ovData = {}
            let START_TIME = this.titleBox.year + '0101'
            let END_TIME = this.titleBox.year + '1231'
            let query = {
                START_TIME: START_TIME,
                END_TIME: END_TIME > moment().format('YYYYMMDD') ? moment().format('YYYYMM') + '31' : END_TIME
            }
            // if(this.type.length) query.TARGETING_TYPE = this.type.toString()
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_advt_input_ov',query)
            // this.ovData = res.data[0]
            this.ovData = res.data
            this.handleData('overView', res.data)
        },
        async getData() {
            let query = {
                START_TIME: this.titleBox.year+ '0101',
                END_TIME: this.titleBox.year + '1231'
            }
            // if (this.type.length) query.TARGETING_TYPE = this.type.toString()
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_advt_input_m', query)
            res.data.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
            this.tableData = res.data.concat()
            this.handleData('table', res.data)
            this.handleData('trend', res.data)
        },
        // 计算比值 或 同比
        handleReachOrYoY(type, a, b) {
            if (type === 'reach') {
                if ([null, undefined].includes(a) || [null, undefined, 0].includes(b)) return null
                else return a / b
            } else if (type === 'YOY') {
                if ([null, undefined].includes(a) || [null, undefined, 0].includes(b)) return null
                else return (a - b) / b
            } else if (type === 'diff') {
                if ([null, undefined].includes(a) || [null, undefined].includes(b)) return null
                else return a - b
            }
        },
        handleData(type, source) {
            if (type === 'table') {
                // 差一步计算合计
                this.table.tableData = []
                this.table.tableData.push(['/', '/', '/', '/', '/', '/', '/', '/'])
                let arr = source.concat()
                if (!arr.length) return
                let payOrNot = this.radioModel === 1 ? true : false
                if(payOrNot) this.tableData.labelData = ['日期', '投入占比目标', '实际占比', '花费', '支付业绩', '同期占比']
                else this.tableData.labelData = ['日期', '投入占比目标', '实际占比', '花费', '发货业绩', '同期占比']
                let keys = [
                    'MDATE',
                    'ADV_RATE_TARGET',
                    payOrNot ? 'PAY_RATE' : 'SEND_RATE',
                    'SPEND',
                    payOrNot ? 'EST_PAY_AMOUNT_CH' : 'ACT_PRICE_CH',
                    payOrNot ? 'TQ_PAY_RATE' : 'TQ_SEND_RATE',
                ]
                arr = arr.filter(_ => _.MDATE !== '合计')
                this.table.tableData = arr.map(item => {
                    let isAfter = moment(item.MDATE.replace('-', '') + '01').format('x') > moment().format('x')
                    let isAfter1 = moment(item.MDATE.replace('-', '') + '01').format('YYYY') - 1 > moment().format('YYYY')
                    return keys.map(key => {
                        // if (!['ADV_INVESTMENT_TARGET', 'ADV_RATE_TARGET', 'MDATE'].includes(key)) return !isAfter ? item[key] : null
                        if(['MDATE'].includes(key)) return moment(item[key]).format('M月')
                        else if(['ADV_RATE_TARGET'].includes(key)) return item[key]
                        else if(['PAY_RATE', 'SEND_RATE', 'SPEND', 'EST_PAY_AMOUNT_CH', 'ACT_PRICE_CH'].includes(key)) return !isAfter ? item[key] : null
                        else if(['TQ_PAY_RATE', 'TQ_SEND_RATE'].includes(key)) return !isAfter1 ? item[key] : null
                        return item[key]
                    })
                })
            }
            else if (type === 'trend') {
                this.$refs?.barAndLine?.$refs?.echarts.clear()
                this.chart1 = _.cloneDeep(this.echartModel)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                this.echart1.series[1].data = []
                // let arr = source.filter(_ => moment(_.MDATE.replace('-', '') + '01').format('x') <= moment().format('x'))
                let arr = source.concat()
                if (!arr.length) return
                this.$refs?.chart1?.$refs?.echarts.clear()
                this.chart1 = _.cloneDeep(this.echartModel)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                this.echart1.series[1].data = []
                // 去合计
                arr = arr.filter(_ => _.MDATE !== '合计')
                // x轴
                this.echart1.xAxis.data = arr.map(_ => moment(_.MDATE).format('M月'))
                // bar
                let keys = ['MDATE', 'SPEND']
                this.echart1.series[0].data = arr.map((item, index) => {
                    if (moment(item[keys[0]]).format('x') <= moment(new Date()).format('x')) {
                        return keys.map(key => {
                            if(key === 'MDATE') return moment(item[key]).format('M月')
                            return item[key]
                        })
                    } else return 'null' + index
                })
                // line
                let flag = this.radioModel === 1 ? true : false
                let keys1 = ['MDATE', flag ? 'PAY_RATE' : 'SEND_RATE']
                this.echart1.series[1].data = arr.map((item, index) => {
                    if (moment(item[keys[0]]).format('x') <= moment(new Date()).format('x')) {
                        return keys1.map(key => {
                            if(key === 'MDATE') return moment(item[key]).format('M月')
                            return item[key]
                        })
                    } else return 'null' + index
                })
            }
            else if(type === 'overView'){
                let arr = source.concat()
                this.panel1DataSource = {}
                if(!arr.length) return
                this.panel1DataSource = arr[0]
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.Month {
    flex: 1;
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-end;
    /deep/ .panel{
        width: 420px;
        height: auto;
        .row{
            &:nth-child(2), &:nth-child(3){
                margin-top: 10px;
            }
            .column:nth-child(2){
                margin-right: 20px;
            }
            .column:nth-child(odd){
                width: 110px;
                flex: none;
            }
        }
    }
    .table /deep/ .row {
        height: 25px;
        line-height: 25px;
    }
}
</style>