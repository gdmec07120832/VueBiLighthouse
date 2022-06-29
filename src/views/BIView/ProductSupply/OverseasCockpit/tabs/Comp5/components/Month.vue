<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 15:27:04
 * @LastEditTime: 2022-02-28 14:04:14
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp5\components\Month.vue
-->
<script src="../../../../StrikeCockpit/utils/base.js"></script>
<template>
    <div class="Month">
        <Panel v-bind="panel" style="height: auto;width: 400px"/>
        <div class="mt20">
            广告投放情况
        </div>
        <v-chart ref="barAndLine" class="chart" style="margin: 0px 0 30px;overflow: visible;height: calc(100% - 355px)" :options="echart1" autoresize></v-chart>
        <Table v-bind="table" class="table"/>
    </div>
</template>

<script>
import _ from 'lodash'
import Table from '../../../components/Table.vue'
import moment from 'moment'
import base from '../../../utils/base.js'
import Panel from '../../../components/Panel'

export default {
    mixins: [ base ],
    props: {
        titleBox: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        Table,
        Panel,
    },
    watch: {
        'titleBox.year': {
            handler() {
                this.getOvData()
                this.getData()
            }
        },
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel)
        this.getOvData()
        this.getData()
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
    },
    data() {
        let that = this
        return {
            panel: {
                name: 'month',
                tabIndex: 'Comp5',
                row: 3,
                column: 4,
                area: [
                    ['a', 'a_v', 'b', 'b_v'],
                    ['c', 'c_v', 'd', 'd_v'],
                    ['e', 'e_v', 'f', 'f_v'],
                ],
                map: [
                    {areaName: 'a', value: '月累计花费', className: 'label'},
                    {areaName: 'a_v', keyName: 'SPEND', className: 'value', valueFormat: 'round'},
                    {areaName: 'b', value: '同期花费', className: 'label'},
                    {areaName: 'b_v', keyName: 'TQ_SPEND', className: 'value', valueFormat: 'round'},
                    {areaName: 'c', value: '月累计广告销售额', className: 'label'},
                    {areaName: 'c_v', keyName: 'SALES0', className: 'value', valueFormat: 'round'},
                    {areaName: 'd', value: '同期广告销售额', className: 'label'},
                    {areaName: 'd_v', keyName: 'TQ_SALES0', className: 'value', valueFormat: 'round'},
                    {areaName: 'e', value: '月累计RoAS', className: 'label'},
                    {areaName: 'e_v', keyName: 'ROAS', className: 'value', valueFormat: 'toFixed2'},
                    {areaName: 'f', value: '同期RoAS', className: 'label'},
                    {areaName: 'f_v', keyName: 'TQ_ROAS', className: 'value', valueFormat: 'toFixed2'},
                ],
                dataSource: {
                    a: 1
                }
            },
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
                    //     let div1 = fun(0), div2 = fun(1);
                    //     let flag = moment(params[0].data[0]).format('x') > moment(moment(new Date()).format('YYYYMM')).format('x')
                    //     let str = `统计年月：${params[0].data[0]}<br/>广告销售额：${flag ? '--' : that.handleNum(1, params[0].data[2], true) }<br/>`
                    //     str += `${div2}花费：${flag ? '--' : that.handleNum(1, params[0].data[1], true)}<br/>`
                    //     str += `${div1}广告RoAS：${flag ? '--' : that.handleNum(3, params[1].data[1], true)}<br/>`
                    //     return str
                    // },
                    formatter: function (params) {
                        if (!params.length) return ''
                        let str = `${params[0].axisId.replace('0', '')}：${params[0].axisValue}<br/>`
                        params.forEach(item => {
                            let formatStr = 'normal'
                            if (item.seriesName === '花费') formatStr = 'round'
                            else if (['月广告RoAS'].includes(item.seriesName)) formatStr = 'toFixed2'
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
                    data: ['花费', '月广告RoAS'],
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
                        }
                    },
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
                            formatter: val => that.handleNum('toFixed1', val)
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
                        name: '月广告RoAS',
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
                index: '广告roas_月度',
                type: 2,
                labelData: [],
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
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_advt_input_ov',query)
            this.ovData = res.data
            this.handleData('panel', res.data)
        },
        async getData() {
            let query = {
                START_TIME: this.titleBox.year + '0101',
                END_TIME: this.titleBox.year + '1231'
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_advt_input_m', query)
            res.data.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
            this.tableData = res.data.concat()
            this.handleData('table', res.data)
            this.handleData('trend', res.data)
        },
        handleData(type, source) {
            if(type === 'table') {
                this.table.tableData = []
                // for(let i = 0; i < 16; i++) {
                this.table.tableData.push(['/', '/', '/', '/', '/', '/'])
                // }
                if(!source.length) return
                source.forEach(item => {
                    item.ASoAS = this.handleYOYOrReach('reach', item.SALES0, item.EST_PAY_AMOUNT_CH)
                })
                // let lables = ['日期', '广告销售额', '花费', '广告RoAS', '环比']
                let lables = ['日期', '广告销售额', '花费', '广告RoAS目标', '广告RoAS', '同期RoAS', 'ASoAS']
                this.table.labelData = lables.concat()
                let keys = ['MDATE', 'SALES0', 'SPEND', 'ROI_GARGET', 'BQ_ROAS', 'TQ_ROAS', 'ASoAS']
                let arr = source.filter(_ => _.MDATE !== '合计')
                arr = arr.map(item => {
                    let isAfter = item.MDATE.replace('-', '') > moment().format('YYYYMM')
                    return keys.map(key => {
                        if(key === 'MDATE') return moment(item[key].replace('-', '') + '01').format('M月')
                        if(key === 'TQ_ROAS') return item[key]
                        return !isAfter ? item[key] : null
                    })
                })
                let sum = source.filter(_ => _.MDATE === '合计')
                sum = sum.map(item => {
                    return keys.map(key => {
                        if(key === 'ROI_GARGET') return null
                        return item[key]
                    })
                })
                if(sum.length) arr.unshift(sum[0])
                this.table.tableData = arr.concat()
            }
            else if(type === 'trend') {
                this.$refs?.barAndLine?.$refs?.echarts.clear()
                this.echart1 = _.cloneDeep(this.echartModel)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                this.echart1.series[1].data = []
                if(!source.length) return
                let arr = source.filter(_ => _.MDATE !== '合计')
                // x轴
                // this.echart1.xAxis.data = arr.filter(_ => moment(_.MDATE.replace('-', '') + '01').format('x') <= moment().format('x')).map(_ => _.MDATE)
                this.echart1.xAxis.data = arr.map(_ => moment(_.MDATE).format('M月'))
                // bar
                let keys = ['MDATE', 'SPEND']
                this.echart1.series[0].data = arr.map((item, index) => {
                    if(moment(item[keys[0]]).format('x') <= moment(new Date()).format('x')){
                        return keys.map(key => {
                            if(key === 'MDATE') return moment(item[key]).format('M月')
                            return item[key]
                        })
                    }
                    else return 'null' + index
                })
                // line
                let keys1 = ['MDATE', 'BQ_ROAS']
                this.echart1.series[1].data = arr.map((item, index) => {
                    if(moment(item[keys[0]]).format('x') <= moment(new Date()).format('x')){
                        return keys1.map(key => {
                            if(key === 'MDATE') return moment(item[key]).format('M月')
                            return item[key]
                        })
                    }
                    else return 'null' + index
                })
            }
            else if(type === 'panel'){
                this.panel.dataSource = {}
                let arr = source.concat()
                if(!arr.length) return
                this.panel.dataSource = arr[0]
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.Month {
    // flex: 1;
    height: 100%;
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-end;
    /deep/ .Panel{
        .row{
            margin-top: 10px;
            .column:nth-child(1){
                width: 110px;
                flex: none;
            }
        }
        .row:nth-child(1){
            margin-top: 0;
        }
    }
    .table /deep/ .row {
        height: 30px;
        line-height: 30px;
    }
}
</style>