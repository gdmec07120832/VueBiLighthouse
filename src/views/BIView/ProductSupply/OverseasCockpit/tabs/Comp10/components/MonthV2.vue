<!--
 * @Author: 黄浩
 * @Date: 2022-01-19 16:04:49
 * @LastEditTime: 2022-03-01 09:07:38
 * @LastEditors: Please set LastEditors
 * @Descripttion: 退款率
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp10\components\MonthV2.vue
-->
<template>
    <div class="Day">
        <div class="panels">
            <Panel @clickPanel="clickPanel" :class="{active: moneyPanel.name === currentPanel ? true : false}" v-bind="moneyPanel"/>
            <Panel @clickPanel="clickPanel" :class="{active: numPanel.name === currentPanel ? true : false}" v-bind="numPanel"/>
        </div>
        <div class="right middle my20">
            <div style="margin: 0 0 0px 0">{{ currentPanel === '退款金额' ? '退款率趋势' : '退货率趋势' }}</div>
            <v-chart ref="echart1" style="height: calc(100% - 21px)" :options="echart1" autoresize></v-chart>
        </div>
        <Table class="table" v-bind="table"/>
    </div>
</template>

<script>
import graphic from 'echarts/lib/util/graphic'
import moment from 'moment'
import _ from 'lodash'
import base from '../../../utils/base.js'
import Table from '../../../components/Table'
import Panel from '../../../components/Panel'
export default {
    mixins: [ base ],
    props: {
        titleBox: {
            type: Object
        }
    },
    components: {
        Table,
        Panel,
    },
    watch: {
        currentPanel: {
            handler(){
                this.handleData('trend', this.echart1Data)
                this.handleData('table', this.echart1Data)
            }
        },
        'titleBox.year': {
            handler(){
                this.getData()
            }
        }
    },
    async created() {
        this.echart1 = await _.cloneDeep(this.echartModel1)
        // this.getDay()
        // this.getMonth()
        this.getData()

        // this.getPanel()
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
    },
    data() {
        let that = this
        return {
            currentPanel: '退款金额',
            moneyPanel: {
                name: '退款金额',
                tabIndex: 'Comp5',
                row: 3,
                column: 2,
                area: [
                    ['a', 'a_v'],
                    ['b', 'b_v'],
                    ['c', 'c_v'],
                ],
                map: [
                    {areaName: 'a', value: '月累计发货金额', className: 'label'},
                    {areaName: 'a_v', keyName: 'BQ_SEND_AMT', className: 'value', valueFormat: 'round'},
                    {areaName: 'b', value: '月累计退款金额', className: 'label'},
                    {areaName: 'b_v', keyName: 'BQ_REFUND_AMT', className: 'value', valueFormat: 'round'},
                    {areaName: 'c', value: '月累计退款率', className: 'label'},
                    {
                        areaName: 'c_v',
                        keyName: 'BQ_REFUND_RATE',
                        className: 'value',
                        valueFormat: 'percent_two_dot',
                        colorFormat: () => {
                            return that.handleColor(
                                'diff_reverse',
                                that.handleYOYOrReach(
                                    'diff',
                                    that.moneyPanel.dataSource.BQ_REFUND_RATE,
                                    that.moneyPanel.dataSource.BQ_REFUND_MONTH_TARGET
                                )
                            )
                        }
                    },
                ],
                dataSource: {}
            },
            numPanel: {
                name: '退款数量',
                tabIndex: 'Comp5',
                row: 3,
                column: 2,
                area: [
                    ['a', 'a_v'],
                    ['b', 'b_v'],
                    ['c', 'c_v'],
                ],
                map: [
                    {areaName: 'a', value: '月累计发货数量', className: 'label'},
                    {areaName: 'a_v', keyName: 'BQ_SEND_QTY', className: 'value', valueFormat: 'round'},
                    {areaName: 'b', value: '月累计退款数量', className: 'label'},
                    {areaName: 'b_v', keyName: 'BQ_REFUND_QTY', className: 'value', valueFormat: 'round'},
                    {areaName: 'c', value: '月累计退货率', className: 'label'},
                    {
                        areaName: 'c_v',
                        keyName: 'BQ_REFUND_QTY_RATE',
                        className: 'value',
                        valueFormat: 'percent_two_dot',
                        colorFormat: () => {
                            return that.handleColor(
                                'diff_reverse',
                                that.handleYOYOrReach(
                                    'diff',
                                    that.numPanel.dataSource.BQ_REFUND_QTY_RATE,
                                    that.numPanel.dataSource.BQ_REFUND_MONTH_TARGET
                                )
                            )
                        }
                    },
                ],
                dataSource: {}
            },
            // 右上角图
            echartModel1: {
                tooltip: {
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    formatter: function (params) {
                        if (!params.length) return ''
                        let str = `${params[0].axisValue}<br/>`
                        params.forEach(item => {
                            str += `${item.marker}${item.seriesName}：${that.handleNum('percent_two_dot', item.data[1])}<br/>`
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
                    // top: '25%',
                    // right: '0%',
                    // orient: 'vertical',
                    // align: 'left',
                    // itemWidth: 13,
                    // itemHeight: 13,
                    // data: [],
                    icon: 'circle',
                    selectedMode: false
                },
                color: ['#6395f9', '#DFDFDF'],
                grid: {
                    left: '0%',
                    right: '0%',
                    top: '8%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        formatter: (value) => {
                            return (moment(value).month() + 1) + '月'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#f6f6f6'
                        }
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        formatter: value => {
                            return (value * 100).toFixed(2) + '%'
                        }
                    }
                },
                series: [
                    // {
                    //     // symbolSize: 8,
                    //     name: '当月退款率',
                    //     data: [],
                    //     type: 'line',
                    //     smooth: true,
                    //     itemStyle: {
                    //         color: '#2680eb'
                    //     },
                    //     lineStyle: {
                    //         color: '#2680eb',
                    //         width: 1.5
                    //     },
                    //     areaStyle: {
                    //         color: new graphic.LinearGradient(0, 0, 0, 1, [
                    //             {
                    //             offset: 0,
                    //             color: '#2680eb'
                    //             },
                    //             {
                    //             offset: 1,
                    //             color: '#2680eb00'
                    //             }
                    //         ])
                    //     },
                    //     // symbol: 'none'
                    // },
                    // {
                    //     name: '同期退款率',
                    //     type: 'line',
                    //     barWidth: '20',
                    //     data: [],
                    //     label: {
                    //         show: false,
                    //         position: 'top'
                    //     },
                    //     z: 1,
                    //     smooth: true,
                    //     // symbol: 'none',
                    //     itemStyle: {
                    //         color: '#f3f5f9'
                    //     },
                    //     lineStyle: {
                    //         color: '#f3f5f9',
                    //         width: 1.5,
                    //     },
                    //     areaStyle: {
                    //         color: new graphic.LinearGradient(0, 0, 0, 1, [
                    //             {
                    //             offset: 0,
                    //             color: '#cce0e9'
                    //             },
                    //             {
                    //             offset: 1,
                    //             color: '#cce0e900'
                    //             }
                    //         ])
                    //     },
                    // },
                    {
                        name: '当月退款率',
                        data: [0],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        z: 2,
                    },
                    {
                        name: '同期退款率',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        z: 1
                    }
                ]
            },
            echart1: null,
            radio2: {
                name: '选项',
                arr: [
                    { label: '趋势', value: 1 },
                    { label: '明细', value: 2 },
                ],
                model: 1
            },
            people: [],
            peopleArr: [],
            tableData: {},
            // panel1: {
            //     v1: 0,
            //     v2: 0,
            //     v3: 0,
            //     v4: 0
            // },
            // panel2: {
            //     v1: 0,
            //     v2: 0,
            //     v3: 0,
            //     v4: 0
            // },
            currentDay: [],
            currentMonth: [],
            echart1Data: [],
            table: {
                type: 2,
                index: '退款率',
                labelData: ['月份', '发货金额', '退款金额', '退款率目标', '退款率', '同期退款率'],
                tableData: []
            },
        }
    },
    methods: {
        clickPanel(val){
            this.currentPanel = val
        },
        async getData() {
            let query = {
                START_TIME: this.titleBox.year + '0101',
                END_TIME: this.titleBox.year + '1231'
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_refund_m', query)
            res.data.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
            this.echart1Data = res.data.concat()
            this.handleData('panel', res.data)
            this.handleData('trend', res.data)
            this.handleData('table', res.data)
        },
        async getPanel() {
            let query = {
                START_TIME: moment().startOf('month').format('YYYYMMDD'),
                END_TIME: moment().endOf('month').format('YYYYMMDD')
            }
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_goods_refund_m', query)
            this.handleData('panel', res.data)
        },
        async handleData(type, source) {
            if(type === 'table') {
            // 明细
                this.table.tableData = []
                // this.table.labelData =  ['月份', this.radioModel === 1 ? '发货金额' : '发货数量', '退款金额', '退款率', '退款率目标', '同期退款率']
                this.table.labelData = this.currentPanel === '退款金额' ? ['月份', '发货金额', '退款金额', '退款率目标', '退款率', '同期退款率'] : ['月份', '发货数量', '退款数量', '退货率目标', '退货率', '同期退货率']
                let arr = source.concat()
                this.table.tableData.push(this.table.labelData.map(_ => '/'))
                if(!arr.length) return
                arr = arr.filter(_ => _.MDATE !== '合计')
                let sum = source.filter(_ => _.MDATE === '合计')
                if(sum.length) {
                    sum[0].BQ_REFUND_MONTH_TARGET = null
                    arr.unshift(sum[0])
                }
                let keys1 = ['MDATE', 'BQ_SEND_AMT', 'BQ_REFUND_AMT', 'BQ_REFUND_MONTH_TARGET', 'BQ_REFUND_RATE', 'TQ_REFUND_RATE']
                let keys2 = ['MDATE', 'BQ_SEND_QTY', 'BQ_REFUND_QTY', 'BQ_REFUND_MONTH_TARGET', 'BQ_REFUND_QTY_RATE', 'TQ_REFUND_RATE']
                let keys = this.currentPanel === '退款金额' ? keys1 : keys2
                arr.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                this.table.tableData = arr.map(item => {
                    return keys.map(key => {
                        if(key === 'MDATE') return item[key] === '合计' ? '合计' : moment(item[key]).format('M月')
                        return item[key]
                    })
                })
            }
            else if(type === 'trend') {
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel1)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                let arr = source.filter(_ => _.MDATE !== '合计')
                if(!arr.length) return
                if(this.currentPanel === '退款金额') {
                    this.echart1.series[0].name = '当月退款率'
                    this.echart1.series[1].name = '同期退款率'
                }
                else if(this.currentPanel === '退款数量') {
                    this.echart1.series[0].name = '当月退货率'
                    this.echart1.series[1].name = '同期退货率'
                }
                // x轴
                this.echart1.xAxis.data = arr.map(_ => moment(_.MDATE).format('YYYY-MM'))
                // line
                let keys = this.currentPanel === '退款金额' ? ['MDATE', 'BQ_REFUND_RATE', 'TQ_REFUND_RATE'] : ['MDATE', 'BQ_REFUND_QTY_RATE', 'TQ_REFUND_QTY_RATE']
                // let flag = moment(item[keys[0]]).format('x') > moment(moment(new Date()).format('YYYYMM')).format('x')
                this.echart1.series[0].data = arr.map(item => {
                    return keys.map(key => {
                        return item[key]
                    })
                })
                this.echart1.series[1].data = arr.map(item => {
                    return [
                        item[keys[0]],
                        item[keys[2]]
                    ]
                })
            }
            else if(type === 'panel'){
                this.moneyPanel.dataSource = {}
                this.numPanel.dataSource = {}
                let arr = source.filter(_ => _.MDATE === '合计')
                if(!arr.length) return
                this.moneyPanel.dataSource = arr[0]
                this.numPanel.dataSource = arr[0]
            }
        },

    }
}
</script>

<style lang='scss' scoped>
@import '../../../assets/styles.scss';
.Day{
    .header{
        // flex: 45;
        // height: calc(100% - 299px);
        display: flex;
        // border-bottom: 1px solid #f5f5f5;
        position: relative;
        margin-bottom: 10px;
        .item{
            // flex: 1;
            // display: flex;
            // flex-direction: column;
            .panel{
                // flex: 1;
                display: flex;
                .col{
                    // flex: 1;
                    padding: 0 50px 0 0 ;
                    .row{
                        font-size: 12px;
                        line-height: 32px;
                        height: 50%;
                    }
                }
                .col:nth-child(1) .row:nth-child(2) {
                    font-size: 20px;
                }
            }
        }
        .item:nth-child(1) {
            //margin: 0 88px 0 0;
        }
    }
    .panels{
        display: flex;
        .active{
            background: rgba(0, 0, 0, 0.03);
        }
        /deep/ .Panel{
            height: auto;
            width: 200px;
            padding: 5px 10px;
            &:hover{
                background: rgba(0, 0, 0, 0.03);
            }
            .row{
                margin-top: 10px;
            }
            .row:nth-child(1){
                margin-top: 0;
            }
        }
    }
    .middle{
        height: calc(100% - 334px);
    }
    .table{
        /deep/ .row{
            height: 35px;
            line-height: 35px;
        }
    }
}
</style>