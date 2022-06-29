<!--
 * @Author: 黄浩
 * @Date: 2022-01-10 11:00:23
 * @LastEditTime: 2022-02-28 14:05:20
 * @LastEditors: Please set LastEditors
 * @Descripttion: 年化周转
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp11\indexV2.vue
-->
<template>
    <div class="Comp11">
        <div class="titleBox" style="display: flex;align-items: center;">
            <Title :label="'年化周转'" :ps="'备注：<br/>【1】当月：年化周转率（金额）=累计发出/((期初含压货+期末含压货)/2)*当年总天数/当前天数；<br/>【2】历史：年化周转率(金额)=累计发出/((期初含压货+期末含压货)/2)*12/当前月份。'"/>
            <div style="flex: 1"></div>
            <div class="text-xs text-black">统计年份</div>
            <YearPicker class="ml10" :year.sync="titleBox.year"/>
        </div>
        <div style="width: calc(100% + 40px);height: 1px;background: #ccc;margin: 9.5px 0;transform: translateX(-20px)"></div>
        <div class="panels">
            <Panel :class="{active: currentPanel === 'panel1' ? true : false}" @clickPanel="clickPanel" v-bind="panel1"/>
            <Panel :class="{active: currentPanel === 'panel2' ? true : false}" @clickPanel="clickPanel" v-bind="panel2"/>
        </div>
        <div class="mt20">周转趋势</div>
        <v-chart ref="echart1" class="chart mb10" style="height: calc(100% - 369px)" :options="echart1" autoresize></v-chart>
        <div class="footer">
            <Table class="table" v-bind="table"/>
        </div>
    </div>
</template>

<script>
import Title from '../../components/Title'
import graphic from 'echarts/lib/util/graphic'
import moment from 'moment'
import _ from 'lodash'
import Table from '../../components/Table'
import base from '../../utils/base.js'
import YearPicker from '../../components/YearPicker'
import Panel from '../../components/Panel'
export default {
    mixins:[ base ],
    components: {
        Table,
        // Datepicker,
        Title,
        YearPicker,
        Panel,
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel1)
        this.echart2 = _.cloneDeep(this.echartModel2)
        this.getPanel()
        this.getData()
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
        if(this.echart2 !== null) this.echart2 = null
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
    data() {
        let that = this
        return {
            currentPanel: 'panel1',
            panel1: {
                name: 'panel1',
                tabIndex: 'Comp5',
                row: 4,
                column: 2,
                area: [
                    ['a', 'a'],
                    ['b', 'b_v'],
                    ['c', 'c_v'],
                    ['d', 'd_v'],
                ],
                map: [
                    {areaName: 'a', value: '海外全链路', className: 'title'},
                    {areaName: 'b', value: '当月周转率', className: 'label'},
                    {areaName: 'b_v', keyName: 'ALL_TRNVR_RATE', className: 'value', valueFormat: 'toFixed2'},
                    {areaName: 'c', value: '同期周转率', className: 'label'},
                    {areaName: 'c_v', keyName: 'ALL_AGO_TRNVR_RATE', className: 'value', valueFormat: 'toFixed2'},
                    {areaName: 'd', value: '同比', className: 'label'},
                    {areaName: 'd_v', keyName: 'all_YOY', className: 'value', valueFormat: 'percent_one_dot'},
                ],
                dataSource: {}
            },
            panel2: {
                name: 'panel2',
                tabIndex: 'Comp5',
                row: 4,
                column: 2,
                area: [
                    ['a', 'a'],
                    ['b', 'b_v'],
                    ['c', 'c_v'],
                    ['d', 'd_v'],
                ],
                map: [
                    {areaName: 'a', value: '海外链路（海外仓模块+亚马逊仓模块）', className: 'title'},
                    {areaName: 'b', value: '当月周转率', className: 'label'},
                    {areaName: 'b_v', keyName: 'TRNVR_RATE', className: 'value', valueFormat: 'toFixed2'},
                    {areaName: 'c', value: '同期周转率', className: 'label'},
                    {areaName: 'c_v', keyName: 'AGO_TRNVR_RATE', className: 'value', valueFormat: 'toFixed2'},
                    {areaName: 'd', value: '同比', className: 'label'},
                    {areaName: 'd_v', keyName: 'hw_YOY', className: 'value', valueFormat: 'percent_one_dot'},
                ],
                dataSource: {}
            },
            titleBox: {
                year: moment().format('YYYY'),
            },
            panelData: [],
            // date: moment(new Date()).format('YYYYMM'),
            // month1: moment(new Date()).format('YYYYMM') - 100 + '',
            // month2: moment(new Date()).format('YYYYMM'),
            echartModel1: {
                tooltip: {
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    // formatter: function(params) {
                    //     let fun = (num) => {
                    //         let colors = ['#2680eb', '#cce0e9']
                    //         return `<div style="border-radius: 5px;width: 10px;height: 10px;background: ${colors[num]};display: inline-block;margin: 1px 5px 1px 0"></div>`
                    //     }
                    //     let div1 = fun(0), div2 = fun(1)
                    //     let flag = moment(moment(that.dateV2.month2).format('YYYY-') + params[0].axisValue).format('x') > moment(moment(new Date()).format('YYYYMM')).format('x')
                    //     let str = `统计年月：${moment(that.dateV2.month2).format('YYYY-') + params[0].axisValue}<br/>${div1}周转率：${flag ? '--' : that.handleNum(3, params[0].data[1])}<br/>${div2}同期周转率：${that.handleNum(3, params[0].data[2])}`
                    //     return str
                    // },
                    formatter: function (params) {
                        if (!params.length) return ''
                        let str = `${params[0].axisValue}<br/>`
                        params.forEach(item => {
                            str += `${item.marker}${item.seriesName}：${that.handleNum('toFixed2', item.data[1])}<br/>`
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
                    icon: 'circle',
                    selectedMode: false
                },
                // color: ['#6c9bf9'],
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
                            // return value < 10 ? value.replace('0', '') + '月' : value + '月'
                            return value
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
                        formatter: (val) => {
                            return that.handleNum('toFixed2', val)
                        }
                    }
                },
                series: [
                    // {
                    //     name: '当期周转率',
                    //     data: [],
                    //     type: 'line',
                    //     smooth: true,
                    //     connectNulls: true,
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
                    //                 offset: 0,
                    //                 color: '#2680eb'
                    //             },
                    //             {
                    //                 offset: 1,
                    //                 color: '#2680eb00'
                    //             }
                    //         ])
                    //     },
                    //     // symbol: 'none'
                    // },
                    // {
                    //     name: '同期周转率',
                    //     type: 'line',
                    //     barWidth: '20',
                    //     data: [],
                    //     smooth: true,
                    //     label: {
                    //         show: false,
                    //         position: 'top'
                    //     },
                    //     z: 1,
                    //     // smooth: true,
                    //     itemStyle: {
                    //         color: '#f3f5f9'
                    //     },
                    //     lineStyle: {
                    //         color: '#f3f5f9',
                    //         width: 1.5,
                    //     },
                    //     areaStyle: {
                    //         color: '#f3f5f9',
                    //         opacity: 1,
                    //     },
                    // },
                    {
                        name: '当期周转率',
                        data: [0],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        z: 2,
                    },
                    {
                        name: '同期周转率',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        z: 1
                    }
                ]
            },
            echart1: null,
            echart1Data: [],
            people: [],
            peopleArr: [],
            table: {
                type: 2,
                index: '年化周转',
                labelData: ['统计年月', '周转率目标', '实际周转率', '达成率', '同期周转率', '同比'],
                tableData: []
            },
            tableData: [],
        }
    },
    methods: {
        clickPanel(val){
            this.currentPanel = val
        },
        computeColor(p, value) {
            if(p === 0) {
                if(value === 0 || value === null || value === '--') return
                if(this.panel1.v4 <= 0) return '#ff5953'
                else return '#00a854'
            }else if(p === 1 || p === 2 || p === 3 || p === 4) {
                if(value > 0) return '#ff5953'
                else if(value < 0) return '#00a854'
            }
        },
        async getPanel(){
            let query = {
                START_TIME: moment().startOf('month').format('YYYYMMDD'),
                END_TIME: moment().endOf('month').format('YYYYMMDD')
            }
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_annual_turnover', query)
            this.handleData('panel', res.data)
        },
        async getData() {
            let END_TIME = this.titleBox.year + '1231'
            let YYYYMMDD = moment().endOf('month').format('YYYYMMDD')
            let query = {
                START_TIME: this.titleBox.year + '0101',
                END_TIME: END_TIME
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_annual_turnover', query)
            res.data.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
            this.echart1Data = res.data.concat()
            this.handleData('trend', res.data)
            this.handleData('table', res.data)
        },
        // 1处理左上角 2处理周转率月趋势 3table
        handleData(type, source) {
            if(type === 'panel') {
                this.panel1.dataSource = {}
                this.panel2.dataSource = {}
                let arr = source.concat()
                if(!arr.length) return
                arr[0].all_YOY = this.handleYOYOrReach('YOY', arr[0].ALL_TRNVR_RATE, arr[0].ALL_AGO_TRNVR_RATE)
                arr[0].hw_YOY = this.handleYOYOrReach('YOY', arr[0].TRNVR_RATE, arr[0].AGO_TRNVR_RATE)
                this.panel1.dataSource = arr[0]
                this.panel2.dataSource = arr[0]
            }
            else if(type === 'trend') {
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel1)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                if(!source.length) return
                let arr = source.filter(_ => moment(_.MDATE).format('YYYY') === this.titleBox.year)
                // x轴
                this.echart1.xAxis.data = arr.map(_ => moment(_.MDATE).format('M月'))
                // line
                let keys = this.currentPanel === 'panel1' ? ['MDATE', 'ALL_TRNVR_RATE', 'ALL_AGO_TRNVR_RATE'] : ['MDATE', 'TRNVR_RATE', 'AGO_TRNVR_RATE']
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
                let arr = source.filter(_ => moment(_.MDATE).format('YYYY') === this.titleBox.year)
                this.table.tableData.push(this.table.labelData.map(_ => '/'))
                if(!arr.length) return
                let keys = this.currentPanel === 'panel1' ? ['MDATE', 'TRNVR_TG', 'ALL_TRNVR_RATE', 'all_reach', 'ALL_AGO_TRNVR_RATE', 'all_YOY'] : ['MDATE', 'TRNVR_TG', 'TRNVR_RATE', 'hw_reach', 'AGO_TRNVR_RATE', 'hw_YOY']
                arr.forEach(item => {
                    item.all_YOY = this.handleYOYOrReach('YOY', item.ALL_TRNVR_RATE, item.ALL_AGO_TRNVR_RATE)
                    item.hw_YOY = this.handleYOYOrReach('YOY', item.TRNVR_RATE, item.AGO_TRNVR_RATE)
                    item.all_reach = this.handleYOYOrReach('reach', item.ALL_TRNVR_RATE, item.TRNVR_TG)
                    item.hw_reach = this.handleYOYOrReach('reach', item.TRNVR_RATE, item.TRNVR_TG)
                })
                arr.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                arr = arr.map(item => {
                    let isAfter = moment(item.MDATE).format('x') > moment().format('x')
                    return keys.map(key => {
                        if(key === 'MDATE') return moment(item[key]).format('M月')
                        if(isAfter && !['TRNVR_TG', 'ALL_AGO_TRNVR_RATE', 'AGO_TRNVR_RATE'].includes(key)) return null
                        return item[key]
                    })
                })
                this.table.tableData = arr.concat()
            }
        },
        
    }
}
</script>

<style lang='scss' scoped>
@import '../../assets/styles.scss';
.Comp11{
    flex: 1;
    position: relative;
    padding: 10px 20px;
    height: 100%;
    .panels{
        display: flex;
        align-items: center;
        height: auto;
        width: 500px;
        .active{
            background: rgba(0, 0, 0, 0.03);
        }
        /deep/ .Panel{
            padding: 5px 10px;
            &:hover{
                background: rgba(0, 0, 0, 0.03);
            }
            &:nth-child(1){
                width: 200px;
            }
            &:nth-child(2){
                width: 300px;
                .column:nth-child(odd){
                    width: 90px;
                    flex: none;
                }
                .row:nth-child(1){
                    .column{
                        flex: 1;
                    }
                }
            }
            .row{
                margin-top: 10px;
            }
            .row:nth-child(1){
                margin-top: 0;
            }
        }
    }
    .footer{
        // flex: 1;
        //height: 200px;
        //display: flex;
        //.right{
            // flex: 3;
            //width: calc(67% - 20.5px);
            position: relative;
            .table{
                margin: 0px 0 10px;
                width: 100%;
                // height: 80%;
                /deep/ .row{
                    font-size: 12px;
                    line-height: 25px;
                    height: 25px;
                }
            }
        //}
    }
}
</style>