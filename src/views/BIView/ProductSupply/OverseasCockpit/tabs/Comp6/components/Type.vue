<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 17:12:22
 * @LastEditTime: 2022-02-28 14:04:29
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp6\components\Type.vue
-->
<template>
    <div class="Type1">
        <Panel v-bind.sync="panel1" class="panel"/>
        <div class="middle">
            <div>当月采购成本</div>
            <v-chart ref="echart1" class="chart" style="height: calc(100% - 21px);overflow: visible" :options="echart1" autoresize></v-chart>
        </div>
        <div class="bottom mt10">
            <Table class="table" v-bind="table"/>
        </div>
    </div>
</template>

<script>
// import Border from '../../../components/Border'
import _ from 'lodash'
// import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import base from '../../../utils/base.js'
import moment from 'moment'
import {arrayMove} from 'vue-slicksort'
// import CopyBoard from '../../../components/CopyBoard.vue'
import Table from '../../../components/Table'
import Panel from '../../../components/Panel'

export default {
    mixins: [base],
    components: {
        // Border,
        // VirtualSelect,
        // CopyBoard,
        Table,
        Panel,
    },
    props: {
        dateV2: {
            type: Object,
        },
        year: {
            type: String,
        }
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel1)
        this.getCurrent()
        this.getData()
        // this.getTableData()
    },
    beforeDestroy() {
        if (this.echart1 !== null) this.echart1 = null
    },
    watch: {
        'dateV2.day2': {
            handler() {
                this.getCurrent()
            }
        },
        month: {
            handler() {
                this.getData()
                // this.getTableData()
            }
        },
        year: {
            handler() {
                this.getCurrent()
                this.getData()
            }
        }
    },
    computed: {
        month() {
            return this.dateV2.month1 + this.dateV2.month2
        }
    },
    data() {
        let that = this
        return {
            panel1: {
                name: '成本',
                tabIndex: 'Comp6',
                row: 2,
                column: 2,
                area: [
                    ['a_label', 'a_value'],
                    ['b_label', 'b_value']
                ],
                map: [
                    {areaName: 'a_label', value: '当月采购成本', className: 'label'},
                    {areaName: 'a_value', keyName: 'BQ_PUR_AMT', className: 'value', valueFormat: 'tenThousand'},
                    {areaName: 'b_label', value: '上月采购成本', className: 'label'},
                    {areaName: 'b_value', keyName: 'SQ_PUR_AMT', className: 'value', valueFormat: 'tenThousand'},
                ],
                dataSource: {}
            },
            echartModel1: {
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
                            if(item.seriesName === '当月采购成本') formatStr = 'round'
                            else if(item.seriesName === '采购成本环比') formatStr = 'percent_one_dot'
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
                    icon: 'circle'
                },
                color: ['#6395f9', '#DFDFDF'],
                grid: {
                    left: 0,
                    right: 0,
                    top: 10,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: {
                    name: '统计年月',
                    type: 'category',
                    data: [],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
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
                        name: '当月采购成本',
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
                        name: '采购成本环比',
                        symbolSize: 8,
                        data: [],
                        type: 'line',
                        smooth: true,
                        yAxisIndex: 1,
                    },
                ]
            },
            echart1: null,
            table: {
                type: 2,
                index: '采购成本',
                labelData: ['类型', '当月', '上月', '差值'],
                tableData: []
            },
            currentData: [],
        }
    },
    methods: {
        openMenu(e) {
            this.$refs.CopyBoard.openMenu(e, e.target.innerText)
        },
        async getCurrent() {
            let query = {
                START_TIME: this.year + moment().startOf('month').format('MMDD'),
                END_TIME: this.year + moment().endOf('month').format('MMDD')
            }
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_purchase_cost', query)
            this.panel1.dataSource = {}
            if(!res.data.length) return
            this.panel1.dataSource = res.data[0]
        },
        async getData() {
            let query = {
                START_TIME: this.year + '0101',
                END_TIME: this.year + '1231'
            }
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_purchase_cost', query)
            res.data.sort((a, b) => moment(a.MDATE).toDate().getTime() - moment(b.MDATE).toDate().getTime())
            this.currentData = res.data.concat()
            this.handleData('trend', res.data)
            this.handleData('table', res.data)
        },
        // 1chart 2table
        handleData(type, source) {
            if (type === 'trend') {
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel1)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                if (!source.length) return
                let arr = source.concat()
                // x轴
                this.echart1.xAxis.data = arr.map(_ => moment(_.MDATE).format('M月'))
                // line
                let that = this
                let keys = ['MDATE', 'BQ_PUR_AMT', 'BQ_RATE']
                this.echart1.series[0].name = '当月采购成本'
                this.echart1.yAxis[0].axisLabel.formatter = function(val){
                    return that.handleNum('tenThousand', val)
                }
                this.echart1.series[0].data = arr.map((item, index) => {
                    if (moment(item[keys[0]]).format('x') <= moment(new Date()).format('x')) {
                        return keys.map((key, index) => {
                            if(key === 'MDATE') return moment(item[key]).format('M月')
                            return item[key]
                        })
                    }
                    else return 'null' + index
                })
                this.echart1.series[1].data = arr.map((item, index) => {
                    if (moment(item[keys[0]]).format('x') <= moment(new Date()).format('x')) {
                        return [
                            moment(item[keys[0]]).format('M月'),
                            item[keys[2]]
                        ]
                    }
                    else return 'null' + index
                })
            }
            else if (type === 'table') {
                if (!source.length) {
                    this.table.tableData = []
                    this.table.tableData.push(['/', '/', '/', '/'])
                    return
                }
                this.table.labelData = ['类型', '当月采购成本', '环比差值', '环比']
                let keys = ['MDATE', 'BQ_PUR_AMT', 'DIFF', 'BQ_RATE']
                let arr = source.concat()
                arr = arr.map(item => {
                    let isAfter = moment(item.MDATE).format('x') > moment().format('x')
                    return keys.map(key => {
                        if(key === 'MDATE') return moment(item[key]).format('M月')
                        return !isAfter ? item[key] : null
                    })
                })
                this.table.tableData = arr.concat()
            }
        }
    }
}
</script>

<style lang='scss' scoped>
@import '../../../assets/styles.scss';

.Type1 {
    /deep/ .panel{
        height: auto;
        width: 150px;
        flex: none;
        .row{
            .column:nth-child(1){
                width: 80px;
                flex: none;
            }
        }
        .row:nth-child(2){
            margin-top: 10px;
        }
    }
    .middle {
        margin-top: 30px;
        height: calc(100% - 236px);
        .chart {
        }
    }

    .bottom {
        //margin-bottom: 10px;
        // height: 50%;
        position: relative;
        display: flex;
        flex-direction: column;
        .table {
            /deep/ .row {
                line-height: 35px;
                height: 35px;
            }
        }
    }
}
</style>