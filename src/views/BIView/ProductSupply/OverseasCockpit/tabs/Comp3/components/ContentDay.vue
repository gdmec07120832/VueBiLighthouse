<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 13:43:03
 * @LastEditTime: 2022-02-28 18:15:40
 * @LastEditors: Please set LastEditors
 * @Descripttion: 访客分析的content
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp3\components\ContentDay.vue
-->
<template>
    <div class="ContentDay" v-if="currentTab !== '人员销售转化率'">
        <div class="text-xs" style="font-weight: bold">{{currentTab}}趋势</div>
        <div class="header" :style="{height: this.currentTab === '访客转化率' ? 'calc(100% - 173px)' : 'calc(100% - 218px)'}">
            <!-- <div>{{title}}</div> -->
            <v-chart ref="echart1" style="flex: 1;overflow: visible" class="chart3" :options="echart1" autoresize></v-chart>
        </div>
        <div class="table">
            <Table v-bind="table"/>
            <Table v-bind="table1" class="mt10"/>
        </div>
    </div>
    <div class="ContentDay" v-else style="height: calc(100% - 134px)">
        <div class="header" style="height: calc(100% - 223px)">
            <div style="display: flex;justify-content: space-between">{{title}}
                <virtual-select style="width: 150px;z-index: 2;margin-right: 0"
                    v-model="people"
                    :options="peopleArr.map((_) => ({ label: _ }))"
                    label="人员"
                ></virtual-select>
            </div>
            <v-chart ref="echart2" style="overflow: visible;height: calc(100% - 52px)" class="chart3" :options="echart2" autoresize></v-chart>
        </div>
        <div class="table" style="max-height: 223px;min-height: 223px">
            <y-table
            class="text-black"
            @change="handleChange"
            :options="{ ...table2, columns: tableColumns, rowClassName: (record,index) => {return index === 0 ? 'blod gery': index % 2 === 0 ? 'gery' : ''}}"
            :rowKey="(row) => {return row.STAFF_NAME + row.TDATE}"
            :loading="table.loading"
            ></y-table>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import Table from '../../../components/Table.vue'
import YTable from '@/views/BIView/components/YTable/YTable2'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import base from '../../../utils/base.js'
import moment from 'moment'
export default {
    mixins: [ base ],
    components: {
        Table,
        YTable,
        VirtualSelect,
    },
    computed: {
        title() {
           let titleArr = ['访客量趋势', '销量趋势', '访客转化率趋势', '人员访客转化率趋势']
           return titleArr[this.currentIndex]
        },
        currentIndex() {
            return this.TabArr.indexOf(this.currentTab)
        },
        // tableColumns() {
        //     return [
        //         { title: '统计日期', dataIndex: 'TDATE', width: 100, ellipsis: true, sorter: false,
        //             customRender: (text) => {
        //                 return <div title={text}>{text}</div>
        //             }
        //         },
        //         { title: '人员', dataIndex: 'STAFF_NAME', width: 100, ellipsis: true, sorter: false,
        //             customRender: (text) => {
        //                 return <div title={text}>{text}</div>
        //             }
        //         },
        //         { title: '访客目标', dataIndex: 'PTD_VISITOR_TGT', width: 100, ellipsis: true, sorter: false,
        //             customRender: (text) => {
        //                 return <div title={text}>{text}</div>
        //             }
        //         },
        //         { title: '访客量', dataIndex: 'PTD_VISITOR_CNT', width: 100, ellipsis: true, sorter: false,
        //             customRender: (text) => {
        //                 return <div title={text}>{this.handlerNum(1, text)}</div>
        //             }
        //         },
        //         { title: '访客达成', dataIndex: 'PTD_VISITOR_RATE', width: 100, ellipsis: true, sorter: false,
        //             customRender: (text) => {
        //                 return <div title={text}>{text}</div>
        //             }
        //         },
        //         { title: '访客量差值', dataIndex: 'PTD_VISITOR_DIFF', width: 100, ellipsis: true, sorter: false,
        //             customRender: (text) => {
        //                 return <div title={text}>{this.handlerNum(1, text)}</div>
        //             }
        //         },
        //         { title: '上期访问量', dataIndex: 'LAST_VISITOR_CNT', width: 100, ellipsis: true, sorter: false,
        //             customRender: (text) => {
        //                 return <div title={text}>{this.handlerNum(1, text)}</div>
        //             }
        //         },
        //         { title: '访客量环比', dataIndex: 'LAST_VISITOR_RATE', width: 100, ellipsis: true, sorter: false,
        //             customRender: (text) => {
        //                 return <div title={text} style={[{color: this.computeColor(0, text)}]}>{this.handlerNum(2, text)}</div>
        //             }
        //         },
        //         { title: '销售转化率', dataIndex: 'PTD_PAY_RATE', width: 100, ellipsis: true, sorter: false,
        //             customRender: (text) => {
        //                 return <div title={text}>{this.handlerNum(2, text)}</div>
        //             }
        //         },
        //         { title: '销售转化率环比', dataIndex: 'LAST_PAY_RATE_TOT', width: 100, ellipsis: true, sorter: false,
        //             customRender: (text) => {
        //                 return <div title={text} style={[{color: this.computeColor(1, text)}]}>{this.handlerNum(2, text)}</div>
        //             }
        //         },
        //     ]
        // }
    },
    watch: {
        'dateV2.day2': {
            handler() {
                if(this.currentTab !== '人员销售转化率'){
                    this.getData()
                }else {
                    this.getPeopleData()
                    this.getPeopleArr()
                }
            }
        },
        currentTab: {
            handler(val) {
                if(val !== '人员销售转化率') {
                    this.handlerData(1, this.currentData)
                }else{
                    if(!this.currentData1.length){
                        this.getPeopleData()
                        this.getPeopleArr()
                    }else {
                        this.handlerData(2, this.currentData1)
                        this.handlerData(3, this.currentData1)
                    }
                }
            }
        },
        'table2.pagination.page': {
            handler() {
                this.handlerPage(this.table2, this.table2Data)
            }
        },
        people: {
            handler(val, oval) {
                if(val.length > 0){
                    let arr = this.currentData1.filter(_ => {
                        return val.indexOf(_.STAFF_NAME) > -1
                    })
                    this.handlerData(3,arr)
                }else this.handlerData(3, this.currentData1)
            }
        }
    },
    props: {
        currentTab: {
            type: String
        },
        TabArr: {
            type: Array
        },
        dateV2: {
            type: Object
        }
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
    data() {
        let that = this
        return {
            echartModel: {
                tooltip: {
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    // formatter: function(params) {
                    //     let str = `统计日期：${params[0].data[4]}<br/>`
                    //     if(that.currentTab === '访客量'){
                    //         str += `访客目标：${that.handlerNum(1, params[0].data[2], true)}<br/>访客量：${that.handlerNum(1, params[0].data[1], true)}<br/>差值：${that.handlerNum(1, params[0].data[3])}`
                    //     }else if(that.currentTab === '销量') {
                    //         str += `销量：${that.handlerNum(1, params[0].data[1], true)}<br/>目标：${that.handlerNum(1, params[0].data[2], true)}<br/>差值：${that.handlerNum(1, params[0].data[3])}`
                    //     }else if(that.currentTab === '访客转化率'){
                    //         str += `访客转化率：${that.handlerNum(2, params[0].data[1], true)}<br/>目标：${that.handlerNum(2, params[0].data[2], true)}<br/>差值：${that.handlerNum(2, params[0].data[3], true)}`
                    //     }
                    //     return str
                    // },
                    formatter: function (params) {
                        let flag = moment(params[0].axisValue).format('x') > moment().format('x')
                        if(!params.length) return ''
                        let str = `${moment(params[0].axisValue).format('D日')}<br/>`
                        let formatStr = 'normal'
                        if(['访客转化率'].includes(params[0].seriesName)) formatStr = 'percent_one_dot'
                        else if(['访客量', '销量'].includes(params[0].seriesName)) formatStr = 'round'
                        for(let i = params.length - 1; i >= 0; i --){
                            let item = params[i]
                            str += `${item.marker}${item.seriesName}：${flag ? '--' : that.handleNum(formatStr, item.data[1])}<br/>`
                        }
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
                        name: '统计日期',
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
                        axisLabel: {
                            formatter: function(val){
                                return moment(val).format('D日')
                            }
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
                                return that.currentTab !== '访客转化率' ? that.handleNum(1, val) : that.handleNum(2, val)
                            },
                        }
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'bar',
                        barWidth: 20,
                        // data: [10, 52, 200, 334, 390, 330, 220,10, 52, 200, 334, 390, 330, 220],
                        data: [
                            // [1,10,20,30],
                            // [1,10,20,30],
                        ],
                        itemStyle: {
                            color: function(params) {
                                // let color = ['#ff5953', '#00a854']
                                // if(that.currentTab === '访客量') {
                                //     if(params.data[3] <= 0) return color[0]
                                //     else return color[1]
                                // }else if(that.currentTab === '销量') {
                                //     if(params.data[3] <= 0) return color[0]
                                //     else return color[1]
                                // }else if(that.currentTab === '销售转化率') {
                                //     if(params.data[3] <= 0) return color[0]
                                //     else return color[1]
                                // }
                                let color = ['#ff5953', '#00a854', '#5b8ff9']
                                // if(that.currentTab === '访客量') {
                                //     if(params.data[2] === 0 || params.data[2] === null) return color[2]
                                //     if(params.data[3] <= 0) return color[0]
                                //     else return color[1]
                                // }else if(that.currentTab === '销量') {
                                //     if(params.data[2] === 0 || params.data[2] === null) return color[2]
                                //     if(params.data[3] <= 0) return color[0]
                                //     else return color[1]
                                // }else if(that.currentTab === '访客转化率') {
                                //     if(params.data[2] === 0 || params.data[2] === null) return color[2]
                                //     if(params.data[3] > 0) return color[0]
                                //     else if(params.data[3] < 0) return color[1]
                                //     else if(params.data[3] == 0) return color[2]
                                // }
                                if(that.handleYOYOrReach('diff', params.data[1], params.data[2]) > 0) return color[0]
                                else if(that.handleYOYOrReach('diff', params.data[1], params.data[2]) < 0) return color[1]
                                else return color[2]
                            },
                            barBorderRadius: [10, 10, 0, 0]
                        },
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 2
                    },
                    {
                        name: '',
                        data: [],
                        type: 'line',
                        smooth: true,
                        color: '#DFDFDF',
                        z: 1,
                    },
                ]
            },
            // echartModel2: {
            //     color: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#D47F00', '#00FFFF', '#D4FF55', '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#7FBF55','#a5c2d5', '#cbab4f', '#76a871', '#a56f8f', '#c12c44', '#9f7961', '#76a871', '#6f83a5', '0f4fb8', '106dcf', '#b3d74c', '#74aae3', '#5cdec6', '#3526de', '#9d65ee', '#a8b3e3', '#6bc1b7', '549ee2', '#6e98d6'],
            //     tooltip: {
            //         trigger: 'item',
            //         axisPointer: {
            //             type: 'none'
            //         },
            //         formatter: function(params) {
            //             let str = `统计日期：${params.data[3]}<br/>人员：${params.data[2]}<br/>转化率：${that.handlerNum(2, params.data[1])}<br/>`
            //             return str
            //         },
            //         backgroundColor: '#fff',
            //         textStyle: {
            //             color: 'rgba(0,0,0,0.65)',
            //             fontSize: 12
            //         },
            //         borderWidth: 1,
            //         borderColor: '#ccc'
            //     },
            //     legend: {
            //         top: '0%',
            //         // left: 'right',
            //         right: '0%',
            //         orient: 'vertical',
            //         align: 'left',
            //         itemWidth: 13,
            //         itemHeight: 13,
            //         icon: 'rect',
            //         type: 'scroll'
            //         // data: ['name1','name2'],
            //         // itemStyle: {
            //         //     color: ''
            //         // }
            //     },
            //     // color: ['#6dc8ec', '#f6bd16', '#6d88b6', '#2ebfbe', '#5b8ff9'],
            //     grid: {
            //         left: '2%',
            //         right: '5%',
            //         top: '9%',
            //         bottom: '0%',
            //         containLabel: true
            //     },
            //     xAxis: {
            //         type: 'category',
            //         data: ['1','2'],
            //         axisLine: {
            //             show: false
            //         },
            //         axisTick: {
            //             show: false
            //         }
            //     },
            //     yAxis: {
            //         type: 'value',
            //         splitLine: {
            //             show: false,
            //         },
            //         axisLine: {
            //             show: false
            //         },
            //         axisTick: {
            //             show: false
            //         },
            //         axisLabel: {
            //             formatter: (value) => {
            //                 return that.handlerNum(2, value)
            //             }
            //         }
            //         // axisLabel: {
            //         //     formatter: (value) => {
            //         //         return (value * 100).toFixed(0) + '%'
            //         //     }
            //         // }
            //     },
            //     series: [
            //         {
            //             name: '',
            //             data: [],
            //             type: 'line',
            //             smooth: true
            //         },
            //         // {
            //         // name: 'name2',
            //         // data: [30000, 30000, 30000, 30000, 30000, 30000, 30000],
            //         // type: 'line',
            //         // smooth: true
            //         // },
            //     ]
            // },
            // 1~3的图
            echart1: null,
            table: {
                index: '2A',
                type: 2,
                labelData: [],
                tableData: []
            },
            table1: {
                index: '访客转化率_当月_访客转化率',
                type: 2,
                labelData: [],
                tableData: []
            },
            // 4的图
            echart2: null,
            table2: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 4
                },
                data: [],
                needPaging: true,
                // columns: this.tableColumns
            },
            table2Data: [],
            // 1-3
            currentData: [],
            // 4
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
        // 获取1 2 3数据
        async getData() {
            this.currentData = []
            let query = {
                MDATE: this.dateV2.day2
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_visitor_anal_d',query)
            res.data = res.data.map(item => {
                return {
                    ...item,
                    PTD_PAY_DIFF: this.handleYOYOrReach('diff', item.PTD_PAY_RATE, item.PTD_PAY_RATE_TGT)
                }
            })
            this.currentData = res.data.concat()
            this.handlerData(1, this.currentData)
            // let obj1 = {
            //     // 访客量
            //     obj1: {
            //         labelData: ['日期', '访客目标', '访客量', '日完成率'],
            //         tableData: [],
            //         keys: ['TDATE_DAY', 'PTD_VISITOR_TGT', 'PTD_VISITOR_CNT', 'PTD_VISITOR_RATE']
            //     },
            //     // 销量
            //     obj2: {
            //         labelData: ['日期', '目标', '销量', '日完成率'],
            //         tableData: [],
            //         keys: ['TDATE_DAY', 'PTD_SALES_TGT', 'PTD_SALES_AMT', 'PTD_SALES_RATE']
            //     },
            //     // 销售转化率
            //     obj3: {
            //         labelData: ['日期', '目标', '销售转化率', '差值'],
            //         tableData: [],
            //         keys: ['TDATE_DAY', 'PTD_PAY_RATE_TGT', 'PTD_PAY_RATE', 'PTD_PAY_DIFF']
            //     }
            // }
            // let obj = {
            //     访客量: 1,
            //     销量: 2,
            //     销售转化率: 3,
            // }
            // res.data.sort((a, b) => {
            //     return a.TDATE_DAY - b.TDATE_DAY
            // })
            // this.table.labelData = obj1['obj' + obj[this.currentTab]].labelData.concat()
            // this.table1.labelData = obj1['obj' + obj[this.currentTab]].labelData.concat()
            // if(this.currentTab === '访客量') {
            //     this.table.index = '2A'
            //     this.table1.index = '2A'
            // }else if(this.currentTab === '销量') {
            //     this.table.index = '2B'
            //     this.table1.index = '2B'
            // }else if(this.currentTab === '销售转化率') {
            //     this.table.index = '2C'
            //     this.table1.index = '2C'
            // }
            // // 清空
            // this.table.tableData = []
            // this.table1.tableData = []
            // for(let i = 0; i < 16; i++) {
            //     this.table.tableData.push(['--', '--', '--', '--'])
            //     this.table1.tableData.push(['--', '--', '--', '--'])
            // }
            // // 赋值
            // res.data.slice(0,16).forEach((item, index) => {
            //     this.table.tableData[index] = obj1['obj' + obj[this.currentTab]].keys.map(key => {
            //         return item[key]
            //     })
            // })
            // res.data.slice(16, res.data.length + 1).forEach((item, index) => {
            //     this.table1.tableData[index] = obj1['obj' + obj[this.currentTab]].keys.map(key => {
            //         return item[key]
            //     })
            // })
            // // 不足16进行补充
            // if(this.table1.tableData.length < 16) {
            //     for(let i = 0; i < 16 - this.table1.tableData.length; i++) {
            //         this.table1.tableData.push(['--', '--', '--', '--'])
            //     }
            // }
        },
        // 处理数据 type 1为 tab1-3  2为tab4 table 3为tab4 echart
        handlerData(type,source) {
            if(type === 1) {
                /* 给table处理数据 */
                let obj1 = {
                    // 访客量
                    obj1: {
                        labelData: ['日期', '访客量目标', '访客量', '达成率'],
                        tableData: [],
                        keys: ['TDATE', 'PTD_VISITOR_TGT', 'PTD_VISITOR_CNT', 'PTD_VISITOR_RATE']
                    },
                    // 销量
                    obj2: {
                        labelData: ['日期', '销量目标', '销量', '达成率'],
                        tableData: [],
                        keys: ['TDATE', 'PTD_SALES_TGT', 'PTD_SALES_AMT', 'PTD_SALES_RATE']
                    },
                    // 销售转化率
                    obj3: {
                        labelData: ['日期', '转化率目标', '转化率'],
                        tableData: [],
                        keys: ['TDATE', 'PTD_PAY_RATE_TGT', 'PTD_PAY_RATE']
                    }
                }
                let obj = {
                    访客量: 1,
                    销量: 2,
                    访客转化率: 3,
                }
                source.sort((a, b) => {
                    return a.TDATE_DAY - b.TDATE_DAY
                })
                this.table.labelData = obj1['obj' + obj[this.currentTab]].labelData.concat()
                this.table1.labelData = obj1['obj' + obj[this.currentTab]].labelData.concat()
                if(this.currentTab === '访客转化率') {
                    this.table.index = '访客转化率_当月_访客转化率'
                    this.table1.index = '访客转化率_当月_访客转化率'
                }
                else if(this.currentTab === '访客量') {
                    this.table.index = '访客转化率_当月_访客量'
                    this.table1.index = '访客转化率_当月_访客量'
                }
                else if(this.currentTab === '销量') {
                    this.table.index = '访客转化率_当月_销量'
                    this.table1.index = '访客转化率_当月_销量'
                }
                // 清空
                this.table.tableData = []
                this.table1.tableData = []
                // 一个月的一半
                let daysInMonth = moment(this.dateV2.day2).format('MM') === '02' ? 15 : 16
                for(let i = 0; i < daysInMonth; i++) {
                    this.table.tableData.push(this.table.labelData.map(_ => '/'))
                    this.table1.tableData.push(this.table.labelData.map(_ => '/'))
                }
                // 赋值
                source.slice(0,daysInMonth).forEach((item, index) => {
                    this.table.tableData[index] = obj1['obj' + obj[this.currentTab]].keys.map(key => {
                        if(key === 'TDATE') return moment(item[key].replace(/-/g, '')).format('D日')
                        return item[key]
                    })
                })
                source.slice(daysInMonth, source.length + 1).forEach((item, index) => {
                    this.table1.tableData[index] = obj1['obj' + obj[this.currentTab]].keys.map(key => {
                        if(key === 'TDATE') return moment(item[key].replace(/-/g, '')).format('D日')
                        return item[key]
                    })
                })
                // 不足16行进行补充
                if(this.table1.tableData.length < daysInMonth) {
                    for(let i = 0; i < daysInMonth - this.table1.tableData.length; i++) {
                        this.table1.tableData.push(this.table.labelData.map(_ => '/'))
                    }
                }
                /* 给echart处理数据 */
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel)
                // 清空数据
                this.echart1.xAxis[0].data = []
                this.echart1.series[0].data = []
                this.echart1.series[0].name = this.currentTab
                this.echart1.series[1].name = '目标'
                // x轴月份
                this.echart1.xAxis[0].data = source.map(item => {
                    return item.TDATE.replace(/-/g, '')
                })
                let obj2 = {
                    '访客量': ['TDATE', 'PTD_VISITOR_CNT', 'PTD_VISITOR_TGT'],
                    '销量': ['TDATE', 'PTD_SALES_AMT', 'PTD_SALES_TGT'],
                    '访客转化率': ['TDATE', 'PTD_PAY_RATE', 'PTD_PAY_RATE_TGT'],
                }
                // data数据
                this.echart1.series[0].data = source.map(item => {
                    return obj2[this.currentTab].map(key => {
                        if(key === 'TDATE') return item[key].replace(/-/g, '')
                        return item[key]
                    })
                })
                this.echart1.series[1].data = source.map(item => {
                    let keys = obj2[this.currentTab]
                    return [
                        item.TDATE.replace(/-/g, ''),
                        item[keys[2]]
                    ]
                })
            }
            else if(type === 2) {
                /* 处理table数据 */
                // 取出合计放在每一行行头
                if(source.length > 0) {
                    let sum = source.filter(_ => _.STAFF_NAME === '合计')
                    if(sum.length) {
                        sum.STAFF_NAME = '--'
                        sum.TDATE = '合计'
                    }
                    source = source.filter(_ => _.STAFF_NAME !== '合计')
                    let pageSize = this.table2.pagination.pageSize
                    let num = Math.ceil(source.length / (pageSize - 1))
                    let arr = source.concat()
                    for(let i = 0; i < num; i++) {
                        arr.splice(i * pageSize, 0, sum[0])                    
                    }
                    this.table2.needPaging = true
                    this.table2Data = arr.concat()
                    this.table2.pagination.total = arr.length
                    this.handlerPage(this.table2, this.table2Data)
                }else {
                    this.table2Data = []
                    this.table2.pagination.total = source.length
                    this.table2.needPaging = false
                    this.table2.data = []
                }
            }
            else if(type === 3) {
                /* 处理echart */
                // 清空数据
                this.$refs?.echart2?.$refs?.echarts?.clear()
                this.echart2 = _.cloneDeep(this.echartModel2)
                this.echart2.xAxis.data = []
                this.echart2.series = [
                    {
                        name: '',
                        data: [],
                        type: 'line',
                        smooth: true
                    }
                ]
                if(source.length) {
                    let source1 = source.filter(_ => _.STAFF_NAME !== '合计')
                    let obj = {}
                    source1.forEach(item => {
                        if(!Object.prototype.hasOwnProperty.call(obj, item.STAFF_NAME)) {
                            obj[item.STAFF_NAME] = []
                        }
                        obj[item.STAFF_NAME].push(item)
                    })
                    delete obj['--']
                    // 排序
                    for(let key in obj) {
                        obj[key].sort((a,b) => {
                            return a.TDATE.split('-')[2] - b.TDATE.split('-')[2]
                        })
                    }
                    // x轴赋值
                    this.echart2.xAxis.data = Array.from(new Set(source1.map(_ => _.TDATE.split('-')[2])))
                    this.echart2.xAxis.data.sort((a,b) => {
                        return a - b
                    })
                    this.echart2.xAxis.data = this.echart2.xAxis.data.filter(item => {
                        return item !== undefined
                    })
                    // 赋值
                    let arr = []
                    for(let key in obj) {
                        arr.push(obj[key].map(item => {
                            return [
                                item.TDATE.split('-')[2],
                                item.PTD_PAY_RATE,
                                item.STAFF_NAME,
                                item.TDATE
                            ]
                        }))
                    }
                    arr.forEach((item, index) => {
                        this.echart2.series[index] = {
                            name: item[0][2],
                            data: item.concat(),
                            type: 'line',
                            smooth: true
                        }
                    })
                }
            }
        },
        // 获取4 数据
        async getPeopleData() {
            let query = {
                MDATE: this.dateV2.day2
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_visitor_anal_stf_d',query)
            this.currentData1 = res.data.concat()
            this.handlerData(2, this.currentData1)
            this.handlerData(3, this.currentData1)
        },
        // 获取4 人员选项
        async getPeopleArr() {
            let query = {
                MDATE: this.dateV2.day2
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_visitor_anal_stf_d',query)
            this.peopleArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.STAFF_NAME).filter(_ => _ !== '合计'))))
        },
        // table分页赋值操作
        handlerPage(table,source) {
            let page = table.pagination.page
            let pageSize = table.pagination.pageSize
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
.ContentDay{
    //padding: 10px 0 0 0;
    //height: calc(100% - 24px);
    height: 100%;
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-end;
    .header{
        // flex: 1;
        // height: 40%;
        //margin-top: 10px;
        display: flex;
        flex-direction: column;
    }
    .table{
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        /deep/ .ant-empty-normal{
            margin: 18px 0
        }
        /deep/ .blod{
            font-weight: bold;
        }
        /deep/ .gery {
            background: #fafafa;
        }
        /deep/ td {
            line-height: 26px;
        }
        /deep/ .row {
            height: 22.5px;
            line-height: 22.5px;
        }
    }
}
</style>