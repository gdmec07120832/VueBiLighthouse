<!--
 * @Author: 黄浩
 * @Date: 2022-01-10 11:44:36
 * @LastEditTime: 2022-02-28 14:05:29
 * @LastEditors: Please set LastEditors
 * @Descripttion: 定价毛利
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp12\indexV2.vue
-->
<template>
    <div class="Comp12">
        <div class="titleBox" style="display: flex;align-items: center;">
            <Title :label="'定价毛利率'"/>
            <div style="flex: 1"></div>
            <div class="text-xs text-black">统计年份</div>
            <YearPicker class="ml10" :year.sync="titleBox.year"/>
        </div>
        <div style="width: calc(100% + 40px);height: 1px;background: #ccc;margin: 9.5px 0;transform: translateX(-20px)"></div>
        <Panel v-bind="panel"/>
        <div class="chart mt20">
            <div>海外定价毛利率月趋势</div>
            <v-chart ref="echart1" class="mt10" style="height: calc(100% - 31px)" :options="echart1" autoresize></v-chart>
        </div>
        <Table v-bind="table" class="table mt20"/>
    </div>
</template>

<script>
import Title from '../../components/Title'
import moment from 'moment'
import _ from 'lodash'
import base from '../../utils/base.js'
import Table from '../../components/Table'
import YearPicker from '../../components/YearPicker'
import Panel from '../../components/Panel'
export default {
    mixins: [ base ],
    components: {
        Table,
        Title,
        YearPicker,
        Panel,
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel1)
        this.getPanel()
        this.getData()
    },
    watch: {
        'titleBox.year': {
            handler(){
                this.getData()
            }
        }
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
    },
    data() {
        let that = this
        return {
            titleBox: {
                year: moment().format('YYYY'),
            },
            panel: {
                name: '',
                tabIndex: 'Comp6',
                row: 2,
                column: 4,
                area: [
                    ['a', 'a_v', 'b', 'b_v'],
                    ['c', 'c_v', 'd', 'd_v']
                ],
                map: [
                    {areaName: 'a', value: '月累计毛利率', className: 'label'},
                    {areaName: 'a_v', keyName: 'GRS_PRFT', className: 'value', valueFormat: 'percent_one_dot'},
                    {areaName: 'b', value: '同期毛利率', className: 'label'},
                    {areaName: 'b_v', keyName: 'TQ_GRS_PRFT', className: 'value', valueFormat: 'percent_one_dot'},
                    {areaName: 'c', value: '月累计毛利额', className: 'label'},
                    {areaName: 'c_v', keyName: 'GRS_AMT', className: 'value', valueFormat: 'round'},
                    {areaName: 'd', value: '同期毛利额', className: 'label'},
                    {areaName: 'd_v', keyName: 'TQ_GRS_AMT', className: 'value', valueFormat: 'round'},
                ],
                dataSource: {}
            },
            echartModel1: {
                legend: {
                    top: 0,
                    left: 'center',
                    orient: 'horizontal',
                    align: 'left',
                    itemWidth: 13,
                    itemHeight: 13,
                    icon: 'circle',
                    selectedMode: false
                },
                tooltip: {
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ccc',
                    formatter: function (params) {
                        if (!params.length) return ''
                        let str = `${params[0].axisValue}<br/>`
                        params.forEach(item => {
                            str += `${item.marker}${item.seriesName}：${that.handleNum('percent_one_dot', item.data[1])}<br/>`
                        })
                        return str
                    },
                },
                // color: ['#6c9bf9', '#f3f5f9'],
                color: ['#6395f9', '#DFDFDF'],
                grid: {
                    left: 0,
                    right: 0,
                    top: 30,
                    bottom: 0,
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
                        formatter: (value) => {
                            return that.handleNum(2, value)
                        }
                    },
                    max: val => Math.ceil(val.max * 10) / 10 + 0.2
                },
                series: [
                    {
                        name: '当期定价毛利率',
                        symbolSize: 7,
                        data: [],
                        type: 'line',
                        smooth: true,
                        z: 2,
                    },
                    // {
                    //     name: '同期定价毛利率',
                    //     symbolSize: 7,
                    //     type: 'line',
                    //     barWidth: '20',
                    //     data: [],
                    //     // itemStyle: {
                    //     //     color: '#f3f5f9'
                    //     // },
                    //     label: {
                    //         show: false,
                    //         position: 'top'
                    //     },
                    //     areaStyle: {
                    //         color: '#f3f5f9',
                    //         opacity: 1
                    //     },
                    //     smooth: true,
                    //     lineStyle: {
                    //         color: 'transparent'
                    //     },
                    //     z: 1,
                    // },
                    {
                        name: '同期定价毛利率',
                        symbolSize: 8,
                        data: [],
                        type: 'line',
                        smooth: true,
                        z: 1,
                    },
                ]
            },
            echart1: null,
            people: [],
            peopleArr: [],
            table: {
                type: 2,
                index: '定价毛利率',
                labelData: ['统计年月', '定价毛利率目标', '定价毛利率', '目标差值', '同期定价毛利率'],
                tableData: []
            },
            tableData: []
        }
    },
    methods: {
        computeColor(value) {
            if(value === 0 || value === null || value === '--') return
            if(this.panel.v3 <= 0) return '#ff5953'
            else return '#00a854'
        },
        handleChange() {
            
        },
        // 左上角数据
        async getPanel() {
            let END_TIME = this.titleBox.year + '1231'
            let YYYYMMDD = moment().endOf('month').format('YYYYMMDD')
            let query = {
                START_TIME: this.titleBox.year + '0101',
                END_TIME: END_TIME > YYYYMMDD ? YYYYMMDD : END_TIME
            }
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_stand_profit', query)
            this.handleData('panel', res.data)
        },
        // 中间月趋势图
        async getData() {
            let query = {
                START_TIME: this.titleBox.year + '0101',
                END_TIME: this.titleBox.year + '1231'
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_stand_profit', query)
            res.data.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
            this.handleData('trend', res.data)
            this.handleData('table', res.data)
        },
        // 1 左上角 2echart 3table
        handleData(type, source) {
            if(type === 'panel') {
                this.panel.dataSource = {}
                let arr = source.concat()
                if(!arr.length) return
                let sum = arr.filter(_ => _.TYPE === '合计')
                if(sum.length) this.panel.dataSource = sum[0]
            }
            else if(type === 'trend') {
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel1)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                let arr = source.concat()
                if(!arr.length) return
                arr = arr.filter(_ => _.TYPE !== '合计')
                arr.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                // 轴
                this.echart1.xAxis.data = Array.from(new Set(arr.map(_ => moment(_.MDATE).format('M月'))))
                // line
                // this.echart1.series[0].data = this.echart1.xAxis.data.map(month => {
                //     return arr.filter(_ => month.indexOf(moment(_.MDATE).format('MM')) > -1)[0]
                // }).map(item => {
                //     if(moment(item.MDATE).format('x') <= moment(new Date()).format('x')){
                //         return [
                //             moment(item.MDATE).format('MM'),
                //             item.GRS_PRFT
                //         ]
                //     }else return null
                // })
                let keys = ['MDATE', 'GRS_PRFT', 'TQ_GRS_PRFT']
                this.echart1.series[0].data = arr.map((item, index) => {
                    let isAfter = moment(item.MDATE).format('x') > moment().format('x')
                    if(isAfter) return 'null' + index
                    return keys.map(key => {
                        if(key === 'MDATE') return moment(item[key]).format('M月')
                        return item[key]
                    })
                })
                this.echart1.series[1].data = arr.map((item, index) => {
                    let isAfter = moment(item.MDATE).format('YYYY') - 1 > moment().format('YYYY')
                    if(isAfter) return 'null' + index
                    return [
                        moment(item.MDATE).format('M月'),
                        item[keys[2]]
                    ]
                })
            }
            else if(type === 'table') {
                this.table.tableData = []
                this.table.tableData.push(this.table.labelData.map(_ => '/'))
                let arr = source.concat()
                if(!arr.length) return
                let keys = ['MDATE', 'GROSS_PROFIT_TARGET', 'GRS_PRFT', 'DIFF', 'TQ_GRS_PRFT']
                arr = arr.filter(_ => _.TYPE !== '合计').sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                let sum = source.filter(_ => _.TYPE === '合计').concat()
                sum.forEach(_ => _.MDATE = '合计')
                if(sum.length){
                    sum[0].GROSS_PROFIT_TARGET = null
                    sum[0].DIFF = null
                    sum[0].TQ_GRS_PRFT = null
                    arr.unshift(sum[0])
                }
                arr = arr.map(item => {
                    return keys.map(key => {
                        if(key === 'MDATE' && item[key] !== '合计') return moment(item[key]).format('M月')
                        return item[key]
                    })
                })
                this.table.tableData = arr.concat()}
        }
    }
}
</script>

<style lang='scss' scoped>
@import '../../assets/styles.scss';
.Comp12{
    flex: 1;
    padding: 10px 20px;
    position: relative;
    /deep/ .Panel{
        height: auto;
        width: 400px;
        .row:nth-child(2){
            margin-top: 10px;
        }
    }
    .chart{
        // flex: 1;
        height: calc(100% - 338px);
    }
    .table {
        /deep/ .row{
            height: 40px;
            line-height: 40px
        }
        /deep/ .col .row {
            text-align: right;
        }
    }
}
</style>