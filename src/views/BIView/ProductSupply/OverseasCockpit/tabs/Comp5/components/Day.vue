<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 15:26:58
 * @LastEditTime: 2022-02-28 14:04:10
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp5\components\Day.vue
-->
<template>
    <div class="Day">
<!--        <div class="header">-->
<!--            <div class="left">-->
<!--                <div class="line">-->
<!--                    <div class="l">-->
<!--                        广告RoAS-->
<!--                    </div>-->
<!--                    <div class="v" :style="[{'font-size': '18px'}, {'font-weight': 'bold'}, {color: computeColor(0, panel.v0)}]" @contextmenu.prevent="openMenu($event)">-->
<!--                        {{this.handleNum(3, panel.v0, true)}}-->
<!--                        &lt;!&ndash; {{computeNum(0, panel.v0)}} &ndash;&gt;-->
<!--                    </div>-->
<!--                    <div class="l">-->
<!--                        当月目标-->
<!--                    </div>-->
<!--                    <div class="v" @contextmenu.prevent="openMenu($event)">-->
<!--                        {{this.handleNum(3, panel.v1, true)}}-->
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
<!--                        本月差值-->
<!--                    </div>-->
<!--                    <div class="v" @contextmenu.prevent="openMenu($event)">-->
<!--                        {{this.handleNum(3, panel.v3)}}-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <Border style="padding: 5px 40px;"/>-->
<!--            <div class="right">-->
<!--                <div class="line">-->
<!--                    <div class="l">-->
<!--                        上期广告RoAS-->
<!--                    </div>-->
<!--                    <div class="v" @contextmenu.prevent="openMenu($event)">-->
<!--                        {{this.handleNum(3, panel.v4, true)}}-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="line">-->
<!--                    <div class="l">-->
<!--                        上期差值-->
<!--                    </div>-->
<!--                    <div class="v" @contextmenu.prevent="openMenu($event)">-->
<!--                        {{this.handleNum(3, panel.v5)}}-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <CopyBoard ref="CopyBoard"/>-->
<!--        </div>-->
        <Panel class="Panel" v-bind="panel" style="height: auto;width: 400px"/>
        <div class="echartTitle" style="margin-top: 20px">
            广告投放情况
        </div>
        <v-chart ref="barAndLine" class="chart" :options="echart1" style="height: calc(100% - 307px);margin-bottom: 10px;overflow: visible" autoresize></v-chart>
        <div class="table">
            <Table v-bind="table"/>
            <Table v-bind="table1" class="mt10"/>
        </div>
    </div>
</template>

<script>
import Border from '../../../components/Border.vue'
import _ from 'lodash'
import Table from '../../../components/Table.vue'
import base from '../../../utils/base.js'
import moment from 'moment'
import CopyBoard from '../../../components/CopyBoard.vue'
import Panel from '../../../components/Panel'
export default {
    mixins: [ base ],
    components: {
        // Border,
        Table,
        // CopyBoard,
        Panel,
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel)
        this.getOvData()
        this.getData()
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
    },
    props: {
        titleBox: {
            type: Object,
            default: () => {}
        }
    },
    watch: {
        'titleBox.month': {
            handler() {
                this.getOvData()
                this.getData()
            }
        },
    },
    data() {
        let that = this
        return {
            panel: {
                name: 'day',
                tabIndex: 'Comp5',
                row: 2,
                column: 4,
                area: [
                    ['a', 'a_v', 'b', 'b_v'],
                    ['c', 'c_v', 'd', 'd_v'],
                ],
                map: [
                    {areaName: 'a', value: '当月RoAS目标', className: 'label'},
                    {areaName: 'a_v', keyName: 'ROI_GARGET', className: 'value', valueFormat: 'toFixed2'},
                    {areaName: 'b', value: '日累计花费', className: 'label'},
                    {areaName: 'b_v', keyName: 'SPEND', className: 'value', valueFormat: 'round'},
                    {areaName: 'c', value: '日累计RoAS', className: 'label'},
                    {
                        areaName: 'c_v',
                        keyName: 'ROAS',
                        className: 'value',
                        valueFormat: 'toFixed2',
                        colorFormat: () => that.handleColor('diff', that.handleYOYOrReach('diff', that.panel.dataSource.ROAS, that.panel.dataSource.ROI_GARGET))
                    },
                    {areaName: 'd', value: '日累计广告销售额', className: 'label'},
                    {areaName: 'd_v', keyName: 'SALES0', className: 'value', valueFormat: 'round'},
                ],
                dataSource: {}
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
                            else if(['广告RoAS'].includes(item.seriesName)) formatStr = 'toFixed2'
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
                    data: ['花费', '广告RoAS'],
                    icon: 'circle',
                    selectedMode: false
                },
                color: ['#6395f9', '#f6bd16'],
                grid: {
                    left: 0,
                    right: 0,
                    top: 10,
                    bottom: 0,
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
                        barWidth: 20,
                        type: 'bar',
                        smooth: true,
                        yAxisIndex: 0,
                        zlevel: 1,
                        itemStyle: {
                            barBorderRadius: [10, 10, 0, 0]
                        }
                    },
                    {
                        name: '广告RoAS',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        yAxisIndex: 1,
                        zlevel: 2,
                    }
                ]
            },
            echart1: null,
            table: {
                index: '广告roas_当月',
                type: 2,
                labelData: ['日期', '广告销售额', '花费', '广告RoAS'],
                tableData: []
            },
            table1: {
                index: '广告roas_当月',
                type: 2,
                labelData: ['日期', '广告销售额', '花费', '广告RoAS'],
                tableData: []
            },
            tableData: [],
            // panel: {
            //     v0: null,
            //     v1: null,
            //     v2: null,
            //     v3: null,
            //     v4: null,
            //     v5: null,
            // },
            ovData: {}
        }
    },
    methods: {
        openMenu(e) {
            this.$refs.CopyBoard.openMenu(e, e.target.innerText)
        },
        computeNum(p, value) {
            if(p === 0) {
                if(value === null || value === 0) return '--'
                return this.handleNum(3, value)
            }
        },
        computeColor(p, value) {
            if(p === 0) {
                if(value === 0 || value === null) return
                if(this.panel.v1 - this.panel.v0 <= 0) return '#ff5953'
                else return '#00a854'
            }else if(p === 1) {
                if(value > 0) return '#ff5953'
                else if(value < 0) return '#00a854'
            }
        },
        // 获取概览 清空数据--获取数据--赋值进入中转
        async getOvData() {
            this.ovData = {}
            let query = {
                START_TIME: this.titleBox.month + '01',
                END_TIME: moment(this.titleBox.month + '01').endOf('month').format('YYYYMMDD')
            }
            // if(this.type.length) query.TARGETING_TYPE = this.type.toString()
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_advt_input_ov',query)
            this.ovData = res.data
            this.handleData(1, res.data)
        },
        async getData() {
            let query = {
                MDATE: this.titleBox.month
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_advt_input_d', query)
            res.data.sort((a, b) => a.TDATE_DAY - b.TDATE_DAY)
            this.tableData = res.data.concat()
            this.handleData(2, res.data)
            this.handleData(3, res.data)
        },
        handleData(type, source) {
            if(type === 1) {
                this.panel.dataSource = {}
                let arr = source.concat()
                if(!arr.length) return
                this.panel.dataSource = arr[0]
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
                let labels = ['日期', '广告销售额', '花费', '广告RoAS']
                this.table.labelData = labels.concat()
                this.table1.labelData = labels.concat()
                let keys = ['TDATE', 'SALES0', 'SPEND', 'BQ_ROAS']
                let arr = source.concat()
                arr.sort((a, b) => moment(a.TDATE).format('x') - moment(b.TDATE).format('x'))
                arr = arr.map(item => {
                    return keys.map(key => {
                        if(key === 'TDATE') return moment(item[key]).format('D日')
                        return item[key]
                    })
                })
                this.table.tableData = arr.slice(0, daysInMonth).concat()
                this.table1.tableData = arr.slice(daysInMonth, arr.length).concat()
                // 补偿
                for(let i = 0; i < daysInMonth * 2 - arr.length; i++) {
                    this.table1.tableData.push(['/', '/', '/', '/'])
                }
            }
            else if(type === 3) {
                this.$refs?.barAndLine?.$refs?.echarts.clear()
                this.echart1 = _.cloneDeep(this.echartModel)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                this.echart1.series[1].data = []
                if(!source.length) return
                // x轴
                let arr = source.concat()
                arr.sort((a, b) => moment(a.TDATE).format('x') - moment(b.TDATE).format('x'))
                // this.echart1.xAxis.data = arr.filter(_ => moment(_.TDATE).format('x') <= moment().format('x')).map(_ => _.TDATE)
                this.echart1.xAxis.data = []
                for(let i = 0; i < moment(this.titleBox.month + '01').daysInMonth(); i++) {
                    this.echart1.xAxis.data.push(i + 1 + '日')
                }
                // bar
                let keys = ['TDATE', 'SPEND']
                this.echart1.series[0].data = arr.map((item, index) => {
                    if(moment(item.TDATE).format('x') > moment().format('x')) return 'null' + index
                    return keys.map(key => {
                        if(key === 'TDATE') return moment(item[key]).format('D日')
                        return item[key] === 0 ? null : item[key]
                    })
                })
                // line
                let keys1 = ['TDATE', 'BQ_ROAS']
                this.echart1.series[1].data = arr.map((item, index) => {
                    if(moment(item.TDATE).format('x') > moment().format('x')) return 'null' + index
                    return keys1.map(key => {
                        if(key === 'TDATE') return moment(item[key]).format('D日')
                        return item[key] === 0 ? null : item[key]
                    })
                })
            }
        },
    }
}
</script>

<style lang='scss' scoped>
.Day{
    flex: 1;
    // display: flex;
    // flex-direction: column;
    .header{
        display: flex;
        height: 64px;
        //margin-top: 10px;
        .left, .right{
            .line{
                display: flex;
                .l, .v{
                    font-size: 12px;
                    line-height: 32px;
                }
                .l{
                    width: 100px;
                }
                .v{
                    width: 100px;
                    cursor: text;
                }
                .v:nth-child(4) {
                    width: auto;
                }
            }
        }
    }
    /deep/ .Panel{
        .row{
            margin-top: 10px;
            .column:nth-child(odd){
                width: 110px;
                flex: none;
            }
            .column:nth-child(even){
                margin-right: 20px;
            }
        }
        .row:nth-child(1){
            margin-top: 0;
        }
    }
    .table{
        // flex: 1;
        display: flex;
        flex-direction: column;
    }
}
</style>