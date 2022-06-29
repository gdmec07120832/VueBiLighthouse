<!--
 * @Author: 黄浩
 * @Date: 2022-01-19 16:04:49
 * @LastEditTime: 2022-02-17 14:50:46
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp10\components\Day.vue
-->
<template>
    <div class="Day">
        <div class="header">
            <div class="left" style="position: relative">
                <div class="item">
                    <div>退款-当天</div>
                    <div class="panel">
                        <div class="col">
                            <div class="row">退款率</div>
                            <div class="row" @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(0, panel1.v1)}]">{{handleNum(2, panel1.v1)}}</div>
                        </div>
                        <div class="col">
                            <div class="row">目标占比</div>
                            <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(2, panel1.v2)}}</div>
                        </div>
                        <div class="col">
                            <div class="row">本日差值</div>
                            <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(2, panel1.v3)}}</div>
                        </div>
                        <div class="col">
                            <div class="row">退款{{radioModel === 1 ? '金额' : '数量'}}</div>
                            <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(1, panel1.v4)}}</div>
                        </div>
                    </div>
                </div>
                <div style="width: 100%;padding: 10px 5px">
                    <div style="width: 100%;height: 1px;background: #f5f5f5;"></div>
                </div>
                <div class="item">
                    <div>退款-累计本月</div>
                    <div class="panel">
                        <div class="col">
                            <div class="row">退款率</div>
                            <div class="row" @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(1, panel2.v1)}]">{{handleNum(2, panel2.v1)}}</div>
                        </div>
                        <div class="col">
                            <div class="row">目标占比</div>
                            <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(2, panel2.v2)}}</div>
                        </div>
                        <div class="col">
                            <div class="row">本月差值</div>
                            <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(2, panel2.v3)}}</div>
                        </div>
                        <div class="col">
                            <div class="row">退款{{radioModel === 1 ? '金额' : '数量'}}</div>
                            <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(1, panel2.v4)}}</div>
                        </div>
                    </div>
                </div>
                <CopyBoard ref="CopyBoard"/>
            </div>
            <div class="right">
                <div>当月退款趋势</div>
                <v-chart ref="echart1" style="height: calc(100% - 21px)" :options="echart1" autoresize></v-chart>
            </div>
        </div>
        <div class="footer">
            <div class="left">
                <div style="line-height: 32px">退款占比-业务员分布</div>
                <v-chart ref="echart2" style="flex: 1;overflow: visible" id="chart2" class="chart2" :options="echart2" autoresize></v-chart>
            </div>
            <div class="right">
                <div class="select">
                    <div style="line-height: 32px;">退款率月趋势-人员视角</div>
                    <div style="display: flex;">
                        <Radio v-bind="radio2" :model.sync="radio2.model"/>
                        <Border style="padding: 2px 10px;height: 32px"/>
                        <virtual-select style="width: 150px;margin-right: 0"
                            v-model="people"
                            :options="peopleArr.map((_) => ({ label: _ }))"
                            label="人员"
                        ></virtual-select>
                    </div>
                </div>
                <v-chart ref="echart3" v-if="radio2.model === 1" class="chart" :options="echart3" autoresize></v-chart>
                <y-table
                v-show="radio2.model === 2"
                style="width: 100%;margin-top: 10px"
                class="text-black"
                @change="handleChange"
                :options="{ ...table, columns: tableColumns, rowClassName: (record,index) =>  index === 0 ? 'blod grey' : index % 2 === 0 ? 'grey' : '' }"
                :rowKey="row => row.STAFF_NAME + row.TDATE"
                :loading="table.loading"
                ></y-table>
            </div>
        </div>
    </div>
</template>

<script>
import Radio from '../../../components/Radio'
import Border from '../../../components/Border'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import YTable from '@/views/BIView/components/YTable/YTable2'
import moment from 'moment'
import _ from 'lodash'
import base from '../../../utils/base.js'
import CopyBoard from '../../../components/CopyBoard.vue'
export default {
    mixins: [ base ],
    props: {
        dateV2: {
            type: Object,
            default: () => {}
        },
        radioModel: {
            type: Number,
        }
    },
    components: {
        Radio,
        Border,
        VirtualSelect,
        YTable,
        CopyBoard
    },
    watch: {
        'dateV2.day2': {
            handler() {
                this.getDay()
                this.getMonth()
                this.getPeople()
                this.getPeople1()
                this.getData()
            }
        },
        radioModel: {
            handler() {
                this.handleData(1, this.currentDay)
                this.handleData(2, this.currentMonth)
                this.handleData(4, this.echart1Data)
                this.handleData(5, this.echart2Data)
                this.handleData(6, this.echart3Data)
            }
        },
        'table.pagination.page': {
            handler() {
                this.handleData(3, this.tableData)
            }
        },
        people: {
            handler() {
                // if(this.radio2.model === 1) {
                    this.handleData(6, this.echart3Data)
                // }else if(this.radio2.model === 2) {
                    this.table.pagination.page = 1
                    this.handleData(3, this.tableData)
                // }
            }
        }
    },
    computed: {
        tableColumns() {
            return [
                { title: '统计日期', dataIndex: 'TDATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text === '合计' ? '合计' : moment(text).format('MM-DD')}</div>
                    }
                },
                { title: '人员', dataIndex: 'STAFF_NAME', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '金额退款率', dataIndex: 'REFUND_AMT_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(2, text)}</div>
                    }
                },
                { title: '本期退款金额', dataIndex: 'REFUND_AMT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(1, text)}</div>
                    }
                },
                { title: '退款金额占比', dataIndex: 'DAY_REFUND_AMT_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(2, text)}</div>
                    }
                },
                { title: '数量退款率', dataIndex: 'REFUND_CNT_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(2, text)}</div>
                    }
                },
                { title: '本期退款数量', dataIndex: 'REFUND_CNT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(1, text)}</div>
                    }
                },
                { title: '退款数量占比', dataIndex: 'DAY_REFUND_CNT_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(2, text)}</div>
                    }
                },
            ]
        }
    },
    async created() {
        this.echart1 = await _.cloneDeep(this.echartModel1)
        this.echart2 = await _.cloneDeep(this.echartModel2)
        this.echart3 = await _.cloneDeep(this.echartModel3)
        this.getDay()
        this.getMonth()
        this.getPeople()
        this.getPeople1()
        this.getData()
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
        if(this.echart2 !== null) this.echart2 = null
        if(this.echart3 !== null) this.echart3 = null
    },
    data() {
        let that = this
        return {
            echartModel1: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    formatter: function(params) {
                        let str = `统计日期：${params[0].data[2]}<br/>退款率：${that.handleNum(2, params[0].data[1])}`
                        return str
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)'
                    },
                    borderWidth: 1,
                    borderColor: '#ccc'
                },
                legend: {
                    top: '25%',
                    right: '0%',
                    orient: 'vertical',
                    align: 'left',
                    itemWidth: 13,
                    itemHeight: 13,
                    data: [],
                },
                color: ['#6c9bf9'],
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
                            return parseInt(value * 100) + '%'
                        }
                    }
                },
                series: [
                    {
                    symbolSize: 8,
                    name: '当月退款趋势',
                    data: [],
                    type: 'line',
                    smooth: true
                    }
                ]
            },
            echart1: null,
            echartModel2: {
                // color: ['#fd84b6', '#5b8ff9', '#2ebfbe', '#6d88b6', '#f6bd16', '#6dc8ec'],
                color: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#D47F00', '#00FFFF', '#D4FF55', '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#7FBF55','#a5c2d5', '#cbab4f', '#76a871', '#a56f8f', '#c12c44', '#9f7961', '#76a871', '#6f83a5', '0f4fb8', '106dcf', '#b3d74c', '#74aae3', '#5cdec6', '#3526de', '#9d65ee', '#a8b3e3', '#6bc1b7', '549ee2', '#6e98d6'],
                tooltip: {
                    trigger: 'item',
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)'
                    },
                    borderWidth: 1,
                    // borderColor: 'rgba(0,0,0,0.65)'
                    borderColor: '#ccc',
                    formatter: (params) => {
                        let str = `人员：${params.name}<br/>退款${that.radioModel === 1 ? '金额' : '数量'}：${parseInt(params.value).toLocaleString()}<br/>占比：${that.handleNum(2, params.data.rate)}`
                        return str
                    }
                },
                legend: {
                    top: '5%',
                    // left: 'right',
                    right: '5%',
                    orient: 'vertical',
                    align: 'left',
                    itemWidth: 13,
                    itemHeight: 13,
                    // itemStyle: {
                    //     color: ''
                    // }
                    // formatter: function (name) {
                    //     return 'Legend ' + name;
                    // }
                },
                series: [
                    {
                    colorBy: 'series',
                    // itemStyle: {
                    //     // color: (params) => {
                    //     //     let color = ['#fd84b6', '#5b8ff9', '#2ebfbe', '#6d88b6', '#f6bd16', '#6dc8ec']
                    //     //     return color[params.dataIndex]
                    //     // }
                    // },
                    seriesLayoutBy: 'row',
                    name: '退款占比',
                    type: 'pie',
                    center: ['40%', '45%'],
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: (params) => {
                            return that.handleNum(2, params.data.rate)
                        }
                    },
                    labelLine: {
                        show: false,
                        length: 4,
                        length2: 0,  
                    },
                    hoverAnimation: false,
                    emphasis: {
                        focus: 'none',
                        scale: false,
                        scaleSize: 0,
                        // label: {
                        // show: true,
                        // fontSize: '40',
                        // fontWeight: 'bold'
                        // }
                    },
                    data: []
                    }
                ]
            },
            echart2: null,
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
            echartModel3: {
                // legend: {
                //     top: '25%',
                //     right: '10%',
                //     orient: 'vertical',
                //     align: 'left',
                //     itemWidth: 13,
                //     itemHeight: 13,
                //     icon: 'rect'
                //     // data: [],
                // },
                // color: ['#6c9bf9'],
                color: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#D47F00', '#00FFFF', '#D4FF55', '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#7FBF55','#a5c2d5', '#cbab4f', '#76a871', '#a56f8f', '#c12c44', '#9f7961', '#76a871', '#6f83a5', '0f4fb8', '106dcf', '#b3d74c', '#74aae3', '#5cdec6', '#3526de', '#9d65ee', '#a8b3e3', '#6bc1b7', '549ee2', '#6e98d6'],
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: function(params) {
                        let str = `统计年月：${params.data[2]}<br/>人员：${params.seriesName}<br/>退款${that.radioModel === 1 ? '金额' : '数量'}：${that.handleNum(1, params.data[3])}<br/>退款率：${that.handleNum(2, params.data[1])}`
                        return str
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)'
                    },
                    borderWidth: 1,
                    borderColor: '#ccc'
                },
                grid: {
                    left: '0%',
                    right: '0%',
                    top: '15%',
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
                            return parseInt(value * 100) + '%'
                        }
                    }
                },
                series: [
                    {
                    symbolSize: 8,
                    name: '退款月趋势',
                    data: [],
                    type: 'line',
                    smooth: true
                    }
                ]
            },
            echart3: null,
            table: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 6
                },
                data: [],
                needPaging: true
            },
            tableData: [],
            panel1: {
                v1: 0,
                v2: 0,
                v3: 0,
                v4: 0
            },
            panel2: {
                v1: 0,
                v2: 0,
                v3: 0,
                v4: 0
            },
            currentDay: [],
            currentMonth: [],
            echart1Data: [],
            echart2Data: [],
            echart3Data: [],
        }
    },
    methods: {
        computeColor(p, value) {
            if(p === 0) {
                if(this.panel1.v1 - this.panel1.v2 < 0) return '#ff5953'
                else if(this.panel1.v1 - this.panel1.v2 > 0) return '#00a854'
            }else if(p === 1) {
                if(this.panel2.v1 - this.panel2.v2 < 0) return '#ff5953'
                else if(this.panel2.v1 - this.panel2.v2 > 0) return '#00a854'
            }
        },
        handleChange() {
        },
        // 获取当天 月最后一天
        async getDay() {
            let day = moment(this.dateV2.day2).month() !== moment(new Date()).month() ? moment(this.dateV2.day2).format('YYYYMM') + moment(this.dateV2.day2).daysInMonth() + '' : moment(new Date()).format('YYYYMMDD')
            let query = {
                START_TIME: day,
                END_TIME: day,
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_refund_d', query)
            this.currentDay = res.data.concat()
            this.handleData(1, this.currentDay)
        },
        // 获取当月
        async getMonth() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + '31',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_refund_d', query)
            this.currentMonth = res.data.concat()
            this.handleData(2, this.currentMonth)
        },
        async handleData(type, source) {
            // 1当天退款/货 2当月 3明细 4echart1 5echart2 6echart3
            if(type === 1) {
                if(!source.length){
                    for(let key in this.panel1) {
                        this.panel1[key] = '--'
                    }
                    return
                }
                // 退款
                let keys = ['REFUND_AMT_RATE', 'MON_TARGET', 'REFUND_AMT_DIFF', 'REFUND_AMT']
                // 退货
                let keys1 = ['REFUND_CNT_RATE', 'MON_TARGET', 'REFUND_CNT_DIFF', 'REFUND_CNT']
                let arr = this.radioModel === 1 ? keys : keys1
                // 还需要目标占比和本日差值
                arr.forEach((key, index) => {
                    // if(index !== 3 && index !== 6) {
                        this.panel1['v' + (index + 1)] = source[0][key]
                    // }
                    // else if(index === 3) {
                    //     this.panel['v' + (index + 1)] = (source[0][arr[1]] === null || source[0][arr[2]] === null) ? '--' : source[0][arr[1]] - source[0][arr[2]]
                    // }else if(index === 6) {
                    //     // 需要上期目标
                    //     this.panel['v' + (index + 1)] = (source[0][arr[1]] === null || source[0][arr[5]] === null) ? '--' : source[0][arr[1]] - source[0][arr[5]]
                    // }
                })
            }else if(type === 2) {
            // 当月退款/货
                // 需要合计一下
                if(!source.length){
                    for(let key in this.panel1) {
                        this.panel2[key] = '--'
                    }
                    return
                }
                // 退款
                let keys = ['REFUND_AMT_RATE', 'MON_TARGET', 'REFUND_AMT_DIFF', 'REFUND_AMT']
                // 退货
                let keys1 = ['REFUND_CNT_RATE', 'MON_TARGET', 'REFUND_CNT_DIFF', 'REFUND_CNT']
                let arr = this.radioModel === 1 ? keys : keys1
                // 还需要目标占比和本日差值
                arr.forEach((key, index) => {
                    // if(index !== 3 && index !== 6) {
                        this.panel2['v' + (index + 1)] = source[0][key]
                    // }
                    // else if(index === 3) {
                    //     this.panel['v' + (index + 1)] = (source[0][arr[1]] === null || source[0][arr[2]] === null) ? '--' : source[0][arr[1]] - source[0][arr[2]]
                    // }else if(index === 6) {
                    //     // 需要上期目标
                    //     this.panel['v' + (index + 1)] = (source[0][arr[1]] === null || source[0][arr[5]] === null) ? '--' : source[0][arr[1]] - source[0][arr[5]]
                    // }
                })
            }else if(type === 3) {
            // 明细
                this.table.data = []
                this.table.pagination.total = source.length
                this.table.needPaging = false
                // console.log(source);
                if(!source.length) return
                let arr = []
                if(!this.people.length) arr = source.concat()
                else arr = source.filter(_ => this.people.indexOf(_.STAFF_NAME) > -1)
                // let sum = source.filter(_ => _.STAFF_NAME === '合计')
                // if(sum.length) {
                //     sum.STAFF_NAME = '--'
                //     sum.TDATE = '合计'
                // }
                // source = source.filter(_ => _.STAFF_NAME !== '合计')
                // let pageSize = this.table.pagination.pageSize
                // let num = Math.ceil(source.length / (pageSize - 1))
                // let arr = source.concat()
                // for(let i = 0; i < num; i++) {
                //     arr.splice(i * pageSize, 0, sum[0])                    
                // }
                // this.table.needPaging = true
                // this.tableData = arr.concat()
                // this.table.pagination.total = arr.length
                // this.handlerPage(this.table, this.tableData)

                // 获取合计
                let query = {
                    START_TIME: this.dateV2.day2 + '01',
                    END_TIME: this.dateV2.day2 + '31',
                }
                let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_refund_stf_s', query)
                res.data[0].TDATE = '合计'
                res.data[0].STAFF_NAME = ''
                // 每页插入合计
                let pageSize = this.table.pagination.pageSize
                let num = arr.length / (pageSize - 1)
                for(let i = 0; i < num; i++) {
                    arr.splice(i * pageSize, 0, res.data[0])
                }
                // console.log(arr);
                this.table.needPaging = true
                this.table.pagination.total = arr.length
                this.handlePage(this.table, arr)
            }else if(type === 4) {
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel1)
                console.log(this.echart1);
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                if(!source.length) return
                let arr = source.concat()
                // x轴
                this.echart1.xAxis.data = arr.map(_ => moment(_.TDATE).format('DD'))
                // line
                let keys = this.radioModel === 1 ? ['TDATE', 'REFUND_AMT_RATE', 'TDATE'] : ['TDATE', 'REFUND_CNT_RATE', 'TDATE']
                this.echart1.series[0].data = arr.map(item => {
                    return keys.map((key, index) => {
                        if(index === 0) return moment(item[key]).format('DD')
                        else if(index === 1) return item[key]
                        else if(index === 2) return moment(item[key]).format('YYYY-MM-DD')
                    })
                })
            }else if(type === 5) {
                this.$refs?.echart2?.$refs?.echarts?.clear()
                this.echart2 = _.cloneDeep(this.echartModel2)
                this.echart2.series[0].data = []
                if(!source.length) return
                // let people = !this.people.length ? this.peopleArr : this.people
                let people = this.peopleArr.concat()
                let sum = people.map(name => {
                    return source.filter(_ => name === _.STAFF_NAME)
                }).map(item => {
                    return item.map(_ => this.radioModel === 1 ? _.REFUND_AMT : _.REFUND_CNT).reduce((a, b) => a + b)
                }).reduce((a, b) => a + b)
                let arr = people.map(name => {
                    return source.filter(_ => name === _.STAFF_NAME)
                }).map(item => {
                    return item.map(_ => {
                        return [
                            this.radioModel === 1 ? _.REFUND_AMT : _.REFUND_CNT,
                            _.STAFF_NAME
                        ]
                    })
                }).map(item => {
                    return {
                        value : item.map(_ => _[0]).reduce((a, b) => a + b),
                        name: item[0][1]
                    }
                }).map(_ => {
                    return {
                        ..._,
                        rate: _.value / sum
                    }
                })
                this.echart2.series[0].data = arr.concat()
            }else if(type === 6) {
                this.$refs?.echart3?.$refs?.echarts?.clear()
                this.echart3 = _.cloneDeep(this.echartModel3)
                this.echart3.xAxis.data = []
                this.echart3.series = []
                if(!source.length) return
                let arr = source.concat()
                // x轴
                this.echart3.xAxis.data = Object.freeze(Array.from(new Set(arr.map(_ => moment(_.TDATE).format('DD')))))
                // line
                let people = !this.people.length ? this.peopleArr : this.people
                this.echart3.series = people.map(name => {
                    return {
                        smooth: true,
                        symbolSize: 8,
                        name: name,
                        data: arr.filter(_ => name.indexOf(_.STAFF_NAME) > -1).map(item => {
                            return [
                                moment(item.TDATE).format('DD'),
                                this.radioModel === 1 ? item.REFUND_AMT_RATE : item.REFUND_CNT_RATE,
                                moment(item.TDATE).format('YYYY-MM-DD'),
                                this.radioModel === 1 ? item.REFUND_AMT : item.REFUND_CNT,
                            ]
                        }),
                        type: 'line',
                    }
                })
                console.log(this.echart3, this.echart1);
            }
        },
        // 人员数据 右下角图 表
        async getPeople() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + '31',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_refund_stf_d', query)
            this.peopleArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.STAFF_NAME))))
            res.data.sort((a, b) => moment(a.TDATE).get('date') - moment(b.TDATE).get('date'))
            this.echart3Data = res.data.concat()
            this.echart2Data = res.data.concat()
            this.tableData = res.data.concat()
            this.handleData(3, res.data)
            // this.handleData(5, res.data)
            this.handleData(6, res.data)
        },
        // 人员数据 左下角 图
        async getPeople1() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + '31',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_refund_stf_d', query)
            res.data.sort((a, b) => moment(a.TDATE).get('date') - moment(b.TDATE).get('date'))
            this.echart2Data = res.data.concat()
            // 获取people
            let res1 =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_refund_stf_d', query)
            this.peopleArr = Object.freeze(Array.from(new Set(res1.data.map(_ => _.STAFF_NAME))))
            this.handleData(5, res.data)
        },
        async getData() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + '31',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_refund_d', query)
            res.data.sort((a, b) => moment(a.TDATE).get('date') - moment(b.TDATE).get('date'))
            this.echart1Data = res.data.concat()
            this.handleData(4, res.data)
        }
    }
}
</script>

<style lang='scss' scoped>
@import '../../../assets/styles.scss';
.Day{
    .header{
        // flex: 45;
        height: calc(100% - 299px);
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        .left{
            width: 30%;
            display: flex;
            flex-direction: column;
            .item{
                flex: 1;
                display: flex;
                flex-direction: column;
                .panel{
                    flex: 1;
                    display: flex;
                    .col{
                        flex: 1;
                        .row{
                            font-size: 12px;
                            line-height: 32px;
                            height: 50%;
                        }
                    }
                }
            }
        }
        .right{
            flex: 1;
        }
    }
    .footer{
        margin-top: 10px;
        // flex: 55;
        // height: calc(55% - 5px);
        height: 289px;
        display: flex;
        .left{
            flex: 3;
            display: flex;
            flex-direction: column;
            .chart2{
                flex: 1;
            }
        }
        .right{
            flex: 7;
            align-items: center;
            display: flex;
            flex-direction: column;
            .select{
                width: 100%;
                display: flex;
                justify-content: space-between;
            }
            .chart{
                flex: 1;
            }
            .text-black /deep/ td{
                height: 18px;
                line-height: 18px;
            }
        }
    }
}
</style>