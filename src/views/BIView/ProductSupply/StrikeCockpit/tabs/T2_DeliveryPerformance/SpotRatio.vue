<template>
    <div class="SpotRatio">
        <div class="selects" style="display: flex;align-items: center;">
            <div class="title_1">整体概况</div>
            <div style="flex: 1"></div>
            <!--            <Select v-for="(item, index) in selects" v-bind.sync="item" class="mr10" :key="index"/>-->
            <!-- <div class="text-xs text-black mr10">统计年份</div>
            <a-date-picker
            mode="year"
            format="YYYY年"
            valueFormat="YYYY"
            v-model="year"
            :allowClear="false"
            class="mr10"
            style="width: 150px"
            :open="openYear"
            @openChange="openChange"
            @panelChange="panelChange"
            /> -->
            <div class="ChoiceRight" style="margin-right: 10px;">
                <Select :label="'统计年份'" :value.sync="YearOPt.YearOn" :options="YearOPt.YearArray" 
                style="margin-top: -1px;" />
            </div>
            <virtual-select
                    style="width: 180px;margin-right: 20px"
                    v-model="selects[0].value"
                    :label="selects[0].label"
                    :options="selects[0].options.map((_) => ({ label: _ }))"
                    :allowShowClear="false"
            ></virtual-select>
            <virtual-select
                    style="width: 180px;margin-right: 20px"
                    v-model="selects[1].value"
                    :label="selects[1].label"
                    :options="selects[1].options.map((_) => ({ label: _ }))"
                    :allowShowClear="false"
            ></virtual-select>
            <virtual-select
                    style="width: 180px;margin-right: 0"
                    v-model="selects[2].value"
                    :label="selects[2].label"
                    :options="selects[2].options.map((_) => ({ label: _ }))"
                    :allowShowClear="false"
            ></virtual-select>
        </div>
        <div class="bottomBox mt20">
            <div class="left" style="position: relative">
                <div class="title_2" style="position: absolute;top: 0;left: 0;coloe: #666">当月发货比例</div>
                <v-chart ref="line" style="overflow: visible;" :options="doubleLine" autoresize/>
            </div>
            <div style="width: 50px"></div>
            <div class="right" style="position: relative">
                <div class="title_2" style="position: absolute;top: 0;left: 0;coloe: #666">当月发货金额</div>
                <v-chart ref="bar" style="overflow: visible;" :options="doubleBar" autoresize/>
            </div>
        </div>
<!--        <div class="title_2 mt20">当月发货明细</div>-->
        <Table class="table mt10" v-bind="table"/>
    </div>
</template>

<script>
import Select from '../../components/Select'
import Table from '../../components/TableOld'
import base from '../../utils/base.js'
import _ from 'lodash'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import moment from 'moment'
import echartStyle from "../../utils/echartStyle";
export default {
    mixins: [ base ],
    components: {
        Select,
        Table,
        VirtualSelect,
    },
    async created() {
        this.doubleLine = await this.createLine({
            tooltipFormatter: ['percent', 'percent'],
            xAxisLabelFormatter: 'normal',
            yAxisLabelFormatter: 'percent_not_dot'
        })
        // this.doubleLine.color = ['#6395f9', '#DFDFDF']
        // this.doubleLine.series[0].lineStyle = {color: '#6395f9'}
        // this.doubleLine.series[0].itemStyle = {color: '#6395f9'}
        // this.doubleLine.series[1].lineStyle = {color: '#DFDFDF'}
        // this.doubleLine.series[1].itemStyle = {color: '#DFDFDF'}
        this.doubleLine.grid.top = 30
        this.doubleLine.xAxis[0].data = []
        this.doubleLine.series[0].name = ''
        this.doubleLine.series[0].data = []
        this.doubleLine.series[1].name = ''
        this.doubleLine.series[1].data = []
        this.doubleBar = await this.createDoubleBar({
            tooltipFormatter: ['round', 'round'],
            xAxisLabelFormatter: 'normal',
            yAxisLabelFormatter: 'tenThousand'
        })
        this.doubleBar.color = [echartStyle.thisYear, echartStyle.previousYear]
        this.doubleBar.grid.top = 30
        this.doubleBar.series.push(_.cloneDeep(this.doubleBar.series[0]))
        this.doubleBar.series[0].itemStyle.color = echartStyle.thisYear
        this.doubleBar.series[1].itemStyle.color = echartStyle.previousYear
        this.doubleBar.xAxis[0].data = []
        this.doubleBar.series[0].name = ''
        this.doubleBar.series[0].data = []
        this.doubleBar.series[0].label.show = false
        this.doubleBar.series[1].name = ''
        this.doubleBar.series[1].data = []
        this.doubleBar.series[1].label.show = false
        this.doubleBar.series[1].itemStyle.color = echartStyle.previousYear
        this.getOptions()
        this.getTable()
        this.getTrend()
    },
    watch: {
        year: {
            handler(){
                this.getTable()
                this.getTrend()
            }
        },
        'YearOPt.YearOn':{
            handler(){
                this.year = this.YearOPt.YearOn.replace(/[\u4e00-\u9fa5]/g,'');
            }
        },
        'selects.0.value': {
            handler(val, oval){
                let diff = []
                if(val.length > oval.length) {
                    diff = val.filter(_ => !oval.includes(_))
                }
                else if(oval.length > val.length) {
                    diff = oval.filter(_ => !val.includes(_))
                }
                if(diff.includes('全部') && val.length > oval.length){
                    if(oval.length > 0){
                        this.selects[0].value = ['全部']
                    }
                }
                else if(!diff.includes('全部') && val.length > oval.length){
                    this.selects[0].value = this.selects[0].value.filter(_ => _ !== '全部')
                }
                if(val.length === 0){
                    this.selects[0].value = ['全部']
                }
                let arr = this.allOptions.concat()
                if(val.toString() !== '全部') arr = arr.filter(_ => val.includes(_.CHNL_NAME))
                this.selects[1].options = Array.from(new Set(arr.map(_ => _.CHNL_TYPE)))
                if(this.selects[1].value.toString() !== '全部') arr = arr.filter(_ => this.selects[1].value.includes(_.CHNL_TYPE))
                this.selects[2].options = Array.from(new Set(arr.map(_ => _.SHOP_NAME)))
            }
        },
        'selects.1.value': {
            handler(val, oval){
                let diff = []
                if(val.length > oval.length) {
                    diff = val.filter(_ => !oval.includes(_))
                }
                else if(oval.length > val.length) {
                    diff = oval.filter(_ => !val.includes(_))
                }
                if(diff.includes('全部') && val.length > oval.length){
                    if(oval.length > 0){
                        this.selects[1].value = ['全部']
                    }
                }
                else if(!diff.includes('全部') && val.length > oval.length){
                    this.selects[1].value = this.selects[1].value.filter(_ => _ !== '全部')
                }
                if(val.length === 0){
                    this.selects[1].value = ['全部']
                }
                let arr = this.allOptions.concat()
                if(this.selects[0].value.toString() !== '全部') arr = arr.filter(_ => this.selects[0].value.includes(_.CHNL_NAME))
                if(this.selects[1].value.toString() !== '全部') arr = arr.filter(_ => this.selects[1].value.includes(_.CHNL_TYPE))
                this.selects[2].options = Array.from(new Set(arr.map(_ => _.SHOP_NAME)))
            }
        },
        'selects.2.value': {
            handler(val, oval){
                let diff = []
                if(val.length > oval.length) {
                    diff = val.filter(_ => !oval.includes(_))
                }
                else if(oval.length > val.length) {
                    diff = oval.filter(_ => !val.includes(_))
                }
                if(diff.includes('全部') && val.length > oval.length){
                    if(oval.length > 0){
                        this.selects[2].value = ['全部']
                    }
                }
                else if(!diff.includes('全部') && val.length > oval.length){
                    this.selects[2].value = this.selects[2].value.filter(_ => _ !== '全部')
                }
                if(val.length === 0){
                    this.selects[2].value = ['全部']
                }
            }
        },
        threeSelects: {
            handler(){
                this.getTable()
                this.getTrend()
            }
        }
    },
    computed: {
        threeSelects(){
            return this.selects[0].value.toString() + '&&' + this.selects[1].value.toString() + '&&' + this.selects[2].value.toString()
        }
    },
    data() {
        let year = moment().format('YYYY')
        return {
            openYear: false,
            year: year,
            YearOPt:{
                YearOn:moment().format('YYYY年'),
                YearArray:['2022年','2021年','2020年','2019年'],  
            },
            selects: [
                {
                    label: '渠道分类',
                    value: ['全部'],
                    options: [],
                },
                {
                    label: '渠道细分',
                    value: ['全部'],
                    options: [],
                },
                {
                    label: '店铺选择',
                    value: ['全部'],
                    options: [],
                }
            ],
            allOptions: [],
            table: {
                index: 'T2_DeliveryPerformance_SpotRatio',
                labelData: ['项目', '比例同比', '当月发货比例', '当月发货金额', '当月销售业绩'],
                tableData: [
                    ['年份', year + '年', year + '年', (year - 1) + '年', year + '年',(year - 1) + '年', year + '年', (year - 1) + '年'],
                    ['年累计', '/', '/', '/', '/', '/', '/', '/'],
                    ['当期累计', '/', '/', '/', '/', '/', '/', '/'],
                ]
            },
            doubleLine: null,
            doubleBar: null,
        }
    },
    methods: {
        openChange(status) {
            this.openYear =  status
        },
        panelChange(value){
            this.year = value.format('YYYY')
            this.openYear = false;
        },
        async getOptions(){
            let res = await this.$fetchSql('all_center', 'all_center_send_spot_src')
            let sortObj = {
                '全部': 0,
                '线上': 1,
                '线下': 2,
                '海外': 3,
                '其它': 4
            }
            let sortObj_1 = {
                '全部': 0,
                '线上平台': 1,
                '线上外包': 2,
                '线下直营': 3,
                '线下经销': 4,
                '线下家装': 5,
                '线下定制': 6,
                '线下拎包': 7,
                '海外B2B': 8,
                '其它': 9
            }
            res.data.sort((a, b) => {
                let a_i = 5, b_i = 5
                for(let key in sortObj){
                    if(a.CHNL_NAME.indexOf(key) > -1) a_i = sortObj[key]
                    if(b.CHNL_NAME.indexOf(key) > -1) b_i = sortObj[key]
                }
                return a_i - b_i
            })
            this.allOptions = res.data.concat()
            this.selects[0].options = await Array.from(new Set(res.data.map(_ => _.CHNL_NAME)))
            this.selects[0].options.unshift('全部')
            res.data.sort((a, b) => {
                let a_i = 10, b_i = 10
                for(let key in sortObj_1){
                    if(a.CHNL_TYPE.indexOf(key) > -1) a_i = sortObj_1[key]
                    if(b.CHNL_TYPE.indexOf(key) > -1) b_i = sortObj_1[key]
                }
                return a_i - b_i
            })
            this.selects[1].options = await Array.from(new Set(res.data.map(_ => _.CHNL_TYPE)))
            this.selects[1].options.unshift('全部')
            res.data.sort((a, b) => b.MTD_SEND_AMT - a.MTD_SEND_AMT)
            this.selects[2].options = await Array.from(new Set(res.data.map(_ => _.SHOP_NAME)))
            this.selects[2].options.unshift('全部')
        },
        async getTable(){
            let query = {
                YDATE: this.year
            }
            let {value:value0} = this.selects[0]
            let {value:value1} = this.selects[1]
            let {value:value2} = this.selects[2]
            if(value0.toString() !== '全部') query.CHNL_NAME = value0.toString()
            if(value1.toString() !== '全部') query.CHNL_TYPE = value1.toString()
            if(value2.toString() !== '全部') query.SHOP_NAME = value2.toString()
            let res = await this.$fetchSql('all_center', 'all_center_send_spot_dtl', query)
            this.handleData('table', res.data)
        },
        async getTrend(){
            let query = {
                YDATE: this.year
            }
            let {value:value0} = this.selects[0]
            let {value:value1} = this.selects[1]
            let {value:value2} = this.selects[2]
            if(value0.toString() !== '全部') query.CHNL_NAME = value0.toString()
            if(value1.toString() !== '全部') query.CHNL_TYPE = value1.toString()
            if(value2.toString() !== '全部') query.SHOP_NAME = value2.toString()
            let res = await this.$fetchSql('all_center', 'all_center_send_spot_trend', query)
            this.handleData('trend', res.data)
        },
        handleMonth(val){
            if(val < 10) return val.split('0')[1] + '月'
            else return val + '月'
        },
        handleData(type, source){
            if(type === 'table'){
                let arr = _.cloneDeep(source)
                this.table.tableData[0] = ['年份', this.year + '年', this.year + '年', (this.year - 1) + '年', this.year + '年',(this.year - 1) + '年', this.year + '年', (this.year - 1) + '年'],
                this.table.tableData = this.table.tableData.slice(0, 1).concat(
                    [
                        ['年累计', '/', '/', '/', '/', '/', '/', '/'],
                        ['当期累计', '/', '/', '/', '/', '/', '/', '/']
                    ]
                )
                if(!arr.length) return
                let yearSum = arr.filter(_ => _.MDATE_MONTH === '年累计')
                if(yearSum.length) yearSum = yearSum[0]
                else yearSum = {MDATE_MONTH: '年累计'}
                let sum = arr.filter(_ => _.MDATE_MONTH === '当期累计')
                if(sum.length) sum = sum[0]
                else sum = {MDATE_MONTH: '当期累计'}
                arr = arr.filter(_ => !['年累计', '当期累计'].includes(_.MDATE_MONTH)).sort((a, b) => a.MDATE_MONTH - b.MDATE_MONTH)
                arr.unshift(sum)
                arr.unshift(yearSum)
                let keys = ['MDATE_MONTH', 'MTD_SEND_AMT_YOY', 'MTD_SEND_AMT_RATE', 'AGO_SEMD_AMT_RATE', 'MTD_SEND_AMT', 'AGO_SEMD_AMT', 'MTD_PAY_AMT', 'AGO_PAY_AMT']
                this.table.tableData = this.table.tableData.slice(0, 1).concat(
                    arr.map(item => {
                        return keys.map(key => {
                            let date = this.year + item.MDATE_MONTH + '01'
                            if(key === 'MDATE_MONTH') return ['年累计', '当期累计'].includes(item[key]) ? item[key] : this.handleMonth(item[key])
                            else if(['MTD_SEND_AMT_YOY', 'MTD_SEND_AMT_RATE', 'MTD_SEND_AMT', 'MTD_PAY_AMT'].includes(key)) return date <= moment().format('YYYYMMDD') || ['年累计', '当期累计'].includes(item.MDATE_MONTH) ? item[key] : '--'
                            return item[key]
                        })
                    })
                )
            }
            else if(type === 'trend'){
                let arr = _.cloneDeep(source)
                let xAxis = []
                for(let i = 0; i < 12; i++){
                    xAxis.push((i + 1) + '月')
                }
                this.doubleLine.legend.data = [this.year + '年', this.year - 1 + '年']
                this.doubleLine.xAxis[0].data = xAxis
                this.doubleLine.series[0].name = this.year + '年'
                this.doubleLine.series[0].data = []
                this.doubleLine.series[1].name = this.year - 1 + '年'
                this.doubleLine.series[1].data = []
                this.doubleBar.legend.data = [this.year + '年', this.year - 1 + '年']
                this.doubleBar.xAxis[0].data = xAxis
                this.doubleBar.series[0].name = this.year + '年'
                this.doubleBar.series[0].data = []
                this.doubleBar.series[1].name = this.year - 1 + '年'
                this.doubleBar.series[1].data = []
                let line = _.cloneDeep(this.doubleLine)
                let bar = _.cloneDeep(this.doubleBar)
                this.$refs?.line?.$refs?.echarts?.clear()
                this.$refs?.bar?.$refs?.echarts?.clear()
                this.doubleLine = line
                this.doubleBar = bar
                if(!arr.length) return
                arr.sort((a, b) => a.MDATE_MONTH - b.MDATE_MONTH)
                let keys = ['MDATE_MONTH', 'MTD_SEND_AMT_RATE', 'AGO_SEMD_AMT_RATE']
                this.doubleLine.series[0].data = arr.map(item => {
                    let date = this.year + item.MDATE_MONTH + '01'
                    return keys.map(key => {
                        if(key === 'MDATE_MONTH') return this.handleMonth(item[key])
                        if(key === 'MTD_SEND_AMT_RATE' && date > moment().format('YYYYMMDD')) return null
                        else return item[key]
                    })
                })
                this.doubleLine.series[1].data = arr.map(item => {
                    return [
                        this.handleMonth(item[keys[0]]),
                        item[keys[2]]
                    ]
                })
                let keys1 = ['MDATE_MONTH', 'MTD_SEND_AMT', 'AGO_SEMD_AMT']
                this.doubleBar.series[0].data = arr.map(item => {
                    return keys1.map(key => {
                        let date = this.year + item.MDATE_MONTH + '01'
                        if(key === 'MDATE_MONTH') return this.handleMonth(item[key])
                        if(key === 'MTD_SEND_AMT' && date > moment().format('YYYYMMDD')) return null
                        else return item[key]
                    })
                })
                this.doubleBar.series[1].data = arr.map(item => {
                    return [
                        this.handleMonth(item[keys1[0]]),
                        item[keys1[2]]
                    ]
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';
.SpotRatio{
    /deep/ .table{
        .row {
            height: 30px;
            line-height: 30px;
        }
        .col1{
            .row:nth-child(3), .row:nth-child(4), .row:nth-child(5) {
                height: 60px!important;
                line-height: 60px!important;
            }
        }
        .col:nth-child(2) .row{
            text-align: left;
        }
    }
    .bottomBox{
        width: 100%;
        height: calc(100% - 300px);
        display: flex;
        .left, .right{
            width: calc(50% - 25px);
            height: 100%;
        }
    }
    .selects{
        .ChoiceRight{
            /deep/ .Select{
                .ant-select{
                    width: 150px !important; 
                }
            }
        }
    }
}
</style>