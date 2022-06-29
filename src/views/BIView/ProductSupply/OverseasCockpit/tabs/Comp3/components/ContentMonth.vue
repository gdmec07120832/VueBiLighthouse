<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 14:54:55
 * @LastEditTime: 2022-02-28 18:17:00
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp3\components\ContentMonth.vue
-->
<template>
    <div class="ContentMonth">
        <!-- <v-tabs :value.sync="currentTab" :tabs="TabArr" class="tabs"/> -->
        <div class="text-xs" style="font-weight: bold">{{currentTab}}趋势</div>
<!--        <div style="display: flex; justify-content: space-between">-->
<!--            <div style="line-height: 24px">访客月概览</div>-->
<!--            <a-radio-group v-model="currentTab" size="small">-->
<!--                <a-radio-button :value="item" v-for="(item,index) in TabArr" :key="index">-->
<!--                {{item}}-->
<!--                </a-radio-button>-->
<!--            </a-radio-group>-->
<!--        </div>-->
        <div class="content" v-if="currentTab !== '人员销售转化率'">
            <v-chart v-if="currentTab === '访客转化率'" ref="doubleLine"  style="height: calc(100% - 180px);overflow: visible;margin-bottom: 20px" class="chart3" :options="doubleLine" autoresize></v-chart>
            <v-chart v-else ref="echart1" style="height: calc(100% - 220px);overflow: visible;margin-bottom: 20px" class="chart3" :options="echart1" autoresize></v-chart>
            <Table class="table" v-bind="table"/>
        </div>
        <div class="content" style="position: relative;height: calc(100% - 52px);max-height: calc(100% - 52px)" v-else>
            <virtual-select style="width: 150px;z-index: 2;margin-right: 0;position: absolute;right: 0;top: 0"
                v-model="people"
                :options="peopleArr.map((_) => ({ label: _ }))"
                label="人员"
            ></virtual-select>
            <v-chart ref="echart2" style="height: calc(100% - 251px);overflow: visible" class="chart3" :options="echart2" autoresize></v-chart>
            <!-- style="height: 251px;min-height: 251px" -->
            <y-table
            class="text-black"
            @change="handleChange"
            :options="{ ...table2, columns: tableColumns, rowClassName: (record,index) => {return index === 0 ? 'blod grey' : index % 2 === 0 ? 'grey' : ''}}"
            :rowKey="row => row.STAFF_NAME + row.MDATE"
            :loading="table.loading"
            ></y-table>
        </div>
    </div>
</template>

<script>
// import VTabs from '@/views/BIView/components/VTabs/VTabs'
import _ from 'lodash'
import Table from '../../../components/Table.vue'
import YTable from '@/views/BIView/components/YTable/YTable2'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import moment from 'moment'
import base from '../../../utils/base.js'
export default {
    mixins: [ base ],
    props: {
        dateV2: {
            type: Object
        },
        currentTab: {
            type: String
        },
    },
    components: {
        // VTabs,
        Table,
        YTable,
        VirtualSelect
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel)
        this.echart2 = _.cloneDeep(this.echartModel2)
        this.getData()
    },
    beforeDestroy() {
        this.echart1 = null
        this.echart2 = null
    },
    watch: {
        people: {
            handler() {
                this.handleData(3, this.currentData1)
            }
        },
        currentTab: {
            handler(val,oval) {
                if(oval === '人员销售转化率' && val !== '人员销售转化率') {
                    this.getData()
                }else if(oval !== '人员销售转化率' && val === '人员销售转化率') {
                    this.getPeople()
                }else if(oval !== '人员销售转化率' && val !== '人员销售转化率') {
                    this.handleData(1, this.currentData)
                }
            }
        },
        // 'dateV2.month2': {
        //     handler() {
        //         if(this.currentTab !== '人员销售转化率') {
        //             this.getData()
        //         }else {
        //             this.getPeople()
        //         }
        //     }
        // },
        month: {
            handler() {
                if(this.currentTab !== '人员销售转化率') {
                    this.getData()
                }else {
                    this.getPeople()
                }
            }
        },
        'table2.pagination.page': {
            handler() {
                this.handleData(2, this.currentData1)
            }
        },
    },
    computed: {
        tableColumns() {
            return [
                { title: '统计日期', dataIndex: 'MDATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{text}</div>
                    }
                },
                { title: '人员', dataIndex: 'STAFF_NAME', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{text}</div>
                    }
                },
                { title: '访客目标', dataIndex: 'PTD_VISITOR_TGT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handlerNum(1, text)}</div>
                    }
                },
                { title: '访客量', dataIndex: 'PTD_VISITOR_CNT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handlerNum(1,text)}</div>
                    }
                },
                { title: '访客达成', dataIndex: 'PTD_VISITOR_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handlerNum(2, text)}</div>
                    }
                },
                { title: '访客量差值', dataIndex: 'PTD_VISITOR_DIFF', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handlerNum(1,text)}</div>
                    }
                },
                { title: '上期访问量', dataIndex: 'LAST_VISITOR_CNT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handlerNum(1, text)}</div>
                    }
                },
                { title: '访客量环比', dataIndex: 'LAST_VISITOR_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text} style={[{color: this.computeColor(0, text)}]}>{this.handlerNum(2, text)}</div>
                    }
                },
                { title: '支付转化率', dataIndex: 'PTD_PAY_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handlerNum(2, text)}</div>
                    }
                },
                { title: '支付转化率环比', dataIndex: 'LAST_PAY_RATE_TOT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text} style={[{color: this.computeColor(1, text)}]}>{this.handlerNum(2, text)}</div>
                    }
                },
            ]
        },
        month() {
            return this.dateV2.month1 + this.dateV2.month2
        }
    },
    data() {
        let that = this
        return {
            // TabArr: ['访客量','销量','销售转化率','人员销售转化率'],
            TabArr: ['访客量','销量','访客转化率'],
            // currentTab: '访客量',
            doubleLine: {
                tooltip: {
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    formatter: function (params) {
                        if(Object.prototype.toString.call(params) === '[object Array]') {
                            let str = `${params[0].axisValue}<br/>`
                            params.forEach((item, index) => {
                                str += `${params[index].marker}${params[index].seriesName}：${that.handleNum('percent_one_dot', params[index].data[1])}<br/>`
                            })
                            return str
                        }else if(Object.prototype.toString.call(params) === '[object Object]') {
                            let str = `${params.axisValue}<br/>${params.marker}${params.seriesName}：${that.handleNum('percent_one_dot', params.data[1])}<br/>`
                            return str
                        }
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ccc'
                },
                // legend: {
                //     top: 0,
                //     left: 'right',
                //     orient: 'horizontal',
                //     align: 'left',
                //     itemWidth: 10,
                //     itemHeight: 4,
                //     // data: ['花费', '支付占比'],
                //     icon: 'rect',
                //     selectedMode: false
                // },
                color: ['#6395f9', '#DFDFDF'],
                grid: {
                    left: 0,
                    right: 0,
                    top: 10,
                    bottom: 10,
                    containLabel: true
                },
                xAxis: {
                    nameTextStyle: {
                        color: 'transparent'
                    },
                    type: 'category',
                    data: [],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                },
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#F0F0F0',
                                type: 'dashed'
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            formatter: (value) => {
                                if(value === 0) return '0%'
                                else return (value * 100).toFixed(0) + '%'
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
                        name: '访客转化率',
                        data: [0],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        z: 2,
                    },
                    {
                        name: '同期转化率',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        z: 1
                    }
                ]
            },
            echart1: null,
            echartModel: {
                color: ['#6395f9', '#DFDFDF'],
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
                            if(['访客转化率', '同期转化率'].includes(item.seriesName)) formatStr = 'percent_one_dot'
                            else if(['访客量', '销量'].includes(item.seriesName)) formatStr = 'round'
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
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: '0%',
                    top: '9%',
                    containLabel: true
                },
                xAxis: [
                    {
                        name: '统计月份',
                        type: 'category',
                        // 月份
                        data: [],
                        axisTick: {
                            show: false,
                            alignWithLabel: true
                        },
                        axisLine: {
                            show: false,
                        },
                        nameTextStyle: {
                            color: 'transparent'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#f7f7f7'
                            }
                        },
                        axisLabel: {
                            formatter: (val) => {
                                return that.currentTab !== '访客转化率' ? that.handleNum('round', val) : that.handleNum('percent', val)
                            }
                        }
                    },
                    {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#f7f7f7'
                            }
                        },
                        axisLabel: {
                            formatter: (val) => {
                                return that.handleNum('percent_one_dot', val)
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '访客转化率',
                        type: 'bar',
                        barWidth: 20,
                        data: [],
                        itemStyle: {
                            barBorderRadius: [10, 10, 0, 0]
                        },
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 2,
                        yAxisIndex: 0,
                    },
                    // {
                    //     name: '',
                    //     type: 'line',
                    //     barWidth: '20',
                    //     data: [],
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
                    //         color: '#f3f5f9'
                    //     },
                    //     itemStyle:{
                    //         color: '#f3f5f9',
                    //     },
                    //     symbol: 'none',
                    //     z: 1,
                    //     yAxisIndex: 1,
                    // },
                    {
                        name: '同期转化率',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        z: 1,
                        yAxisIndex: 0,
                    }
                ]
            },
            echart2: null,
            // 123
            table: {
                type: 2,
                index: '访客转化率_月度_访客转化率',
                labelData: ['统计年月', '访客目标', '访客量', '完成率'],
                tableData: []
            },
            // 4
            table2: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 4
                },
                data: [],
                needPaging: true
            },
            currentData: [],
            currentData1: [],
            people: [],
            peopleArr: []
        }
    },
    methods: {
        computeColor(p, value) {
            // 访客量环比
            if(p === 0) {
                if(value > 0) return '#ff5953'
                else if(value < 0) return '#00a854'
            }else if(p === 1) {
                // 销售转化率环比
                if(value > 0) return '#ff5953'
                else if(value < 0) return '#00a854'
            }
        },
        handleChange() {
            
        },
        // tab123
        async getData() {
            this.currentData = []
            let query = {
                // YDATE: this.dateV2.month2
                START_TIME: this.dateV2.month2 + '01',
                END_TIME: this.dateV2.month2 + '12'
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_visitor_anal_m',query)
            this.currentData = res.data.concat()
            this.handleData(1,res.data)
        },
        // tab4 
        async getPeople() {
            let query = {
                // YDATE: this.dateV2.month2
                START_TIME: this.dateV2.month1,
                END_TIME: this.dateV2.month2
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_visitor_anal_stf_m',query)
            res.data.sort((a, b) => {
                return moment(a.MDATE).toDate().getTime() - moment(b.MDATE).toDate().getTime()
            })
            this.peopleArr = Object.freeze(Array.from(new Set(res.data.filter(_ => _.STAFF_NAME !== '合计').map(_ => _.STAFF_NAME))))
            this.currentData1 = res.data
            this.handleData(2, this.currentData1)
            this.handleData(3, this.currentData1)
        },
        // 1处理tab123 和echart1  2处理table2  3处理echart
        handleData(type, source) {
            if(type === 1) {
                let arr = source.filter(_ => _.TDATE !== '合计')
                arr.sort((a, b) => a.MDATE - b.MDATE)
                let sum = source.filter(_ => _.TDATE === '合计')
                if(sum.length){
                    sum[0].PTD_PAY_RATE_TGT = null
                    arr.unshift(sum[0])
                }
                sum.forEach(item => {
                    item.VISITOR_YOY = this.handleYOYOrReach('YOY', item.PTD_VISITOR_CNT, item.AGO_VISITOR_CNT)
                    item.SALES_YOY = this.handleYOYOrReach('YOY', item.PTD_SALES_AMT, item.AGO_SALES_AMT)
                })
                arr.forEach(item => {
                    item.VISITOR_YOY = this.handleYOYOrReach('YOY', item.PTD_VISITOR_CNT, item.AGO_VISITOR_CNT)
                    item.SALES_YOY = this.handleYOYOrReach('YOY', item.PTD_SALES_AMT, item.AGO_SALES_AMT)
                })
                let obj = {
                    访客量: {
                        labelData: ['统计年月', '访客量目标', '访客量', '达成率', '访客量同比'],
                        keys: ['TDATE', 'PTD_VISITOR_TGT', 'PTD_VISITOR_CNT', 'PTD_VISITOR_RATE', 'VISITOR_YOY']
                    },
                    销量: {
                        labelData: ['统计年月', '销量目标', '销量', '达成率', '销量同比'],
                        keys: ['TDATE', 'PTD_SALES_TGT', 'PTD_SALES_AMT', 'PTD_SALES_RATE', 'SALES_YOY']
                    },
                    访客转化率: {
                        labelData: ['日期', '转化率目标', '转化率', '同期转化率'],
                        keys: ['TDATE', 'PTD_PAY_RATE_TGT', 'PTD_PAY_RATE', 'AGO_PAY_RATE']
                    }
                }
                if(this.currentTab === '访客转化率') {
                    this.table.index = '访客转化率_月度_访客转化率'
                }
                else if(this.currentTab === '访客量') {
                    this.table.index = '访客转化率_月度_访客量'
                }
                else if(this.currentTab === '销量') {
                    this.table.index = '访客转化率_月度_销量'
                }

                this.table.labelData = obj[this.currentTab].labelData
                this.table.tableData = arr.map(item => {
                    let isAfter = moment(item.TDATE.replace(/-/g, '')).format('x') > moment().format('x') ? true : false
                    let isAfter1 = moment(item.TDATE.replace(/-/g, '')).format('YYYY') - 1 > moment().format('YYYY') ? true : false
                    return obj[this.currentTab].keys.map(key => {
                        if(item.TDATE === '合计') return item[key]
                        if(key === 'TDATE') return moment(item[key].replace(/-/g, '')).format('M月')
                        if(key === 'AGO_PAY_RATE') return !isAfter1 ? item[key] : null
                        return !isAfter ? item[key] : null
                    })
                })
                /* 处理echart */
                // 清空数据
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.$refs?.doubleLine?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel)
                this.echart1.xAxis[0].data = []
                this.echart1.series[0].data = []
                // 处理x轴
                this.doubleLine.xAxis.data = Array.from(new Set(arr.filter(_ => _.TDATE !== '合计').map(_ => moment(_.MDATE + '01').format('M月'))))
                this.echart1.xAxis[0].data = Array.from(new Set(arr.filter(_ => _.TDATE !== '合计').map(_ => moment(_.MDATE + '01').format('M月'))))
                let obj1 = {
                    访客转化率: {
                        keys: ['MDATE', 'PTD_PAY_RATE', 'AGO_PAY_RATE']
                    },
                    访客量: {
                        keys: ['MDATE', 'PTD_VISITOR_CNT', 'PTD_PAY_RATE']
                    },
                    销量: {
                        keys: ['MDATE', 'PTD_SALES_AMT', 'PTD_PAY_RATE']
                    },
                }
                if(this.currentTab === '访客转化率') {
                    this.doubleLine.series[0].name = '访客转化率'
                    this.doubleLine.series[1].name = '同期转化率'
                    this.doubleLine.series[1].yAxisIndex = 0

                }
                else if(this.currentTab === '访客量') {
                    this.echart1.series[0].name = '访客量'
                    this.echart1.series[1].name = '访客转化率'
                    this.echart1.series[1].yAxisIndex = 1
                }
                else if(this.currentTab === '销量') {
                    this.echart1.series[0].name = '销量'
                    this.echart1.series[1].name = '访客转化率'
                    this.echart1.series[1].yAxisIndex = 1
                }
                this.echart1.series[0].data = arr.filter(_ => _.TDATE !== '合计').map((item, index) => {
                    let isAfter = item.MDATE > moment().format('YYYYMM')
                    if(isAfter) return 'null' + index
                    return obj1[this.currentTab].keys.map((key, index) => {
                        if(key === 'MDATE') return moment(item[key] + '01').format('M月')
                        return item[key]
                    })
                })
                this.echart1.series[1].data = arr.filter(_ => _.TDATE !== '合计').map((item, index) => {
                    let isAfter = item.MDATE > moment().format('YYYYMM')
                    if(isAfter) return 'null' + index
                    let keys = obj1[this.currentTab].keys
                    return [
                        moment(item[keys[0]] + '01').format('M月'),
                        item[keys[2]],
                    ]
                })
                this.doubleLine.series[0].data = arr.filter(_ => _.TDATE !== '合计').map((item, index) => {
                    let isAfter = item.MDATE > moment().format('YYYYMM')
                    if(isAfter) return 'null' + index
                    return obj1[this.currentTab].keys.map((key, index) => {
                        if(key === 'MDATE') return moment(item[key] + '01').format('M月')
                        return item[key]
                    })
                })
                this.doubleLine.series[1].data = arr.filter(_ => _.TDATE !== '合计').map((item, index) => {
                    let isAfter = item.MDATE - 100 > moment().format('YYYYMM')
                    if(isAfter) return 'null' + index
                    let keys = obj1[this.currentTab].keys
                    return [
                        moment(item[keys[0]] + '01').format('M月'),
                        item[keys[2]],
                    ]
                })

            }
            else if(type === 2) {
                if(source.length) {
                    let index = -1
                    let arr = source.concat()
                    arr.forEach((item,index1) => {
                        if(item.STAFF_NAME === '合计') index = index1
                    })
                    if(index > -1){
                        arr[index].MDATE = '合计'
                        arr[index].STAFF_NAME = '--'
                    }
                    // let sum = source.filter(_ => _.STAFF_NAME === '合计')
                    // if(sum.length) {
                    //     sum[0].MDATE = '合计'
                    //     sum[0].STAFF_NAME = '--'
                    // }
                    this.table2.pagination.total = arr.length
                    if(index > -1) arr.unshift(arr.splice(index, 1)[0])
                    this.handlerPage(this.table2, arr)
                    // this.table2.data = arr.concat()
                }else {
                    this.table2.pagination.total = 0
                    this.table2.data = []
                }
            }
            else if(type === 3) {
                this.$refs?.echart2?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel)
                // 处理数据
                let arr
                if(!this.people.length) arr = source.concat()
                else arr = source.filter(_ => this.people.indexOf(_.STAFF_NAME) > -1)
                arr = arr.filter(_ => _.MDATE !== '合计')
                let obj = {}
                let newArr = []
                let i = 0
                arr.forEach(item => {
                    if(!Object.prototype.hasOwnProperty.call(obj, item.STAFF_NAME)) {
                        obj[item.STAFF_NAME] = i
                        newArr.push([])
                        i++
                    }
                    newArr[obj[item.STAFF_NAME]].push(item)
                })
                newArr.forEach(item => {
                    item.sort((a, b) => a.MDATE.split('-')[1] - b.MDATE.split('-')[1])
                })
                this.echart2.series = []
                newArr.forEach((item, index) => {
                    this.echart2.series[index] = {
                        name: item[0].STAFF_NAME,
                        data: item.map(_ => [_.MDATE, _.PTD_PAY_RATE]),
                        type: 'line',
                        smooth: true
                    }
                })
                // x轴
                let arr1 = source.concat()
                arr1 = arr1.filter(_ => _.MDATE !== '合计')
                this.echart2.xAxis.data = []
                this.echart2.xAxis.data = Array.from(new Set(arr1.map(_ => _.MDATE))).sort((a, b) => a.split('-')[1] - b.split('-')[1])
            }
        },
        // table分页赋值操作
        handlerPage(table,source) {
            let page = table.pagination.page
            let pageSize = table.pagination.pageSize
            table.data = []
            table.data = source.slice((page - 1) * pageSize, page * pageSize).concat()
        },
        // 数值处理 type 1为取整加千分 2为百分比两位小数
        handlerNum(type, value, removeZero = false) {
            if(removeZero && value === 0) return '--'
            let arr = [
                () => {
                    return parseInt(value).toLocaleString()
                },
                () => {
                    return (value * 100).toFixed(2) + '%'
                }
            ]
            return arr[type - 1]()
        }
    }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/styles/common.scss';
.ContentMonth{
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-end;
    .tabs{
        height: 32px;
        /deep/ .active{
            color: $theme !important;
            &:before{
                background: $theme !important;
            }
        }
    }
    .content{
        // flex: 1;
        height: calc(100% - 18px);
        // .table{
        //     /deep/ .row{
        //         font-size: 14px;
        //         line-height: 45px;
        //         height: 45px;
        //     }
        // }
        .table{
            /deep/ .row{
                line-height: 40px;
                height: 40px;
            }
        }
        .text-black{
            /deep/ .ant-empty-normal{
                margin: 25px 0
            }
        }
    }
}
</style>