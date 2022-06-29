<!--
 * @Author: 黄浩
 * @Date: 2022-01-22 16:45:57
 * @LastEditTime: 2022-02-17 14:27:35
 * @LastEditors: Please set LastEditors
 * @Descripttion: 人员概览
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp2\index.vue
-->
<template>
    <div class="Comp2" ref="Comp2">
        <div class="header">
            <div class="people">
                <div class="title">人员业绩概览</div>
                <!-- <div id="chart1" class="chart1"></div> -->
                <div style="font-size: 12px;color: rgba(0,0,0,0.8)">金额</div>
                <v-chart ref="chart1" style="height: calc(100% - 50px);overflow: visible" :options="chart1" autoresize></v-chart>
            </div>
            <div style="padding: 20px 0;flex:1;display: flex;justify-content: center;opacity: 0.6">
                <div style="width: 1px;background: #ccc;height: 100%"></div>
            </div>
            <div  class="detail">
                <div class="line1">
                    <Radio v-bind="radio1" :model.sync="radio1.model" style="margin-right: 20px"/>
                    <DatepickerV2 v-bind="dateV2" 
                    :dayOrMonth.sync="dateV2.dayOrMonth"
                    :day2.sync="dateV2.day2"
                    :month1.sync="dateV2.month1"
                    :month2.sync="dateV2.month2"
                    />
                    <!-- <virtual-select style="width: 150px;z-index: 2;margin-right: 0;margin-left: 10px"
                        v-model="people"
                        :options="peopleArr.map((_) => ({ label: _ }))"
                        label="人员"
                    ></virtual-select> -->
                </div>
                <virtual-select style="width: 150px;position: absolute;right: 0;top: 40px;margin-right: 0;z-index: 2"
                    v-model="people"
                    :options="peopleArr.map((_) => ({ label: _ }))"
                    label="人员"
                ></virtual-select>
                <div class="line2" style="height: calc(100% - 32px)">
                    <div class="left" style="overflow: visible">
                        <div style="line-height: 24px;height: 24px;padding-left: 20px">业绩贡献</div>
                        <div class="chart2">
                            <v-chart ref="chart2" style="overflow: visible" :options="chart2" autoresize></v-chart>
                        </div>
                    </div>
                    <div class="right" style="overflow: visible">
                        <div style="line-height: 24px">业绩趋势</div>
                        <div class="chart3" style="height: calc(100% - 24px)">
                            <v-chart ref="chart3" style="overflow: visible" :options="chart3" autoresize></v-chart>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div v-if="dateV2.dayOrMonth === 1" class="day">
                <div class="left">
                    <div style="margin-bottom: 10px">日累计业绩明细</div>
                    <y-table
                    class="text-black"
                    @change="handleChange"
                    :options="{ ...table, columns: tableColumns, rowClassName: (record,index) => {return index === 0 ? 'bold grey': index % 2 !== 0 ? '' : 'grey'}}"
                    :rowKey="(item) => item.STAFF_NAME + item.MDATE_MONTH"
                    :loading="table.loading"
                    ></y-table>
                    <!-- :options="table" -->
                    <!-- :options="{ ...table, columns: tableColumns, rowClassName: (record,index) => {return index === 0 ? 'bold grey': index % 2 !== 0 ? '' : 'grey'}}" -->
                </div>
                <div style="padding: 10px 0;flex:1;display: flex;justify-content: center;opacity: 0.6">
                    <div style="width: 1px;background: #ccc;height: 100%"></div>
                </div>
                <div class="right">
                    <div style="margin-bottom: 10px;display: flex;justify-content:space-between">人员业绩明细
                        <div style="position: relative">
                            <div @click="rowClick({})" style="margin-right: 20px;color: #79a4fa;cursor: pointer;text-decoration:underline">返回</div>
                            <a-icon type="question-circle" style="position: absolute;top: 0;right: 0;color: #cbcbcb;" title="点击返回，即可复原。"/>
                        </div>
                    </div>
                    <y-table
                    class="text-black"
                    @change="handleChange"
                    :options="{ ...table2, columns: tableColumns2, rowClassName: (record,index) => {return index === 0 ? 'bold grey': index % 2 !== 0 ? '' : 'grey'}}"
                    :rowKey="(item) => item.STAFF_NAME + item.TDATE"
                    :loading="table2.loading"
                    ></y-table>
                </div>
            </div>
            <div v-else class="month">
                <div class="title" style="margin-bottom: 10px">人员业绩明细</div>
                <y-table
                class="text-black"
                @change="handleChange"
                :options="{ ...table3, columns: tableColumns3, rowClassName: (record,index) => {return index === 0 ? 'bold grey': index % 2 !== 0 ? '' : 'grey'}}"
                :rowKey="(item) => {return item.STAFF_NAME + item.MDATE_MONTH}"
                :loading="table.loading"
                ></y-table>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
import moment from 'moment'
import Radio from '../../components/Radio.vue'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import DatepickerV2 from '../../components/DatepickerV2.vue'
import YTable from '@/views/BIView/components/YTable/YTable2'
import base from '../../utils/base.js'
import { subtract } from 'xe-utils'
export default {
    mixins: [ base ],
    // props: {
    //     dateV2: {
    //         type: Object,
    //         default: () => {}
    //     }
    // },
    components: {
        Radio,
        // Datepicker,
        VirtualSelect,
        DatepickerV2,
        YTable
    },
    created() {
        let that = this
        this.chart1 = _.cloneDeep(this.option1)
        this.chart2 = _.cloneDeep(this.option2)
        this.chart3 = _.cloneDeep(this.option3)
        this.getPeopleArr()
        if(this.dateV2.dayOrMonth === 1) {
            this.getTable2DataByDay()
            this.getTableDataByDay()
            this.getOvData()
            this.getChart3Data()
        }else if(this.dateV2.dayOrMonth === 2) {
            this.getTable3Data()
        }
        this.setIntervalTimer = setInterval(() => {
            that.timer++
            this.$refs?.chart1?.$refs?.$echarts?.clear()
            this.chart1.series.push()
        }, 150)
    },
    beforeDestroy() {
        if(this.chart1 !== null) this.chart1 = null
        if(this.chart2 !== null) this.chart2 = null
        if(this.chart3 !== null) this.chart3 = null
        clearInterval(this.setIntervalTimer)
    },
    computed: {
        month() {
            return this.dateV2.month1 + this.dateV2.month2
        },
        // 日累计业绩明细 左下角
        tableColumns() {
            return [
                { title: '人员', dataIndex: 'STAFF_NAME', width: 100, ellipsis: true, sorter: false,
                    customRender: (text, record, index) => {
                        return <div title={text} style={[{'text-decoration': index !== 0 ? 'underline' : ''}]}
                        onclick={(e) => {index !== 0 ? this.rowClick(record) : ''}}
                        >{text}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付目标':'发货目标', dataIndex: this.radio1.model === 1 ? 'PTD_PAY_TGT':'PTD_DEV_TGT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handleNum(1, text)}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付业绩':'发货业绩', dataIndex: this.radio1.model === 1 ? 'PTD_PAY_AMT':'PTD_DEV_AMT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handleNum(1, text)}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付业绩达成':'发货业绩达成', dataIndex: this.radio1.model === 1 ? 'PTD_PAY_RATE':'PTD_DEV_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text} style={[{'color': this.handleColor(0, text) }]}>{this.handleNum(2, text)}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付业绩差值':'发货业绩差值', dataIndex: this.radio1.model === 1 ? 'PTD_PAY_DIFF':'PTD_DEV_DIFF', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handleNum(1, text)}</div>
                    }
                },
            ]
        },
        // 日-人员业绩明细 右下角
        tableColumns2() {
            return [
                { title: '统计日期', dataIndex: 'TDATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{text}</div>
                    }
                },
                { title: '人员', dataIndex: 'STAFF_NAME', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{text}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付目标':'发货目标', dataIndex: this.radio1.model === 1 ? 'PTD_PAY_TGT' : 'PTD_DEV_TGT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handleNum(1, text)}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付业绩':'发货业绩', dataIndex: this.radio1.model === 1 ? 'PTD_PAY_AMT':'PTD_DEV_AMT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handleNum(1, text)}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付业绩达成':'发货业绩达成', dataIndex: this.radio1.model === 1 ? 'PTD_PAY_RATE':'PTD_DEV_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text} style={[{'color': this.handleColor(0, text) }]}>{this.handleNum(2, text)}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付业绩差值':'发货业绩差值', dataIndex: this.radio1.model === 1 ? 'PTD_PAY_DIFF':'PTD_DEV_DIFF', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handleNum(1, text)}</div>
                    }
                },
            ]
        },
        // 月-人员业绩明细 下方
        tableColumns3() {
            return [
                { title: '统计日期', dataIndex: 'MDATE_MONTH', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{text}</div>
                    }
                },
                { title: '人员', dataIndex: 'STAFF_NAME', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{text}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付目标':'发货目标', dataIndex: this.radio1.model === 1 ? 'PTD_PAY_TGT' : 'PTD_DEV_TGT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handleNum(1, text)}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付业绩':'发货业绩', dataIndex: this.radio1.model === 1 ? 'PTD_PAY_AMT':'PTD_DEV_AMT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handleNum(1, text)}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付业绩达成':'发货业绩达成', dataIndex: this.radio1.model === 1 ? 'PTD_PAY_RATE':'PTD_DEV_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text} style={[{'color': this.handleColor(0, text) }]}>{this.handleNum(2, text)}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付业绩差值':'发货业绩差值', dataIndex: this.radio1.model === 1 ? 'PTD_PAY_DIFF':'PTD_DEV_DIFF', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handleNum(1, text)}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付业绩占比':'发货业绩占比', dataIndex: this.radio1.model === 1 ? 'MTD_TOT_PAY_RATE':'MTD_TOT_DEV_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handleNum(2, text)}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '上期支付业绩':'上期发货业绩', dataIndex: this.radio1.model === 1 ? 'LAST_PAY_AMT':'LAST_DEV_AMT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text}>{this.handleNum(1, text)}</div>
                    }
                },
                { title: this.radio1.model === 1 ? '支付业绩环比':'发货业绩环比', dataIndex: this.radio1.model === 1 ? 'LAST_PAY_RATE':'LAST_DEV_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div title={text} style={[{'color': this.handleColor(1, text) }]}>{this.handleNum(2, text)}</div>
                    }
                },
            ]
        },
    },
    watch: {
        'dateV2.dayOrMonth': {
            handler(val) {
                if(val === 1) {
                    this.getTable2DataByDay()
                    this.getTableDataByDay()
                    this.getOvData()
                    this.getChart3Data()
                }else if(val === 2) {
                    this.getOvData()
                    // this.getTableDataByDay()
                    this.getChart3Data()
                    this.getTable3Data()
                }
            }
        },
        'dateV2.day2': {
            handler() {
                this.getTable2DataByDay()
                this.getTableDataByDay()
                this.getOvData()
                this.getChart3Data()
            }
        },
        month: {
            handler() {
                this.getOvData()
                // this.getTableDataByDay()
                this.getChart3Data()
                this.getTable3Data()
            }
        },
        'radio1.model': {
            handler() {
                if(this.dateV2.dayOrMonth === 1) {
                    this.handleData(3, this.ovData)
                    this.handleData(4, this.ovData)
                    this.handleData(5, this.chart3Data)
                    // this.table.columns = this.tableColumns
                    // this.table2.columns = this.tableColumns2
                }else if(this.dateV2.dayOrMonth === 2) {
                    this.handleData(3, this.ovData)
                    this.handleData(4, this.ovData)
                    this.handleData(5, this.chart3Data)
                    // this.table3.columns = this.tableColumns3
                }
            },
        },
        people: {
            handler() {
                let flag = this.dateV2.dayOrMonth === 1 ? true : false
                if(flag) {
                    this.handleData(5, this.chart3Data)
                }else if(!flag) {
                    this.getTable3Data()
                    this.handleData(5, this.chart3Data)
                }
            }
        },
        'table2.pagination.page': {
            handler() {
                if(this.dateV2.dayOrMonth === 1) {
                    this.handleData(1, this.table2Data)
                }
            }
        },
        'table.pagination.page': {
            handler() {
                if(this.dateV2.dayOrMonth === 1) {
                    this.handleData(2, this.tableData)
                }
            }
        },
        'table3.pagination.page': {
            handler() {
                this.handleData(6, this.table3Data)
            }
        }
    },
    data() {
        let that = this
        return {
            radio1: {
                name: '口径',
                arr: [
                    { label: '支付口径', value: 1 },
                    { label: '发货口径', value: 2 },
                ],
                model: 1
            },
            dateV2: {
                dayOrMonth: 1,
                day2: moment(new Date()).format('YYYYMM'),
                monthType: 2,
                month1: moment(new Date()).subtract(6, 'M').format('YYYYMM'),
                month2: moment(new Date()).format('YYYYMM'),
            },
            option1: {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: '12'
                    },
                    borderWidth: 1,
                    borderColor: '#ccc',
                    formatter: (params) => {
                        let str = `业务员：${params.data[2]}<br/>支付业绩：${parseInt(params.data[1]).toLocaleString()}<br/>支付业绩达成：${(params.data[0] * 100).toFixed(2)}%<br/>支付目标：${parseInt(params.data[3]).toLocaleString()}<br/>支付业绩差值：${parseInt(params.data[4] * 1).toLocaleString()}`
                        let str1 = `业务员：${params.data[2]}<br/>发货业绩：${parseInt(params.data[1]).toLocaleString()}<br/>发货业绩达成：${(params.data[0] * 100).toFixed(2)}%<br/>发货目标：${parseInt(params.data[3]).toLocaleString()}<br/>发货业绩差值：${parseInt(params.data[4] * 1).toLocaleString()}`
                        return that.radio1.model === 1 ? str : str1
                    }
                },
                grid: {
                    containLabel: true,
                    show: false,
                    left: '0%',
                    top: '15%',
                    bottom: '15%',
                    right: '13%'
                },
                xAxis: {
                    name: '达标率',
                    nameTextStyle: {
                        padding: [28, 0, 0, 6]
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: (val) => {
                            return (val * 100).toFixed(0) + '%'
                        }
                    },
                    max: 1.5
                },
                yAxis: {
                    // name: '金额',
                    nameTextStyle: {
                        padding: [0, 0, 0, 0],
                        align: 'left'
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: [
                    {
                        markLine: {
                            itemStyle: {      //盒须图样式。
                            },
                            symbol:'none',
                            name: 'cc',
                            label: {
                                show: true,
                            },
                            tooltip: {
                                trigger: 'none'
                            },
                            lineStyle: {
                                color: '#ff5953'
                            },
                            data: [
                                {   
                                    xAxis: 1,
                                    label: {
                                        fontSize: 10,
                                        show: true,
                                        formatter: '100%',
                                    }
                                },
                                {
                                    name: '平均线',
                                    // 支持 'average', 'min', 'max'
                                    type: 'average',
                                    valueIndex: 1,
                                    label: {
                                        fontSize: 10,
                                        show: true,
                                        formatter: (params) => {
                                            console.log(params);
                                            return '平均业绩\n' + params.value
                                        }
                                    },
                                },
                            ],
                            animation: false
                        },
                    label: {
                        show: true,
                        offset: [0,-20],
                        formatter: (params) => {
                            return params.data[2]
                        }
                    },
                    symbolSize: (value,params) => {
                        let size = value[5]
                        if(value[6] % size === 0) that.chart1.series[0].data[params.dataIndex][6] = 3
                        else that.chart1.series[0].data[params.dataIndex][6] ++
                        return that.chart1.series[0].data[params.dataIndex][6]
                    },
                    itemStyle: {
                        color: 
                        (params) => {
                            let size = params.data[5]
                            let color1 = 'rgba(0,168,84,0.6)'
                            if(params.data[6] % size === size - 3) color1 = 'rgba(0,168,84,0.6)'
                            else if(params.data[6] % size === size - 2) color1 = 'rgba(0,168,84,0.4)'
                            else if(params.data[6] % size === size - 1) color1 = 'rgba(0,168,84,0.2)'
                            else if(params.data[6] % size === 0) color1 = 'rgba(0,168,84,0)'
                            else if(params.data[6] % size === 1) color1 = 'rgba(0,168,84,0)'
                            else if(params.data[6] % size === 2) color1 = 'rgba(0,168,84,0)'
                            else if(params.data[6] % size === 3) color1 = 'rgba(0,168,84,0)'
                            else if(params.data[6] % size === 4) color1 = 'rgba(0,168,84,0)'
                            else if(params.data[6] % size === 5) color1 = 'rgba(0,168,84,0)'
                            return {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.5,
                                colorStops: [
                                    {
                                        offset: 0, color: 'transparent'// 0% 处的颜色
                                    },
                                    {
                                        offset: 1, color: color1 // 100% 处的颜色
                                    }
                                ],
                                global: false // 缺省为 false
                            }
                        }
                    },
                    data: [],
                    type: 'scatter',
                    }
                ]
            },
            chart1: null,
            setIntervalTimer: null,
            // 控制chart1的symbol大小
            timer: 1,
            // 人员选项
            people: [],
            peopleArr: [],
            // 上二图
            chart2: null,
            option2: {
                // color: ['#fd84b6', '#5b8ff9', '#2ebfbe', '#6d88b6', '#f6bd16', '#6dc8ec'],
                // color: ['#5a8ef9', '#2ec1b7', '#6e87b4', '#f9ba0b', '#70c5ef', '#ec8db4', '#bedafa']
                color: ['#5a8ef9', '#2ec1b7', '#6e87b4', '#f9ba0b', '#70c5ef', '#ec8db4', '#bedafa', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#D47F00', '#00FFFF', '#D4FF55', '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#7FBF55','#a5c2d5', '#cbab4f', '#76a871', '#a56f8f', '#c12c44', '#9f7961', '#76a871', '#6f83a5', '0f4fb8', '106dcf', '#b3d74c', '#74aae3', '#5cdec6', '#3526de', '#9d65ee', '#a8b3e3', '#6bc1b7', '549ee2', '#6e98d6'],
                tooltip: {
                    trigger: 'item',
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: 12
                    },
                    borderWidth: 1,
                    // borderColor: 'rgba(0,0,0,0.65)'
                    borderColor: '#ccc',
                    formatter: (params) => {
                        let str = `业务员：${params.name}<br/>支付业绩：${parseInt(params.data.value1).toLocaleString()}<br/>支付业绩占比：${that.handleNum(2, params.value)}`
                        return str
                    }
                },
                legend: {
                    type: 'scroll',
                    top: '5%',
                    // left: 'right',
                    right: '5%',
                    orient: 'vertical',
                    align: 'left',
                    itemWidth: 13,
                    itemHeight: 13,
                    icon: 'rect',
                    pageIconSize: 8,
                    pageIconColor: '#7F7F7F'
                },
                series: [
                    {
                    colorBy: 'series',
                    itemStyle: {},
                    seriesLayoutBy: 'row',
                    name: '',
                    type: 'pie',
                    center: ['40%', '50%'],
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: true,
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: (params) => {
                            // if(params.data.value === 0) return
                            return that.handleNum(2, params.data.value)
                        },
                        color: '#7F7F7F'
                    },
                    labelLine: {
                        show: false,
                        length: 15,
                        length2: 5,  
                    },
                    hoverAnimation: false,
                    emphasis: {
                        focus: 'none',
                        scale: false,
                        scaleSize: 0,
                    },
                    data: []
                    }
                ]
            },
            // 右上图
            chart3: null,
            option3: {
                color: ['#5a8ef9', '#2ec1b7', '#6e87b4', '#f9ba0b', '#70c5ef', '#ec8db4', '#bedafa', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#D47F00', '#00FFFF', '#D4FF55', '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#7FBF55','#a5c2d5', '#cbab4f', '#76a871', '#a56f8f', '#c12c44', '#9f7961', '#76a871', '#6f83a5', '0f4fb8', '106dcf', '#b3d74c', '#74aae3', '#5cdec6', '#3526de', '#9d65ee', '#a8b3e3', '#6bc1b7', '549ee2', '#6e98d6'],
                tooltip: {
                    trigger: 'item',
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ccc',
                    formatter: (params) => {
                        let str = `统计年月：${params.name}<br/>业务员：${params.seriesName}<br/>支付业绩：${parseInt(params.value[1]).toLocaleString()}`
                        return str
                    }
                },
                grid: {
                    containLabel: true,
                    left: '0%',
                    top: '8%',
                    bottom: '15%'
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
                        show: false,
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    // axisLabel: {
                    //     formatter: (value) => {
                    //         return parseInt(value).toLocaleString()
                    //     }
                    // }
                },
                series: [
                    {
                        symbolSize: 4,
                        name: '',
                        data: [],
                        type: 'line',
                        smooth: true
                    }
                ]
            },
            // 日累计业绩明细
            table: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 5
                },
                data: [],
                needPaging: true,
                // columns: []
            },
            tableData: [],
            // 日-人员业绩明细
            table2: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 5
                },
                data: [],
                needPaging: true,
                // columns: []
            },
            table2Data: [],
            // 月-人员业绩明细
            table3: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 5
                },
                data: [],
                needPaging: true,
                // columns: []
            },
            table3Data: [],
            // 当前获取的数据
            currentData: [],
            ovData: [],
            chart2Data: [],
            chart3Data: []
        }
    },
    methods: {
        // 0 发货/支付业绩达成  1 环比
        handleColor(type, value) {
            if(type === 0) {
                if(value === 0 || value === null) return
                if(value >= 1) return '#ff5953'
                else return '#00a854'
            }else if(type === 1) {
                if(value >= 0) return '#ff5953'
                else return '#00a854'
            }
        },
        // 行点击
        rowClick(row) {
            this.getTable2DataByDay(row.STAFF_NAME)
        },
        handleChange() {
            
        },
        async getPeopleArr() {
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_staff_overview_src')
            this.peopleArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.STAFF_NAME))))
        },
        // 获取 日-人员业绩明细 右下角
        async getTable2DataByDay(people = []) {
            let query = {
                MDATE: this.dateV2.day2 + '01'
            }
            if(people.length) query.STAFF_NAME = people.toString()
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_staff_overview_d',query)
            res.data.sort((a, b) => moment(a.TDATE).format('x') - moment(b.TDATE).format('x'))
            this.table2Data = res.data.concat()
            this.handleData(1, res.data)
        },
        // 获取 日-累计业绩明细 左下角 日-业绩贡献 上2图
        async getTableDataByDay() {
            let flag = this.dateV2.dayOrMonth === 1 ? true : false
            if(flag) {
                let query = {
                    START_TIME: this.dateV2.day2,
                    END_TIME: moment(this.dateV2.day2).add(1, 'M').format('YYYYMM')
                }
                let res = await this.$fetchSql('oversea_cockpit', 'oversea_staff_overview_m',query)
                this.tableData = res.data.concat()
                this.handleData(2, res.data)
                // this.handleData(4, res.data)
            }
            // else {
            //     let query = {
            //         START_TIME: this.dateV2.month1,
            //         END_TIME: this.dateV2.month2
            //     }
            //     let res = await this.$fetchSql('oversea_cockpit', 'oversea_staff_overview_m',query)
            //     this.tableData = res.data.concat()
            //     this.handleData(4, res.data)
            // }

        },
        // 获取 日-人员业绩概览 左上角
        async getOvData() {
            let query = {
                START_TIME: this.dateV2.day2,
                END_TIME: moment(this.dateV2.day2).add(1, 'M').format('YYYYMM')
            }
            let query2 = {
                START_TIME: this.dateV2.month1,
                END_TIME: this.dateV2.month2
            }
            let flag = this.dateV2.dayOrMonth === 1 ? true : false
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_staff_overview_ov', flag ? query : query2)
            this.ovData = res.data.concat()
            this.handleData(3, res.data)
            this.handleData(4, res.data)
        },
        // 获取业绩趋势 右上角
        async getChart3Data() {
            let flag = this.dateV2.dayOrMonth === 1 ? true : false
            if(flag) {
                let query = {
                    MDATE: this.dateV2.day2 + '01'
                }
                let res = await this.$fetchSql('oversea_cockpit', 'oversea_staff_overview_d', query)
                res.data.sort((a, b) => moment(a.TDATE).format('x') - moment(b.TDATE).format('x'))
                this.chart3Data = res.data.concat()
                this.handleData(5, res.data)
            }else {
                let query = {
                    START_TIME: this.dateV2.month1,
                    END_TIME: this.dateV2.month2
                }
                let res = await this.$fetchSql('oversea_cockpit', 'oversea_staff_overview_m', query)
                res.data.sort((a, b) => moment(a.MDATE_MONTH).format('x') - moment(b.MDATE_MONTH).format('x'))
                this.chart3Data = res.data.concat()
                this.handleData(5, res.data)
            }
        },
        // 获取 月-业绩明细 下方
        async getTable3Data() {
            let query = {
                START_TIME: this.dateV2.month1,
                END_TIME: this.dateV2.month2
            }
            this.people.length ? query.STAFF_NAME = this.people.toString() : ''
            let res = await this.$fetchSql('oversea_cockpit', 'oversea_staff_overview_m',query)
            res.data.sort((a, b) => moment(a.MDATE_MONTH).format('x') - moment(b.MDATE_MONTH).format('x'))
            this.table3Data = res.data.concat()
            this.handleData(6, res.data)
        },
        // 1 日-人员业绩明细 右下角 2 日table 左下角 3 日-人员业绩概览 左上图 4 日-业绩贡献 上2图 5 日-业绩趋势 右上图 6 月-业绩明细 下方
        handleData(type, source) {
            if(type === 1) {
                this.table2.data = []
                this.table2.pagination.total = 0
                if(source.length <= 1) return
                let arr = source.filter(_ => _.STAFF_NAME !== '合计')
                // 抽出合计 放在每一页的头部
                let sum = source.filter(_ => _.STAFF_NAME === '合计').map(_ => {
                    return {
                        ..._,
                        STAFF_NAME: '--',
                        TDATE: '合计'
                    }
                })
                let pageSize = this.table2.pagination.pageSize
                let num = Math.ceil(source.length / (pageSize - 1))
                for(let i = 0; i < num; i++) {
                    arr.splice(i * pageSize, 0, sum[0])
                }
                this.table2.pagination.total = arr.length
                this.handlePage(this.table2, arr)
            }else if(type === 2) {
                this.table.data = []
                this.table.pagination.total = 0
                if(source.length <= 1) return
                let arr = source.filter(_ => _.STAFF_NAME !== '合计')
                // 抽出合计 放在每一页的头部
                let sum = source.filter(_ => _.STAFF_NAME === '合计')
                let pageSize = this.table.pagination.pageSize
                let num = Math.ceil(source.length / (pageSize - 1))
                for(let i = 0; i < num; i++) {
                    arr.splice(i * pageSize, 0, sum[0])
                }
                this.table.pagination.total = arr.length
                this.handlePage(this.table, arr)
            }else if(type === 3) {
                this.$refs?.chart1?.$refs?.echarts?.clear()
                this.chart1 = _.cloneDeep(this.option1)
                this.chart1.series[0].data = []
                if(!source.length) return
                let keys = this.radio1.model === 1 ? ['PTD_PAY_RATE', 'PTD_PAY_AMT', 'STAFF_NAME', 'PTD_PAY_TGT', 'PTD_PAY_DIFF'] : ['PTD_DEV_RATE', 'PTD_DEV_AMT', 'STAFF_NAME', 'PTD_DEV_TGT', 'PTD_DEV_DIFF']
                let arr = source.concat()
                arr = arr.map(item => {
                    return keys.map(key => item[key])
                })
                
                arr.forEach(item => {
                    let size = Math.ceil(item[0]) * 30
                    size = size <= 5 ? 10 : size
                    // size
                    item.push(size)
                    // // start
                    // item.push(Math.ceil(Math.random() * (Math.ceil(item[0]) * 30 + 5)))
                    // current
                    item.push(Math.ceil(Math.random() * (size)))
                })
                console.log(arr);
                this.chart1.series[0].data = arr.concat()
            }else if(type === 4) {
                this.$refs?.chart2?.$refs?.echarts?.clear()
                this.chart2 = _.cloneDeep(this.option2)
                this.chart2.series[0].data = []
                if(source.length <= 1) return
                let keys = this.radio1.model === 1 ? ['MTD_TOT_PAY_RATE', 'STAFF_NAME', 'PTD_PAY_AMT'] : ['MTD_TOT_DEV_RATE', 'STAFF_NAME', 'PTD_DEV_AMT']
                this.chart2.series[0].data = source.filter(_ => _.STAFF_NAME !== '合计').map(item => {
                    return {
                        value: item[keys[0]] === 0 ? '' : item[keys[0]],
                        name: item[keys[1]],
                        value1: item[keys[2]]
                    }
                })
            }else if(type === 5) {
                // 清空
                this.$refs?.chart3?.$refs?.echarts?.clear()
                this.chart3 = _.cloneDeep(this.option3)
                this.chart3.xAxis.data = []
                this.chart3.series = []
                if(source.length <= 1) return
                let flag = this.dateV2.dayOrMonth === 1 ? true : false
                if(flag) {
                    let people = this.people.length ? this.people : this.peopleArr
                    let arr = source.filter(_ => _.STAFF_NAME !== '合计' && people.indexOf(_.STAFF_NAME) > -1).sort((a, b) => moment(a.TDATE).format('x') - moment(b.TDATE).format('x'))
                    // x轴
                    this.chart3.xAxis.data = Object.freeze(Array.from(new Set(source.map(_ => moment(_.TDATE).format('DD')))))
                    // line
                    let obj = {
                        symbolSize: 4,
                        name: '',
                        data: [],
                        type: 'line',
                        smooth: true
                    }
                    let names = Object.freeze(Array.from(new Set(source.map(_ => _.STAFF_NAME))))
                    let keys = this.radio1.model === 1 ? ['TDATE', 'PTD_PAY_AMT'] : ['TDATE', 'PTD_DEV_AMT']
                    this.chart3.series = names.map(name => {
                        return {
                            ...obj,
                            name,
                            data: arr.filter(_ => _.STAFF_NAME === name).map(_ => {
                                return [
                                    moment(_[keys[0]]).format('DD'),
                                    _[keys[1]],
                                    name,
                                    _[keys[0]]
                                ]
                            })
                        }
                    })
                }else {
                    let people = this.people.length ? this.people : this.peopleArr
                    let arr = source.filter(_ => _.STAFF_NAME !== '合计' && people.indexOf(_.STAFF_NAME) > -1).sort((a, b) => moment(a.MDATE_MONTH).format('x') - moment(b.MDATE_MONTH).format('x'))
                    // x轴
                    this.chart3.xAxis.data = Object.freeze(Array.from(new Set(source.map(_ => moment(_.MDATE_MONTH).format('YYYY-MM')))))
                    // line
                    let obj = {
                        symbolSize: 4,
                        name: '',
                        data: [],
                        type: 'line',
                        smooth: true
                    }
                    let names = Object.freeze(Array.from(new Set(source.map(_ => _.STAFF_NAME))))
                    let keys = this.radio1.model === 1 ? ['MDATE_MONTH', 'PTD_PAY_AMT'] : ['MDATE_MONTH', 'PTD_DEV_AMT']
                    this.chart3.series = names.map(name => {
                        return {
                            ...obj,
                            name,
                            data: arr.filter(_ => _.STAFF_NAME === name).map(_ => {
                                return [
                                    moment(_[keys[0]]).format('YYYY-MM'),
                                    _[keys[1]],
                                    name,
                                    _[keys[0]]
                                ]
                            })
                        }
                    })
                }
            }else if(type === 6) {
                this.table3.data = []
                this.table3.pagination.total = 0
                if(source.length <= 1) return
                let arr = source.filter(_ => _.STAFF_NAME !== '合计')
                // 抽出合计 放在每一页的头部
                let sum = source.filter(_ => _.STAFF_NAME === '合计').map(_ => {
                    return {
                        ..._,
                        STAFF_NAME: '--',
                        MDATE_MONTH: '合计'
                    }
                })
                let pageSize = this.table3.pagination.pageSize
                let num = Math.ceil(source.length / (pageSize - 1))
                for(let i = 0; i < num; i++) {
                    arr.splice(i * pageSize, 0, sum[0])
                }
                this.table3.pagination.total = arr.length
                this.handlePage(this.table3, arr)
            }
        },
    }
}
</script>

<style lang='scss' scoped>
@import '../../assets/styles.scss';
.Comp2{
    // display: flex;
    // flex: 1;
    height: 100%;
    // flex-direction: column;
    /deep/ .grey{
        background: #fafafa
    }
    /deep/ .bold{
        font-weight: bold;
    }
    .header{
        padding: 10px 20px;
        display: flex;
        // flex: 1;
        height: calc(100% - 335px);
        .people{
            width: 35%;
            .title{
                font-size: 12px;
                font-family: "","",Helvetica,Tahoma,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif;
                line-height: 32px;
            }
            .chart1{
                // width: 461px;
                // height: 223px;
            }
        }
        .detail{
            position: relative;
            width: 60%;
            display: flex;
            flex-direction: column;
            .line1{
                display: flex;
                height: 32px;
                align-items: center;
                justify-content: flex-end;
            }
            .line2{
                flex: 1;
                width: 100%;
                display: flex;
                .left{
                    width: 45%;
                    display: flex;
                    flex-direction: column;
                    // height: calc(100% - 24px);
                    .chart2{
                        // flex: 1;
                        // min-height: 130px;
                        // height: calc(var(--height) * 1px - 411px);
                        height: calc(100% - 24px)
                    }
                }
                .right{
                    // height: calc(100% - 24px);
                    width: 55%;
                    display: flex;
                    flex-direction: column;
                    .chart3{
                        // min-height: 130px;
                        // height: calc(var(--height) * 1px - 411px);
                        height: calc(100% - 50px)
                    }
                }
            }
        }
    }
    .bottom{
        display: flex;
        padding: 0px 20px 10px;
        height: 335px;
        .day{
            flex: 1;
            display: flex;
            .left{
                width: 35%;
                display: flex;
                flex-direction: column;
            }
            .right{
                width: 60%;
                display: flex;
                flex-direction: column;
            }
        }
        .month{
            flex: 1;
        }
    }
}
</style>