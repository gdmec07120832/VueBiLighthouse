<template>
    <div class="Comp1">
<!--        <Title :label="radio2.model === 1 ? '支付业绩' : '发货业绩'"/>-->
        <div class="titleBox" style="display: flex;align-items: center;">
            <Title :label="radio2.model === 1 ? '支付业绩' : '发货业绩'" style="margin-bottom: 0;padding-bottom: 0"/>
            <div style="flex: 1"></div>
            <Radio v-bind.sync="titleBox.radio"/>
            <a-month-picker v-if="titleBox.radio.model === '当月'" class="ml10" style="width: 150px" v-model="titleBox.month" :allowClear="false" valueFormat="YYYYMM"/>
            <YearPicker v-if="titleBox.radio.model === '月度'" class="ml10" :year.sync="titleBox.year"/>
        </div>
        <div style="width: calc(100% + 40px);height: 1px;background: #ccc;margin: 9.5px 0;transform: translateX(-20px)"></div>
<!--        <div class="header">-->
<!--            <div class="data" v-if="dateV2.dayOrMonth === 1" style="position: relative">-->
<!--                <div class="left">-->
<!--                    <div class="line">-->
<!--                        <div class="label">{{radio2.model === 1 ? '日累计支付目标' : '日累计发货目标'}}</div>-->
<!--                        <div @contextmenu.prevent="openMenu($event, ovData.v1)" class="value">{{this.handleNumV2(4, ovData.v1)}}</div>-->
<!--                    </div>-->
<!--                    <div class="line">-->
<!--                        <div class="label">{{radio2.model === 1 ? '日累计支付业绩' : '日累计发货业绩'}}</div>-->
<!--                        <div @contextmenu.prevent="openMenu($event, ovData.v2)" class="value">{{this.handleNumV2(4, ovData.v2)}}</div>-->
<!--                    </div>-->
<!--                    <div class="line">-->
<!--                        <div class="label">{{radio2.model === 1 ? '日累计支付达成' : '日累计发货达成'}}</div>-->
<!--                        <div @contextmenu.prevent="openMenu($event, ovData.v3)" :class="['value', handleColor(ovData.v3)]">{{handleNumV2(2, ovData.v3)}}</div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="middle">-->
<!--                    <div></div>-->
<!--                </div>-->
<!--                <div class="right">-->
<!--                    <div class="line">-->
<!--                        <div class="label">{{radio2.model === 1 ? '月累计支付目标' : '月累计发货目标'}}</div>-->
<!--                        <div @contextmenu.prevent="openMenu($event, ovData.v4)" class="value">{{this.handleNumV2(4, ovData.v4)}}</div>-->
<!--                    </div>-->
<!--                    <div class="line">-->
<!--                        <div class="label">{{radio2.model === 1 ? '月累计支付业绩' : '月累计发货业绩'}}</div>-->
<!--                        <div @contextmenu.prevent="openMenu($event, ovData.v5)" class="value">{{this.handleNumV2(4, ovData.v5)}}</div>-->
<!--                    </div>-->
<!--                    <div class="line">-->
<!--                        <div class="label">{{radio2.model === 1 ? '月累计支付达成' : '月累计发货达成'}}</div>-->
<!--                        <div @contextmenu.prevent="openMenu($event, ovData.v6)" :class="['value', handleColor(ovData.v6)]">{{this.handleNumV2(2, ovData.v6)}}</div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <CopyBoard ref="CopyBoard"/>-->
<!--            </div>-->
<!--            <div class="data" v-else>-->
<!--                <div class="left">-->
<!--                    <div class="line">-->
<!--                        <div class="label">{{radio2.model === 1 ? '累计支付目标' : '累计发货目标'}}</div>-->
<!--                        <div @contextmenu.prevent="openMenu($event, ovData2.v1)" class="value">{{this.handleNumV2(4, ovData2.v1)}}</div>-->
<!--                    </div>-->
<!--                    <div class="line">-->
<!--                        <div class="label">{{radio2.model === 1 ? '累计支付业绩' : '累计发货业绩'}}</div>-->
<!--                        <div @contextmenu.prevent="openMenu($event, ovData2.v2)" class="value">{{this.handleNumV2(4, ovData2.v2)}}</div>-->
<!--                    </div>-->
<!--                    <div class="line">-->
<!--                        <div class="label">{{radio2.model === 1 ? '累计支付达成' : '累计发货达成'}}</div>-->
<!--                        <div @contextmenu.prevent="openMenu($event, ovData2.v3)" :class="['value', handleColor(ovData2.v3)]">{{handleNumV2(2, ovData2.v3)}}</div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <CopyBoard ref="CopyBoard"/>-->
<!--            </div>-->
<!--            <div class="select">-->
<!--&lt;!&ndash;                <div class="line1">&ndash;&gt;-->
<!--&lt;!&ndash;                    <Radio v-bind.sync="radio2" style="margin-right: 20px;display: none"/>&ndash;&gt;-->
<!--&lt;!&ndash;                    <DatepickerV2 v-bind="dateV2"&ndash;&gt;-->
<!--&lt;!&ndash;                    :dayOrMonth.sync="dateV2.dayOrMonth"&ndash;&gt;-->
<!--&lt;!&ndash;                    :day2.sync="dateV2.day2"&ndash;&gt;-->
<!--&lt;!&ndash;                    :month1.sync="dateV2.month1"&ndash;&gt;-->
<!--&lt;!&ndash;                    :month2.sync="dateV2.month2"&ndash;&gt;-->
<!--&lt;!&ndash;                    />&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--                <div class="line1">-->
<!--                    &lt;!&ndash; <Radio v-bind="radio2" :model.sync="radio2.model"/> &ndash;&gt;-->
<!--                    <virtual-select style="width: 200px;margin-left: 10px;margin-right: 0"-->
<!--                        v-model="SHOP_NAME"-->
<!--                        :options="SHOP_NAMEArr.map((_) => ({ label: _ }))"-->
<!--                        label="渠道"-->
<!--                    ></virtual-select>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
        <Panels @clickPanel="clickPanel" class="panels" :dateV2="dateV2" :radio2="radio2"/>
        <div class="mt10" style="font-size: 16px;line-height: 21px">业绩趋势</div>
        <v-chart ref="echart1" :style="[{height: dateV2.dayOrMonth === 1 ? 'calc(100% - 433px)' : 'calc(100% - 425px)',overflow: 'visible'}]" class="myecharts" :options="echart1" autoresize></v-chart>
        <Table v-if="dateV2.dayOrMonth === 1" v-bind="table" class="table1 mt10"/>
        <Table v-if="dateV2.dayOrMonth === 1" class="table1 mt10" v-bind="table1"/>
        <Table v-if="dateV2.dayOrMonth === 2" v-bind="table2" class="table2 mt20" />
    </div>
</template>

<script>
import CopyBoard from "../../components/CopyBoard";
import Title from '../../components/Title'
import graphic from 'echarts/lib/util/graphic'
import moment from 'moment'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import Table from '../../components/Table.vue'
import Radio from '../../components/Radio.vue'
// import DatepickerV2 from '../../components/DatepickerV2.vue'
import _ from 'lodash'
import base from '../../utils/base.js'
import YearPicker from "@/views/BIView/ProductSupply/OverseasCockpit/components/YearPicker";
import Panels from './components/Panels'
export default {
    mixins: [ base ],
    components: {
        // VirtualSelect,
        Table,
        Radio,
        // DatepickerV2,
        Title,
        // CopyBoard,
        YearPicker,
        Panels,
    },
    watch: {
        'titleBox.radio.model': {
            handler(val){
                if(val === '当月') this.dateV2.dayOrMonth = 1
                else if(val === '月度') this.dateV2.dayOrMonth = 2
            }
        },
        'titleBox.month': {
            handler(val){
                this.dateV2.day2 = val
            }
        },
        'titleBox.year': {
            handler(val){
                this.dateV2.month2 = val
            }
        },
        'dateV2.dayOrMonth': {
            handler(val) {
                if(val === 1) {
                    // this.getOvData()
                    this.getTableByDay()
                }else if(val === 2) {
                    this.getTableByMonth()
                }
            }
        },
        'dateV2.day2': {
            handler() {
                if(this.dateV2.dayOrMonth === 1) {
                    // this.getOvData()
                    this.getTableByDay()
                }
            }
        },
        month: {
            handler() {
                if(this.dateV2.dayOrMonth === 2) {
                    this.getTableByMonth()
                }
            }
        },
        'radio2.model': {
            handler() {
                if(this.dateV2.dayOrMonth === 1) {
                    this.handleData(1, this.ovDataData)
                    this.handleData(2, this.tableData)
                    this.handleData(3, this.tableData)
                }else if(this.dateV2.dayOrMonth === 2) {
                    this.handleData(4, this.table2Data)
                    this.handleData(5, this.table2Data)
                    this.handleData(6, this.table2Data)
                }
            }
        },
        SHOP_NAME: {
            handler(val, oval) {
                if(val.toString() === oval.toString()) return
                if(this.dateV2.dayOrMonth === 1) {
                    this.getTableByDay()
                }else if(this.dateV2.dayOrMonth === 2) {
                    this.getTableByMonth()
                }
            }
        },
    },
    computed: {
        month() {
            return this.dateV2.month1 + this.dateV2.month2
        }
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel1)
        this.getShopNameArr()
        if(this.dateV2.dayOrMonth === 1) {
            // this.getOvData()
            this.getTableByDay()
        }else if(this.dateV2.dayOrMonth === 2) {
            this.getTableByMonth()
        }
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
    },
    data() {
        let that = this
        return {
            titleBox: {
                radio: {
                    name: '',
                    arr: [
                        { label: '当月', value: '当月' },
                        { label: '月度', value: '月度' },
                    ],
                    model: '月度'
                },
                month: moment().format('YYYYMM'),
                year: moment().format('YYYY')
            },
            menuVisible: false,
            menuX: '0px',
            menuY: '0px',
            currentRow: '',
            // 店铺
            SHOP_NAME: [],
            SHOP_NAMEArr: [],
            echartModel1: {
                // legend: {
                //     icon: 'rect'
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    formatter: function(params, $index) {
                        let flag = that.radio2.model === 1 ? true : false
                        // 本期业绩flag
                        let flag1 = moment(moment(that.dateV2.month2).format('YYYY-') + params[0].data[3]).format('x') > moment(moment(new Date()).format('YYYY-MM')).format('x')
                        let fun = (num) => {
                            // let colors = ['#2680eb', '#cce0e9']
                            let colors = ['#2680eb', '#f3f5f9']
                            return `<div style="border-radius: 5px;width: 10px;height: 10px;background: ${colors[num]};display: inline-block;margin: 1px 5px 1px 0"></div>`
                        }
                        let div1 = fun(0), div2 = fun(1)
                        let str,str1
                        if(that.dateV2.dayOrMonth === 1) {
                            str = `统计年月：${params[0].data[3]}<br/>支付目标：${that.handleNumV2(1, params[0].data[2])}<br/>支付业绩：${that.handleNumV2(1, params[0].data[1])}`
                            str1 = `统计年月：${params[0].data[3]}<br/>发货目标：${that.handleNumV2(1, params[0].data[2])}<br/>发货业绩：${that.handleNumV2(1, params[0].data[1])}`
                        }else if(that.dateV2.dayOrMonth === 2) {
                            str = `统计年月：${moment(that.dateV2.month2).format('YYYY-') + params[0].axisValue}<br/>${div1}支付业绩：${flag1 ? '--' : that.handleNumV2(1, params[0].data[1])}<br/>${div2}同期业绩：${that.handleNumV2(1, params[0].data[2])}`
                            str1 = `统计年月：${moment(that.dateV2.month2).format('YYYY-') + params[0].axisValue}<br/>${div1}发货业绩：${flag1 ? '--' : that.handleNumV2(1, params[0].data[1])}<br/>${div2}同期业绩：${that.handleNumV2(1, params[0].data[2])}<br/>`
                        }
                        // let str = `统计年月：${params.data[3]}<br/>支付目标：${that.handleNum(1, params.data[2])}<br/>支付业绩：${that.handleNum(1, params.data[1])}`
                        // let str1 = `统计年月：${params.data[3]}<br/>发货目标：${that.handleNum(1, params.data[2])}<br/>发货业绩：${that.handleNum(1, params.data[1])}`
                        return flag ? str : str1

                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ccc',
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
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
                            formatter: (value) => {
                                if(that.dateV2.dayOrMonth === 1) return value
                                else return value < 10 ? value.replace('0','') + '月' : value + '月'
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
                            formatter: (value) => {
                                return (value / 10000).toString().toLocaleString() + '万'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '本期业绩',
                        type: 'bar',
                        barWidth: '20',
                        data: [],
                        itemStyle: {
                            color: function(params) {
                                let color = ['#00a854', '#ff5953', '#5b8ff9']
                                // 2 目标 1 业绩
                                if(params.data[2] === 0 || params.data[2] === null || params.data[2] === '--') return color[2]
                                let index = params.data[1] - params.data[2] >= 0 ? 1 : 0
                                return color[index]
                            },
                            barBorderRadius: [10, 10, 0, 0]
                        },
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 2,
                    },
                    {
                        name: '同期业绩',
                        type: 'line',
                        barWidth: '20',
                        data: [],
                        itemStyle: {
                            color: function(params) {
                                let color = ['#ff5953', '#00a854']
                                return color[params.dataIndex % 2 === 0 ? '0' : '1']
                            }
                        },
                        label: {
                            show: false,
                            position: 'top'
                        },
                        areaStyle: {
                            color: '#f3f5f9',
                            opacity: 1
                        },
                        smooth: true,
                        lineStyle: {
                            color: 'transparent'
                        },
                        symbol: 'none',
                        z: 1,
                    },
                    // 业绩
                    // {
                    //     name: '1',
                    //     type: 'line',
                    //     barWidth: '20',
                    //     data: [],
                    //     label: {
                    //         show: false,
                    //         position: 'top'
                    //     },
                    //     z: 2,
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
                    //     smooth: true
                    // },
                    // // 目标
                    // {
                    //     name: '2',
                    //     type: 'line',
                    //     barWidth: '20',
                    //     data: [],
                    //     label: {
                    //         show: false,
                    //         position: 'top'
                    //     },
                    //     z: 1,
                    //     smooth: true,
                    //     symbol: 'none',
                    //     itemStyle: {
                    //         color: '#cce0e9'
                    //     },
                    //     lineStyle: {
                    //         color: '#cce0e9',
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
                ]
            },
            echart1: null,
            radio2: {
                name: '口径',
                arr: [
                    { label: '支付口径', value: 1 },
                    { label: '发货口径', value: 2 },
                ],
                model: 1
            },
            dateV2: {
                dayOrMonth: 2,
                day2: moment().format('YYYYMM'),
                monthType: 3,
                // month1: moment(new Date()).format('YYYY') + '01',
                month2: moment().format('YYYY'),
            },
            table: {
                type: 2,
                labelData: ['日期','支付目标', '支付业绩', '达成率'],
                tableData: [],
                index: '0A',
            },
            table1: {
                type: 2,
                labelData: ['日期','支付目标', '支付业绩', '达成率'],
                tableData: [],
                index: '0A',
            },
            tableData: [],
            table2: {
                type: 2,
                labelData: [],
                tableData: [],
                index: '0B'
            },
            table2Data: [],
            // 业绩概览数据
            ovData: {
                v1: '--',
                v2: '--',
                v3: '--',
                v4: '--',
                v5: '--',
                v6: '--',
            },
            // 月业绩概览
            ovData2: {
                v1: '--',
                v2: '--',
                v3: '--',
            }
        }
    },
    methods: {
        clickPanel(val){
            if(val === 'circle') this.SHOP_NAME = []
            else this.SHOP_NAME = [val]
        },
        handleColor(val) {
            if(val === 0 || val === null || val === '--') return
            if(val >= 1) return 'red'
            else return 'green'
        },
        handleNumV2(type, val) {
            if(val === 0 || val === null || val === '--') return '--'
            if(type === 4) return this.handleNum(type,val).toLocaleString() + '万'
            return this.handleNum(type,val)
        },
        async getShopNameArr() {
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_src')
            this.SHOP_NAMEArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.SHOP_CHNL))))
        },
        // 获取日-业绩概览 上方
        // async getOvData() {
        //     let query = {
        //         MDATE: this.dateV2.day2
        //     }
        //     let res =  await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_ov',query)
        //     let {data} = {...res}
        //     this.ovDataData = data.concat()
        //     this.handleData(1, data)
        // },
        // 获取日-table 下方  柱状图 中间
        async getTableByDay() {
            let query = {
                MDATE: this.dateV2.day2
            }
            this.SHOP_NAME.length ? query.SHOP_CHNL = this.SHOP_NAME.toString() : ''
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_d',query)
            let {data} = {...res}
            // 同一个月的时间
            data.sort((a, b) => a.TDATE_DAY - b.TDATE_DAY)
            this.tableData = data.concat()
            this.handleData(2, data)
            this.handleData(3, data)
        },
        // 获取月-table 下方 柱状图 中间
        async getTableByMonth() {
            let query = {
                START_TIME: this.dateV2.month2 + '01',
                END_TIME: this.dateV2.month2 + '12'
            }
            this.SHOP_NAME.length ? query.SHOP_CHNL = this.SHOP_NAME.toString() : ''
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_m',query)
            let {data} = {...res}
            // 同一个月的时间
            this.table2Data = data.concat()
            this.handleData(4, data)
            this.handleData(5, data)
            this.handleData(6, data)
        },
        // 1 日-上方概览 2 日-下方table 3 日-中间echart 4 月-上方概览 5 月-下方table 6 月-中间echart
        handleData(type, source) {
            if(type === 1) {
                // 清空
                for(let i = 0; i < 6; i++) {
                    this.ovData['v' + (i + 1)] = '--'
                }
                if(!source.length) return
                if(this.radio2.model === 1){
                    this.ovData.v1 = source[0].TOT_PAY_TGT
                    this.ovData.v2 = source[0].PTD_PAY_AMT
                    this.ovData.v3 = source[0].TOT_PAY_RATE
                    this.ovData.v4 = source[0].PTD_PAY_TGT
                    this.ovData.v5 = source[0].PTD_PAY_AMT
                    this.ovData.v6 = source[0].PTD_PAY_RATE
                }else if(this.radio2.model === 2){
                    this.ovData.v1 = source[0].TOT_DEV_TGT
                    this.ovData.v2 = source[0].PTD_DEV_AMT
                    this.ovData.v3 = source[0].TOT_DEV_RATE
                    this.ovData.v4 = source[0].PTD_DEV_TGT
                    this.ovData.v5 = source[0].PTD_DEV_AMT
                    this.ovData.v6 = source[0].PTD_DEV_RATE
                }
            }
            else if(type === 2) {
                // 清空
                if(this.radio2.model === 1){
                    this.table.labelData = ['日期', '支付目标', '支付业绩', '达成率']
                    this.table1.labelData = ['日期', '支付目标', '支付业绩', '达成率']
                }
                else if(this.radio2.model === 2){
                    this.table.labelData = ['日期', '发货目标', '发货业绩', '达成率']
                    this.table1.labelData = ['日期', '发货目标', '发货业绩', '达成率']
                }
                this.table.tableData = []
                this.table1.tableData = []
                let numV = moment(this.dateV2.day2).format('MM') === '02' ? 15 : 16
                for(let i = 0; i < numV; i++) {
                    this.table.tableData.push(['/', '/', '/', '/'])
                    this.table1.tableData.push(['/', '/', '/', '/'])
                }
                if(source.length <= 1) return
                let keys = this.radio2.model === 1 ? ['TDATE_DAY', 'PTD_PAY_TGT', 'PTD_PAY_AMT'] : ['TDATE_DAY', 'PTD_DEV_TGT', 'PTD_DEV_AMT']
                let arr = source.filter(_ => _.TDATE_DAY !== '合计')
                arr = arr.map(item => {
                    return [
                        item[keys[0]],
                        item[keys[1]],
                        item[keys[2]],
                        // 分母不正常 或 分母正常 分子为null
                        (item[keys[1]] === null || item[keys[1]] === 0 || (item[keys[1]] !== null || item[keys[1]] !== 0) && item[keys[2]] === null) ? '--' : item[keys[2]] / item[keys[1]]
                    ]
                })
                this.table.tableData = arr.slice(0, numV)
                if(arr.length <= numV) {
                    let num1 = numV - arr.length
                        for(let i = 0; i < num1; i++) {
                        this.table.tableData.push(['/', '/', '/', '/'])
                    }
                }
                this.table1.tableData = arr.slice(numV, arr.length)
                if(arr.length > numV) {
                    let num = 2 * numV - arr.length
                    for(let i = 0; i < num; i++) {
                        this.table1.tableData.push(['/', '/', '/', '/'])
                    }
                }else {
                    for(let i = 0; i < numV; i++) {
                        this.table1.tableData.push(['/', '/', '/', '/'])
                    }
                }
            }
            else if(type === 3) {
                // 清空
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel1)
                this.echart1.xAxis[0].data = []
                this.echart1.legend = null
                this.echart1.series = [
                    {
                        name: '1',
                        type: 'bar',
                        barWidth: '20',
                        data: [],
                        itemStyle: {
                            color: function(params) {
                                let color = ['#00a854', '#ff5953', '#5b8ff9']
                                // 2 目标 1 业绩
                                if(params.data[2] === 0 || params.data[2] === null || params.data[2] === '--') return color[2]
                                let index = params.data[1] - params.data[2] >= 0 ? 1 : 0
                                return color[index]
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
                        name: '2',
                        type: 'line',
                        barWidth: '20',
                        data: [],
                        // itemStyle: {
                        //     color: function(params) {
                        //         let color = ['#ff5953', '#00a854']
                        //         return color[params.dataIndex % 2 === 0 ? '0' : '1']
                        //     }
                        // },
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 1,
                        // areaStyle: {
                        //     color: '#f3f5f9',
                        //     opacity: 1
                        // },
                        smooth: true,
                        // lineStyle: {
                        //     color: 'transparent'
                        // },
                        symbol: 'none',
                        itemStyle: {
                            color: '#cce0e9'
                        },
                        lineStyle: {
                            // color: '#cce0e9',
                            color: '#f3f5f9',
                            width: 1.5,
                        },
                        areaStyle: {
                            // color: new graphic.LinearGradient(0, 0, 0, 1, [
                            //     {
                            //     offset: 0,
                            //     color: '#cce0e9'
                            //     },
                            //     {
                            //     offset: 1,
                            //     color: '#cce0e900'
                            //     }
                            // ])
                            color: '#f3f5f9',
                            opacity: 1,
                        },
                    
                    },
                ]
                this.echart1.series[0].data = []
                this.echart1.series[1].data = []
                if(source.length <= 1) return
                let arr = source.filter(_ => _.TDATE_DAY !== '合计')
                // 1支付 2发货
                let keys = this.radio2.model === 1 ? ['TDATE', 'PTD_PAY_AMT', 'PTD_PAY_TGT'] : ['TDATE', 'PTD_DEV_AMT', 'PTD_DEV_TGT']
                // x轴
                this.echart1.xAxis[0].data = Object.freeze(Array.from(new Set(arr.map(_ => moment(_.TDATE).format('DD')))))
                // bar
                this.echart1.series[0].data = arr.map(_ => {
                    return [
                        moment(_[keys[0]]).format('DD'),
                        _[keys[1]],
                        _[keys[2]],
                        moment(_[keys[0]]).format('YYYY-MM-DD')
                    ]
                })
                // line 面积
                this.echart1.series[1].data = arr.map(_ => {
                    return [
                        moment(_[keys[0]]).format('DD'),
                        _[keys[2]]
                    ]
                })
            }
            else if(type === 4) {
                let obj = source.filter(_ => _.MDATE_MONTH === '合计')[0]
                for(let i = 0; i < 6; i++) {
                    this.ovData2['v' + (i + 1)] = '--'
                }
                if(!source.length) return
                if(this.radio2.model === 1){
                    this.ovData2.v1 = obj.PTD_PAY_TGT
                    this.ovData2.v2 = obj.PTD_PAY_AMT
                    this.ovData2.v3 = (obj.PTD_PAY_TGT === null || obj.PTD_PAY_TGT === 0 || (obj.PTD_PAY_TGT !== null || obj.PTD_PAY_TGT !== 0) && obj.PTD_PAY_AMT == null) ? '--' : obj.PTD_PAY_AMT / obj.PTD_PAY_TGT
                }else if(this.radio2.model === 2){
                    this.ovData2.v1 = obj.PTD_DEV_TGT
                    this.ovData2.v2 = obj.PTD_DEV_AMT
                    this.ovData2.v3 = (obj.PTD_DEV_TGT === null || obj.PTD_DEV_TGT === 0 || (obj.PTD_DEV_TGT !== null || obj.PTD_DEV_TGT !== 0) && obj.PTD_DEV_AMT == null) ? '--' : obj.PTD_DEV_AMT / obj.PTD_DEV_TGT
                }
            }
            else if(type === 5) {
                let flag = this.radio2.model === 1 ? true : false
                // 清空
                // this.table2.labelData = ['日期', flag ? '支付目标' : '发货目标', flag ? '支付业绩' : '发货业绩', '完成率']
                // this.table2.labelData = ['指标', '同期增幅(%)', '同期增额(¥)', flag ? '支付业绩' : '发货业绩', flag ? '支付目标' : '发货目标',  '达成率']
                if(flag) this.table2.labelData = ['指标', '支付目标', '支付业绩', '达成率', '同期增额', '业绩同比']
                else if(!flag) this.table2.labelData = ['指标', '发货目标', '发货业绩', '达成率', '同期增额', '业绩同比']
                this.table2.tableData = [
                    ['合计', '--', '--', '--', '--', '--']
                ]
                if(source.length <= 1) return
                let keys
                if(flag) keys = ['MDATE_MONTH', 'PTD_PAY_TGT', 'PTD_PAY_AMT', 'PTD_PAY_DIFF', 'AGO_PAY_RATE']
                else if(!flag) keys = ['MDATE_MONTH', 'PTD_DEV_TGT', 'PTD_DEV_AMT', 'PTD_DEV_DIFF', 'AGO_DEV_RATE']
                let arr = source.filter(_ => _.MDATE_MONTH !== '合计')
                arr.sort((a, b) => a.MDATE - b.MDATE)
                let computeFun = function(v1, v2, type = 'reach') {
                    if(type === 'reach') {
                        if(v1 === null || v2 === null || v2 === 0 || v1 === undefined || v2 === undefined) return null
                        else return v1 / v2
                    }
                    else if(type === 'diff') {
                        if(v1 === null || v2 === null || v1 === undefined || v2 === undefined) return null
                        else return v1 - v2
                    }
                    else if(type === 'YOY') {
                        if(v1 === null || v2 === null || v1 === undefined || v2 === undefined || v2 === 0) return null
                        else return (v1 - v2) / v2
                    }
                }
                arr = arr.map(item => {
                    return [
                        moment(item[keys[0]]).format('M月'),
                        item[keys[1]],
                        item[keys[2]],
                        computeFun(item[keys[2]], item[keys[1]]),
                        item[keys[3]],
                        moment(item.MDATE_MONTH).format('YYYYMM') < moment().format('YYYYMM') ? item[keys[4]] : null,
                    ]
                })
                let computeDiff = {}
                let target = []
                if(this.dateV2.month2 === moment().format('YYYY')) {
                    target = source.filter(_ => _.MDATE < moment().format('YYYYMM') && _.MDATE_MONTH !== '合计')
                }
                else target = source.filter(_ => _.MDATE_MONTH !== '合计')
                computeDiff.pay_amt = target.map(_ => _.PTD_PAY_AMT).filter(_ => ![null, undefined].includes(_)).reduce((a, b) => a + b, 0)
                computeDiff.pay_amt_ago = target.map(_ => _.AGO_PAY_AMT).filter(_ => ![null, undefined].includes(_)).reduce((a, b) => a + b, 0)
                computeDiff.dev_amt = target.map(_ => _.PTD_DEV_AMT).filter(_ => ![null, undefined].includes(_)).reduce((a, b) => a + b, 0)
                computeDiff.dev_amt_ago = target.map(_ => _.AGO_DEV_AMT).filter(_ => ![null, undefined].includes(_)).reduce((a, b) => a + b, 0)
                computeDiff.PTD_PAY_DIFF = computeFun(computeDiff.pay_amt, computeDiff.pay_amt_ago, 'diff')
                computeDiff.AGO_PAY_RATE = computeFun(computeDiff.pay_amt, computeDiff.pay_amt_ago, 'YOY')
                computeDiff.PTD_DEV_DIFF = computeFun(computeDiff.dev_amt, computeDiff.dev_amt_ago, 'diff')
                computeDiff.AGO_DEV_RATE = computeFun(computeDiff.dev_amt, computeDiff.dev_amt_ago, 'YOY')
                // 合计放头一列
                let sum = source.filter(_ => _.MDATE_MONTH === '合计')[0]
                arr.unshift([
                    '合计',
                    sum[keys[1]],
                    sum[keys[2]],
                    computeFun(sum[keys[2]], sum[keys[1]]),
                    computeDiff[keys[3]],
                    computeDiff[keys[4]],
                    // (sum[keys[4]] === null || sum[keys[4]] === 0 || (sum[keys[4]] !== null || sum[keys[4]] !== 0) && sum[keys[3]] === null) ? '--' : sum[keys[3]] / sum[keys[4]] >= 1 ? '是' : '否'
                ])
                this.table2.tableData = arr.concat()
            }
            else if(type === 6) {
                // 清空
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel1)
                this.echart1.legend = {
                    icon: 'circle',
                    itemWidth: 14,
                    selectedMode: false
                }
                this.echart1.series = [
                    // 业绩
                    {
                        name: '本期业绩',
                        type: 'line',
                        barWidth: '20',
                        data: [],
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 2,
                        itemStyle: {
                            color: '#2680eb'
                        },
                        lineStyle: {
                            color: '#2680eb',
                            width: 1.5
                        },
                        areaStyle: {
                            color: new graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                offset: 0,
                                color: '#2680eb'
                                },
                                {
                                offset: 1,
                                color: '#2680eb00'
                                }
                            ])
                        },
                        smooth: true,
                        // symbol: 'none'
                    },
                    // 
                    {
                        name: '同期业绩',
                        type: 'line',
                        barWidth: '20',
                        data: [],
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 1,
                        smooth: true,
                        symbol: 'none',
                        itemStyle: {
                            // color: '#f3f5f9'
                            color: '#dfdfdf'
                        },
                        lineStyle: {
                            // color: '#cce0e9',
                            // color: '#f3f5f9',
                            color: '#dfdfdf',
                            width: 1.5,
                        },
                        areaStyle: {
                            // color: new graphic.LinearGradient(0, 0, 0, 1, [
                            //     {
                            //     offset: 0,
                            //     color: '#cce0e9'
                            //     },
                            //     {
                            //     offset: 1,
                            //     color: '#cce0e900'
                            //     }
                            // ])
                            color: '#f3f5f9',
                            opacity: 1,
                        },
                    },
                ]
                this.echart1.xAxis[0].data = []
                this.echart1.series[0].data = []
                this.echart1.series[1].data = []
                if(source.length <= 1) return
                let arr = source.filter(_ => _.MDATE_MONTH !== '合计').sort((a, b) => a.MDATE - b.MDATE)
                // 1支付 2发货
                // let keys = this.radio2.model === 1 ? ['MDATE_MONTH', 'PTD_PAY_AMT', 'PTD_PAY_TGT'] : ['MDATE_MONTH', 'PTD_DEV_AMT', 'PTD_DEV_TGT']
                let keys = this.radio2.model === 1 ? ['MDATE_MONTH', 'PTD_PAY_AMT', 'AGO_PAY_AMT'] : ['MDATE_MONTH', 'PTD_DEV_AMT', 'AGO_DEV_AMT']
                // x轴
                this.echart1.xAxis[0].data = Object.freeze(Array.from(new Set(arr.map(_ => moment(_.MDATE_MONTH).format('MM')))))
                // bar
                this.echart1.series[0].data = arr.map(_ => {
                    // return moment(_[keys[0]]).format('x') > moment(moment(new Date()).format('YYYY-MM')).format('x') ? [moment(_[keys[0]]).format('MM')] :[
                    return [
                        moment(_[keys[0]]).format('MM'),
                        moment(_[keys[0]]).format('x') > moment(moment(new Date()).format('YYYY-MM')).format('x') ? null : _[keys[1]],
                        _[keys[2]],
                        moment(_[keys[0]]).format('MM')
                    ]
                })
                // line 面积
                this.echart1.series[1].data = arr.map(_ => {
                    return [
                        moment(_[keys[0]]).format('MM'),
                        _[keys[2]],
                        _[keys[1]]
                    ]
                })
            }
        }
    }
}
</script>

<style lang='scss' scoped>
@import '../../assets/styles.scss';
.Comp1{
    // /deep/ .ant-radio-wrapper{
    //     width: 92px;
    // }
    // /deep/ .custom-checkbox-label{
    //     line-height: 30px;
    // }
    // /deep/ .custom-checkbox-label:before{
    //     margin-top: 8px;
    // }
    // /deep/ .custom-checkbox-label:after{
    //     top: 10px;
    // }
    flex: 1;
    overflow: hidden;
    padding: 10px 20px;
    // display: flex;
    // flex-direction: column;
    .header{
        display: flex;
        justify-content: space-between;
        width: 100%;
        // margin-top: 10px;
        .data{
            width: 32%;
            display: flex;
            justify-content: space-between;
            position: relative;
            .left, .right{
                .line{
                    display: flex;
                    justify-content: space-between;
                    margin: 12px 0 0;
                    .label{
                        margin-right: 40px;
                        line-height: 12px;
                        font-size: 12px;
                    }
                    .label::before{
                        display: inline-block;
                        content: "";
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background: rgba(0, 0, 0, 0.65);
                        margin: 0 10px 2px 0;
                    }
                    .value{
                        line-height: 12px;
                        font-size: 12px;
                        cursor: text;
                    }
                    .red{
                        color: $red
                    }
                    .green{
                        color: $green
                    }
                }
                .line:nth-child(1) {
                    margin: 10px 0 0;
                }
            }
            .middle{
                width: 1px;
                padding: 10px 0;
                div{
                    height: 100%;
                    background: #ccc;
                }
            }
            .selectMenu{
                position: absolute;
                background: #fff;
                border-radius: 2px;
                border: 1px solid #ccc;
                z-index: 2;
                .item{
                    white-space: nowrap;
                    cursor: pointer;
                    padding: 5px 20px;
                    font-size: 12px;
                    color: #666;
                }
                .item:hover{
                    background: #f3f3f3;
                }
            }
        }
        .select{
            width: 47%;
            justify-content: space-between;
            align-items: center;
            .line1 {
                display: flex;
                height: 32px;
                justify-content: flex-end;
            }
        }
    }
    .panels{
        //height: 120px;
    }
    .myecharts{
        // height: 260px;
        width: 100%;
        margin-top: 10px;
        margin-bottom: 0px
    }
    .table1 /deep/ .row {
        line-height: 25px;
        height: 25px;
    }
    .table2{
        //margin: 20px 0;
        /deep/ .row {
            line-height: 32px;
            height: 32px;
        }
    }
}
</style>