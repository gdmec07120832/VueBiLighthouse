<!--
 * @Author: 黄浩
 * @Date: 2022-01-04 17:00:10
 * @LastEditTime: 2022-01-22 15:39:24
 * @LastEditors: Please set LastEditors
 * @Descripttion: 业绩概览
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp1\index.vue
-->
<template>
    <div class="Comp1">
        <div class="header">
            <div class="data" v-if="dateV2.dayOrMonth === 1">
                <div class="left">
                    <div class="line">
                        <div class="label">{{radio2.model === 1 ? '日累计支付目标' : '日累计发货目标'}}</div>
                        <div class="value">{{this.handleNum(1, ovData.v1)}}</div>
                    </div>
                    <div class="line">
                        <div class="label">{{radio2.model === 1 ? '日累计支付业绩' : '日累计发货业绩'}}</div>
                        <div class="value">{{this.handleNum(1, ovData.v2)}}</div>
                    </div>
                    <div class="line">
                        <div class="label">{{radio2.model === 1 ? '日累计支付达成' : '日累计发货达成'}}</div>
                        <div class="value">{{this.handleNum(2, ovData.v3)}}</div>
                    </div>
                </div>
                <div class="middle">
                    <div></div>
                </div>
                <div class="right">
                    <div class="line">
                        <div class="label">{{radio2.model === 1 ? '月累计支付目标' : '月累计发货目标'}}</div>
                        <div class="value">{{this.handleNum(1, ovData.v4)}}</div>
                    </div>
                    <div class="line">
                        <div class="label">{{radio2.model === 1 ? '月累计支付业绩' : '月累计发货业绩'}}</div>
                        <div class="value">{{this.handleNum(1, ovData.v5)}}</div>
                    </div>
                    <div class="line">
                        <div class="label">{{radio2.model === 1 ? '月累计支付达成' : '月累计发货达成'}}</div>
                        <div class="value">{{this.handleNum(2, ovData.v6)}}</div>
                    </div>
                </div>
            </div>
            <div class="data" v-else></div>
            <div class="select">
                <div class="line1">
                    <DatepickerV2 v-bind="dateV2"
                    :dayOrMonth.sync="dateV2.dayOrMonth"
                    :day2.sync="dateV2.day2"
                    :month1.sync="dateV2.month1"
                    :month2.sync="dateV2.month2"
                    />
                </div>
                <div class="line1" style="margin-top: 10px;">
                    <Radio v-bind="radio2" :model.sync="radio2.model"/>
                    <virtual-select style="width: 334px;margin-left: 10px;margin-right: 0"
                        v-model="SHOP_NAME"
                        :options="SHOP_NAMEArr.map((_) => ({ label: _ }))"
                        label="店铺"
                    ></virtual-select>
                </div>
            </div>
        </div>
        <v-chart ref="echart1" style="flex: 2;height: 250px" class="myecharts" :options="echart1" autoresize></v-chart>
        <Table v-if="dateV2.dayOrMonth === 1" v-bind="table" style="margin-top: 10px"/>
        <Table v-if="dateV2.dayOrMonth === 1" style="margin: 10px 0;" v-bind="table1"/>
        <Table v-if="dateV2.dayOrMonth === 2" v-bind="table2" class="table2" />
    </div>
</template>

<script>
import moment from 'moment'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
import Table from '../../components/Table.vue'
import Radio from '../../components/Radio.vue'
import DatepickerV2 from '../../components/DatepickerV2.vue'
import _ from 'lodash'
import base from '../../utils/base.js'
export default {
    mixins: [ base ],
    components: {
        VirtualSelect,
        Table,
        DatepickerV2,
        Radio,
    },
    watch: {
        SHOP_NAME: {
            handler() {
                if(this.dateV2.dayOrMonth === 1){
                    this.getDataByDay()
                }else if(this.dateV2.dayOrMonth === 2) {
                    this.getDataByMonth()
                }
            }
        },
        'radio2.model': {
            handler() {
                this.handleData(1, this.ovDataData)
                if(this.dateV2.dayOrMonth === 1){
                    this.getDataByDay()
                }else if(this.dateV2.dayOrMonth === 2){
                    this.getDataByMonth()
                }
            }
        },
        'dateV2.dayOrMonth': {
            handler(val) {
                if(val === 1){
                    this.getData()
                    this.getSHOP_NAMEArr()
                    this.getDataByDay()
                }else if(val === 2) {
                    this.dateV2.month1 = (moment(new Date()).format('YYYYMM') - 100).toString()
                    this.dateV2.month2 = moment(new Date()).format('YYYYMM')
                    this.getSHOP_NAMEArr()
                    this.getDataByMonth()
                }
            }
        },
        month: {
            handler() {
                this.getSHOP_NAMEArr()
                this.getDataByMonth()
            }
        },
        'dateV2.day2': {
            handler() {
                this.getDataByDay()
            }
        }
    },
    computed: {
        month() {
            return this.dateV2.month1 + this.dateV2.month2
        }
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel1)
        this.getSHOP_NAMEArr()
        this.getDataByDay()
        this.getData()
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
    },
    data() {
        this.getSHOP_NAMEArr = _.debounce(this.getSHOP_NAMEArr,100,{
            leading: false,
            trailing: true
        })
        this.getDataByDay = _.debounce(this.getDataByDay,100,{
            leading: false,
            trailing: true
        })
        let that = this
        return {
            // 店铺
            SHOP_NAME: [],
            SHOP_NAMEArr: [],
            echartModel1: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: function(params) {
                        let str = ''
                        if(that.dateV2.dayOrMonth === 1) {
                            str += `统计日期：${moment(that.dateV2.day2).format('YYYY-MM')}-${params[0].axisValue}<br/>`
                        }else if(that.dateV2.dayOrMonth === 2) {
                            str += `统计年月：${params[0].axisValue}<br/>`
                        }
                        params.forEach(item => {
                            str += item.seriesName + '：' + item.value + '<br/>'
                        })
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
                        }
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'bar',
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
                        z: 2
                    },
                    {
                        name: '',
                        type: 'line',
                        barWidth: '30%',
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
                        z: 2,
                        areaStyle: {
                            color: '#f3f5f9'
                        },
                        lineStyle: {
                            color: 'transparent'
                        },
                        symbol: 'none'
                    },
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
                dayOrMonth: 1,
                day2: moment(new Date()).format('YYYYMM'),
                monthType: 2,
                month1: moment(new Date()).format('YYYYMM'),
                month2: moment(new Date()).format('YYYYMM'),
            },
            table: {
                type: 2,
                labelData: [],
                tableData: [],
                index: 0,
            },
            table1: {
                type: 2,
                labelData: [],
                tableData: [],
                index: 0,
            },
            table2: {
                type: 2,
                labelData: [],
                tableData: [],
                index: 0
            },
            // 业绩概览数据
            ovData: {
                v1: '',
                v2: '',
                v3: '',
                v4: '',
                v5: '',
                v6: ''
            }
        }
    },
    methods: {
        // 获取业绩概览
        async getData() {
            let query = {
                MDATE: this.dateV2.day2
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_ov',query)
            let {data} = {...res}
            this.ovDataData = data.concat()
            this.handleData(1, data)
        },
        // 获取店铺选项
        async getSHOP_NAMEArr() {
            if(this.dateV2.dayOrMonth === 1) {
                let query = {
                    MDATE: this.dateV2.day2
                }
                let res =  await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_d',query)
                this.SHOP_NAMEArr =  Array.from(new Set(res.data.map(_ => _.SHOP_NAME)))
                if(this.SHOP_NAMEArr.indexOf('合计') > -1) {
                    this.SHOP_NAMEArr.splice(this.SHOP_NAMEArr.indexOf('合计'),1)
                }
            }else if(this.dateV2.dayOrMonth === 2) {
                let query = {
                    START_TIME: this.dateV2.month1,
                    END_TIME: this.dateV2.month2,
                }
                let res =  await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_m',query)
                this.SHOP_NAMEArr =  Array.from(new Set(res.data.map(_ => _.SHOP_NAME)))
                if(this.SHOP_NAMEArr.indexOf('合计') > -1) {
                    this.SHOP_NAMEArr.splice(this.SHOP_NAMEArr.indexOf('合计'),1)
                }
            }
        },
        // 获取业绩概览-日
        async getDataByDay() {
            let query = {
                MDATE: this.dateV2.day2,
            }
            this.SHOP_NAME.length ? query.SHOP_NAME = this.SHOP_NAME.toString() : ''
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_d',query)
            let arr = {}
            res.data.forEach(item => {
                if(!Object.prototype.hasOwnProperty.call(arr, item.TDATE_DAY)) {
                    arr[item.TDATE_DAY] = []
                }
                arr[item.TDATE_DAY].push(item)
            })
            let newArr = []
            for(let key in arr) {
                let obj = {
                    MDATE: '',
                    TDATE_DAY: '',
                    PTD_PAY_TGT: 0,
                    PTD_DEV_TGT: 0,
                    PTD_PAY_AMT: 0,
                    PTD_DEV_AMT: 0
                }
                arr[key].forEach(item => {
                    obj.MDATE = item.MDATE
                    obj.TDATE_DAY = item.TDATE_DAY
                    obj.PTD_PAY_TGT += item.PTD_PAY_TGT * 1
                    obj.PTD_DEV_TGT += item.PTD_DEV_TGT * 1
                    obj.PTD_PAY_AMT += item.PTD_PAY_AMT * 1
                    obj.PTD_DEV_AMT += item.PTD_DEV_AMT * 1
                })
                newArr.push(obj)
            }
            newArr.sort((a,b) => {
                return a.TDATE_DAY - b.TDATE_DAY
            })
            newArr.forEach(item => {
                if(item.PTD_DEV_TGT === 0) item.PTD_DEV_RATE = 0
                else item.PTD_DEV_RATE = item.PTD_DEV_AMT / item.PTD_DEV_TGT
                if(item.PTD_PAY_TGT === 0) item.PTD_PAY_RATE = 0
                else item.PTD_PAY_RATE = item.PTD_PAY_AMT / item.PTD_PAY_TGT
            })
            this.echart1.xAxis[0].data = newArr.map(_ => _.TDATE_DAY)
            if(this.radio2.model === 1) {
                // 处理echart数据
                this.echart1.series[0].name = '支付业绩'
                this.echart1.series[0].data = newArr.map(_ => _.PTD_PAY_AMT)
                this.echart1.series[1].name = '支付目标'
                this.echart1.series[1].data = newArr.map(_ => _.PTD_PAY_TGT)
                // 处理table数据
                this.table.labelData = ['日期', '支付目标', '支付业绩', '日完成率']
                this.table.tableData = newArr.slice(0,16).map(_ => {
                    if((_.MDATE + '' + _.TDATE_DAY) > moment(new Date()).format('YYYYMMDD')) return [_.TDATE_DAY,'--', '--', '--']
                    let arr = []
                    arr.push(_.TDATE_DAY)
                    arr.push(_.PTD_PAY_TGT)
                    arr.push(_.PTD_PAY_AMT)
                    if(_.PTD_PAY_TGT === 0) arr.push(0)
                    else arr.push(_.PTD_PAY_AMT / _.PTD_PAY_TGT)
                    return arr
                })
                this.table1.labelData = ['日期', '支付目标', '支付业绩', '日完成率']
                this.table1.tableData = newArr.slice(16,newArr.length).map(_ => {
                    if((_.MDATE + '' + _.TDATE_DAY) > moment(new Date()).format('YYYYMMDD')) return [_.TDATE_DAY,'--', '--', '--']
                    let arr = []
                    arr.push(_.TDATE_DAY)
                    arr.push(_.PTD_PAY_TGT)
                    arr.push(_.PTD_PAY_AMT)
                    if(_.PTD_PAY_TGT === 0) arr.push(0)
                    else arr.push(_.PTD_PAY_AMT / _.PTD_PAY_TGT)
                    return arr
                })
                let length = 32 - newArr.length
                for(let i = 0; i < length; i++) {
                    this.table1.tableData.push(['--','--','--','--'])
                }
            }else if(this.radio2.model === 2) {
                // 处理echart数据
                this.echart1.series[0].name = '发货业绩'
                this.echart1.series[0].data = newArr.map(_ => _.PTD_DEV_AMT)
                this.echart1.series[1].name = '发货目标'
                this.echart1.series[1].data = newArr.map(_ => _.PTD_DEV_TGT)
                // 处理table数据
                this.table.labelData = ['日期', '发货目标', '发货业绩', '日完成率']
                this.table.tableData = newArr.slice(0,16).map(_ => {
                    if((_.MDATE + '' + _.TDATE_DAY) > moment(new Date()).format('YYYYMMDD')) return [_.TDATE_DAY,'--', '--', '--']
                    let arr = []
                    arr.push(_.TDATE_DAY)
                    arr.push(_.PTD_DEV_TGT)
                    arr.push(_.PTD_DEV_AMT)
                    if(_.PTD_DEV_TGT === 0) arr.push(0)
                    else arr.push(_.PTD_DEV_AMT / _.PTD_DEV_TGT)
                    return arr
                })
                this.table1.labelData = ['日期', '发货目标', '发货业绩', '日完成率']
                this.table1.tableData = newArr.slice(16,newArr.length).map(_ => {
                    if((_.MDATE + '' + _.TDATE_DAY) > moment(new Date()).format('YYYYMMDD')) return [_.TDATE_DAY,'--', '--', '--']
                    let arr = []
                    arr.push(_.TDATE_DAY)
                    arr.push(_.PTD_DEV_TGT)
                    arr.push(_.PTD_DEV_AMT)
                    if(_.PTD_DEV_TGT === 0) arr.push(0)
                    else arr.push(_.PTD_DEV_AMT / _.PTD_DEV_TGT)
                    return arr
                })
                let length = 32 - newArr.length
                for(let i = 0; i < length; i++) {
                    this.table1.tableData.push(['--','--','--','--'])
                }
            }
        },
        // 获取业绩概览-月
        async getDataByMonth() {
            let query = {
                START_TIME: this.dateV2.month1,
                END_TIME: this.dateV2.month2,
            }
            this.SHOP_NAME.length ? query.SHOP_NAME = this.SHOP_NAME.toString() : ''
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_perf_overview_m',query)
            res.data = res.data.filter(item => {
                return item.MDATE_MONTH !== '合计'
            })
            let arr = {}
            res.data.forEach(item => {
                if(!Object.prototype.hasOwnProperty.call(arr, item.MDATE)) {
                    arr[item.MDATE] = []
                }
                arr[item.MDATE].push(item)
            })
            let newArr = []
            for(let key in arr) {
                let obj = {
                    MDATE: '',
                    MDATE_MONTH: '',
                    PTD_PAY_TGT: 0,
                    PTD_DEV_TGT: 0,
                    PTD_PAY_AMT: 0,
                    PTD_DEV_AMT: 0
                }
                arr[key].forEach(item => {
                    obj.MDATE = item.MDATE
                    obj.MDATE_MONTH = item.MDATE_MONTH
                    obj.PTD_PAY_TGT += item.PTD_PAY_TGT * 1
                    obj.PTD_DEV_TGT += item.PTD_DEV_TGT * 1
                    obj.PTD_PAY_AMT += item.PTD_PAY_AMT * 1
                    obj.PTD_DEV_AMT += item.PTD_DEV_AMT * 1
                })
                newArr.push(obj)
            }
            newArr.sort((a,b) => {
                return a.MDATE - b.MDATE
            })
            newArr.forEach(item => {
                if(item.PTD_DEV_TGT === 0) item.PTD_DEV_RATE = 0
                else item.PTD_DEV_RATE = item.PTD_DEV_AMT / item.PTD_DEV_TGT
                if(item.PTD_PAY_TGT === 0) item.PTD_PAY_RATE = 0
                else item.PTD_PAY_RATE = item.PTD_PAY_AMT / item.PTD_PAY_TGT
            })
            this.echart1.xAxis[0].data = newArr.map(_ => _.MDATE_MONTH)
            if(this.radio2.model === 1) {
                // 处理echart
                this.echart1.series[0].name = '支付业绩'
                this.echart1.series[0].data = newArr.map(_ => _.PTD_PAY_AMT)
                this.echart1.series[1].name = '支付目标'
                this.echart1.series[1].data = newArr.map(_ => _.PTD_PAY_TGT)
                // 处理table数据
                this.table2.labelData = ['日期', '支付目标', '支付业绩', '完成率']
                this.table2.tableData = newArr.map(_ => {
                    let arr = []
                    arr.push(_.MDATE_MONTH)
                    arr.push(_.PTD_PAY_TGT)
                    arr.push(_.PTD_PAY_AMT)
                    if(_.PTD_PAY_TGT === 0) arr.push(0)
                    else arr.push(_.PTD_PAY_AMT / _.PTD_PAY_TGT)
                    return arr
                })
            }else if(this.radio2.model === 2) {
                // 处理echart数据
                this.echart1.series[0].name = '发货业绩'
                this.echart1.series[0].data = newArr.map(_ => _.PTD_DEV_AMT)
                this.echart1.series[1].name = '发货目标'
                this.echart1.series[1].data = newArr.map(_ => _.PTD_DEV_TGT)
                this.table2.labelData = ['日期', '发货目标', '发货业绩', '完成率']
                this.table2.tableData = newArr.map(_ => {
                    let arr = []
                    arr.push(_.MDATE_MONTH)
                    arr.push(_.PTD_DEV_TGT)
                    arr.push(_.PTD_DEV_AMT)
                    if(_.PTD_DEV_TGT === 0) arr.push(0)
                    else arr.push(_.PTD_DEV_AMT / _.PTD_DEV_TGT)
                    return arr
                })
            }
        },
        // 1 日-上方概览 2 日-下方table
        handleData(type, source) {
            if(type === 1) {
                if(this.radio2.model === 1){
                    this.ovData.v1 = source[0].TOT_PAY_TGT
                    this.ovData.v2 = source[0].TOT_PAY_RATE * source[0].TOT_PAY_TGT
                    this.ovData.v3 = source[0].TOT_PAY_RATE
                    this.ovData.v4 = source[0].PTD_PAY_TGT
                    this.ovData.v5 = source[0].PTD_PAY_RATE * source[0].PTD_PAY_TGT
                    this.ovData.v6 = source[0].PTD_PAY_RATE
                }else if(this.radio2.model === 2){
                    this.ovData.v1 = source[0].TOT_DEV_TGT
                    this.ovData.v2 = source[0].TOT_DEV_RATE * source[0].TOT_DEV_TGT
                    this.ovData.v3 = source[0].TOT_DEV_RATE
                    this.ovData.v4 = source[0].PTD_DEV_TGT
                    this.ovData.v5 = source[0].PTD_DEV_RATE * source[0].PTD_DEV_TGT
                    this.ovData.v6 = source[0].PTD_DEV_RATE
                }
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.Comp1{
    /deep/ .ant-radio-wrapper{
        width: 92px;
    }
    flex: 1;
    overflow: hidden;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    .header{
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 10px;
        .data{
            width: 40%;
            display: flex;
            justify-content: space-between;
            .left, .right{
                .line{
                    display: flex;
                    justify-content: space-between;
                    .label{
                        margin-right: 40px;
                        line-height: 24px;
                        font-size: 12px;
                    }
                    .value{
                        line-height: 24px;
                        font-size: 12px;
                    }
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
    .myecharts{
        height: 250px;
        width: 100%;
    }
    .table2{
        margin: 10px;
    }
}
</style>