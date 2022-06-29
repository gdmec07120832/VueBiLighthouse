<template>
    <div class="Punctuality py10">
        <div class="titleBox">
            <Title :label="'支装准时率'"/>
            <div style="flex: 1"></div>
            <span class="text-xs text-black mr10">{{ checkBoxs.label }}</span>
            <a-checkbox-group v-model="checkBoxs.value">
                <a-checkbox
                    v-for="item in checkBoxs.options"
                    :value="item"
                    :key="item"
                >
                    {{ item }}
                </a-checkbox>
            </a-checkbox-group>
        </div>
        <div class="content" style="margin-top: 30px">
            <div class="leftBox">
                <div class="box">
                    <div class="title">支装准时率近两年趋势对比</div>
                    <div style="flex: 1"></div>
                    <span class="text-xs text-black mr10">年份</span>
<!--                    <a-date-picker-->
<!--                        mode="year"-->
<!--                        v-model="year"-->
<!--                        format="YYYY年"-->
<!--                        :allowClear="false"-->
<!--                        :open="openYear"-->
<!--                        @openChange="state => openYear = state"-->
<!--                        @panelChange="panelChangeYear"-->
<!--                    />-->
                    <a-select v-model="year" style="width: 150px">
                        <a-select-option :value="item" v-for="item in years" :key="item">
                            {{item}}年
                        </a-select-option>
                    </a-select>
                </div>
                <v-chart
                    style="height: calc(100% - 193px);margin-top: 30px"
                    ref="doubleLine"
                    :options="doubleLine"
                    autoresize
                ></v-chart>
                <Table v-bind="leftTable" ref="leftTable" class="mt10"/>
            </div>
            <div style="width: 40px"></div>
            <div class="rightBox">
                <div class="box">
                    <div class="title">近12个月签收票数支装时效分布</div>
                    <div style="flex: 1"></div>
                    <span class="text-xs text-black mr10">统计年月</span>
<!--                    <a-range-picker-->
<!--                        style="width: 250px"-->
<!--                        format="YYYY-MM"-->
<!--                        :open="openMonth"-->
<!--                        :value="date"-->
<!--                        :mode="['month', 'month']"-->
<!--                        :allowClear="false"-->
<!--                        @panelChange="panelChange"-->
<!--                        @openChange="state => {openMonth = state;!state ? mode = null : null}"-->
<!--                    />-->
                    <a-month-picker v-model="YYYYMM" format="YYYY-M" valueFormat="YYYYMM" :allowClear="false" />
                </div>
                <v-chart
                    style="height: calc(100% - 193px);margin-top: 30px"
                    ref="category"
                    :options="category"
                    autoresize
                ></v-chart>
                <Table v-bind="table" class="mt10"/>
            </div>
        </div>
    </div>
</template>

<script>
import Title from '../../components/Title_H2'
import Table from '@/views/BIView/ProductSupply/StrikeCockpit/components/TableOld'
import base from '@/views/BIView/ProductSupply/StrikeCockpit/utils/base.js'
import { cloneDeep, groupBy } from "lodash";
import moment from 'moment'
import echartsColor from '../../utils/echartsColor.js'
export default {
    mixins: [ base ],
    // 支装准时率
    name: 'Punctuality',
    components: {
        Title,
        Table,
    },
    created() {
        for(let i = moment().subtract(1, 'y').format('YYYY'); i <= moment().format('YYYY'); i++){
            this.years.unshift(i + '')
        }
        let init = () => {
            for(let i = 0; i < 3; i++) {
                let item = cloneDeep(this.category.series[0])
                let colors = this.category.color
                item.itemStyle.color = colors[i + 1]
                item.emphasis.itemStyle.color = colors[i + 1]
                this.category.series.push(item)
            }
        }
        init()
        this.getLastTwoYearData()
        this.getLastYearData()
    },
    watch: {
        mode: {
            handler(val, oval) {
                if(JSON.stringify(val) !== JSON.stringify(oval) && val && oval) {
                    this.date = this.storeDate.concat()
                    this.mode = null
                    this.openMonth = false
                }
            }
        },
        'checkBoxs.value': {
            handler(val) {
                if(!val.length) {
                    this.handleData('doubleLine', this.doubleLineData)
                    this.handleData('leftTable', this.doubleLineData)
                    this.handleData('category', this.categoryData)
                    this.handleData('table', this.categoryData)
                }
                else {
                    this.handleData('doubleLine', this.doubleLineData.filter(_ => val.includes(_.INSTALL_TYPE_NAME)))
                    this.handleData('leftTable', this.doubleLineData.filter(_ => val.includes(_.INSTALL_TYPE_NAME)))
                    this.handleData('category', this.categoryData.filter(_ => this.checkBoxs.value.includes(_.INSTALL_TYPE_NAME)))
                    this.handleData('table', this.categoryData.filter(_ => this.checkBoxs.value.includes(_.INSTALL_TYPE_NAME)))
                }
            }
        },
        year: {
            handler() {
                if(!this.checkBoxs.value.length) {
                    this.handleData('doubleLine', this.doubleLineData)
                    this.handleData('leftTable', this.doubleLineData)
                }
                else {
                    this.handleData('doubleLine', this.doubleLineData.filter(_ => this.checkBoxs.value.includes(_.INSTALL_TYPE_NAME)))
                    this.handleData('leftTable', this.doubleLineData.filter(_ => this.checkBoxs.value.includes(_.INSTALL_TYPE_NAME)))
                }
            }
        },
        date: {
            handler() {
                this.getLastYearData()
            }
        },
        YYYYMM: {
            handler(val) {
                let arr = []
                arr.push(moment(val + '01').subtract(11, 'M'))
                arr.push(moment(val + '01'))
                this.date = arr.concat()
            }
        }
    },
    data() {
        let that = this
        let YYYYMM = moment().format('DD') === '01' ? moment().subtract(1, 'M').format('YYYYMM') : moment().format('YYYYMM')
        return {
            YYYYMM,
            checkBoxs: {
                label: '支装类型',
                value: ['林氏自营', '经销林氏'],
                options: ['林氏自营', '经销林氏'],
            },
            year: moment().format('YYYY'),
            years: [],
            openYear: false,
            doubleLine: {
                legend: {
                    right: 0,
                },
                tooltip: {
                    confine: true,
                    backgroundColor: '#fff',
                    trigger: 'axis',
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    textStyle: {
                        color: '#333',
                        fontSize: 12,
                    },
                    formatter: params => {
                        let str = `${params[0].axisValue}<br/>`
                        params.forEach(item => {
                            str += `${item.marker}${item.seriesName}：${that.handleNum('percent_double_dot', item.data[1])}<br/>`
                        })
                        return str
                    },
                },
                // color: ['#2680eb', '#ff7f0e'],
                // color: ['#2680eb', '#dfdfdf'],
                color: [echartsColor.thisYear, echartsColor.previousYear],
                grid: {
                    top: 30,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    containLabel: true,
                },
                xAxis: {
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        color: echartsColor.axisLabel,
                    },
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                },
                yAxis: {
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        color: echartsColor.axisLabel,
                        formatter: val => {
                            return that.handleNum('percent_not_dot', val)
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'solid',
                            color: echartsColor.splitLine,
                        },
                    },
                },
                series: [
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            color: echartsColor.thisYear
                        },
                        symbol: 'none',
                        areaStyle: {
                            opacity: 0.2
                        },
                        data: [],
                        z: 2,
                    },
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            // color: '#ff7f0e'
                            color: echartsColor.previousYear
                        },
                        symbol: 'none',
                        areaStyle: {
                            opacity: 0.2
                        },
                        data: [],
                        z: 1,
                    },
                ],
            },
            doubleLineData: [],
            date: [moment(YYYYMM + '01').subtract(11, 'M'), moment(YYYYMM + '01')],
            storeDate: [moment().subtract(11, 'M'), moment()],
            mode: null,
            openMonth: false,
            category: {
                tooltip: {
                    backgroundColor: '#fff',
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    trigger: 'axis',
                    formatter: params => {
                        let str = `${params[0].axisValue}<br/>`
                        for(let i = params.length - 1; i >= 0; i--){
                            let item = params[i]
                            str += `${item.marker}${item.seriesName}：${that.handleNum('round', item.data[1])}<br/>`
                        }
                        return str
                    },
                    textStyle: {
                        color: '#333',
                        fontSize: 12
                    }
                },
                legend: {
                    right: 0,
                    top: 'center',
                    orient: 'vertical',
                    icon: 'rect',
                    itemWidth: 12,
                    itemHeight: 12,
                    selectedMode: false,
                    textStyle: {
                        color: '#999',
                        fontSize: 12,
                    },
                    data: ['X≥3', '2≤X<3', '1.5≤X<2', 'X<1.5']
                },
                grid: {
                    top: 10,
                    left: 0,
                    right: 70,
                    bottom: 0,
                    containLabel: true,
                },
                xAxis: {
                    // boundaryGap: ['1%', '-10%'],
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: '#999',
                    },
                    splitLine: {
                        show: false
                    },
                    data: []
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        color: '#808492',
                    },
                    data: [],
                    splitLine: {
                        show: false
                    }
                },
                color: ['#2680eb', '#20adf5', '#fdd969', '#fe9c2f'],
                series: [
                    {
                        type: 'bar',
                        // tooltip: {
                        //     show: false
                        // },
                        name: '',
                        stack: true,
                        z: 0,
                        barWidth: 15,
                        itemStyle: {
                            color: '#2680eb',
                        },
                        emphasis: {
                            itemStyle: {
                                color: '#2680eb'
                            },
                            focus: 'series'
                        },
                        // barGap: '-100%',
                        data: []
                    },
                ]
            },
            categoryData: [],
            table: {
                index: 'OperateDashboard_Punctuality_right',
                labelData: ['时效分段', 'X≥3', '2≤X<3', '1.5≤X<2', 'X<1.5'],
                tableData: [
                    ['/', '/', '/', '/', '/']
                ],
            },
            leftTable: {
                index: 'OperateDashboard_Punctuality_left',
                labelData: ['年份', '', '', '差异'],
                tableData: [
                    ['/', '/', '/', '/']
                ],
            }
        }
    },
    methods: {
        // panelChangeYear(value) {
        //     this.year = moment(value).format('YYYY')
        //     this.openYear = !this.openYear
        // },
        panelChange(value, mode) {
            this.mode = mode
            this.storeDate = value
        },
        async getLastTwoYearData() {
            let res = await this.$fetchSql('kpi_report', 'arrival_rate')
            this.doubleLineData = res.data.filter(_ => this.checkBoxs.options.includes(_.INSTALL_TYPE_NAME))
            if(!this.checkBoxs.value.length) {
                this.handleData('doubleLine', this.doubleLineData)
                this.handleData('leftTable', this.doubleLineData)
            }
            else {
                this.handleData('doubleLine', res.data.filter(_ => this.checkBoxs.value.includes(_.INSTALL_TYPE_NAME)))
                this.handleData('leftTable', res.data.filter(_ => this.checkBoxs.value.includes(_.INSTALL_TYPE_NAME)))
            }
        },
        async getLastYearData() {
            let res = await this.$fetchSql('kpi_report', 'lgs_qty')
            res.data = res.data.filter(_ => _.TADE_M.replace('-', '') >= this.date[0].format('YYYYMM') && _.TADE_M.replace('-', '') <= this.date[1].format('YYYYMM'))
            this.categoryData = res.data.filter(_ => this.checkBoxs.options.includes(_.INSTALL_TYPE_NAME))
            if(!this.checkBoxs.value.length) {
                this.handleData('category', this.categoryData)
                // this.handleData('table', this.categoryData)
            }
            else {
                this.handleData('category', res.data.filter(_ => this.checkBoxs.value.includes(_.INSTALL_TYPE_NAME)))
                // this.handleData('table', res.data.filter(_ => this.checkBoxs.value.includes(_.INSTALL_TYPE_NAME)))
            }
        },
        handleData(type, source){
            if(type === 'doubleLine') {
                let arr = source.concat()
                this.doubleLine.series[0].name = this.year + '年'
                this.doubleLine.series[1].name = this.year - 1 + '年'
                this.doubleLine.series[0].data = []
                this.doubleLine.series[1].data = []
                this.$refs?.doubleLine?.$refs?.echarts?.clear()
                if(!arr.length) return
                arr.sort((a, b) => {
                    return (b.YY + b.MM) - (a.YY + a.MM)
                })
                let obj = groupBy(arr, _ => _.YY + _.MM)
                let newArr = []
                for(let key in obj){
                    let initial = {
                        // YYYYMMDD:  '20' + obj[0].YY + obj[0].MM + '01',
                        ARRIVAL_QTYSUM: 0,
                        LGS_QTY: 0,
                    }
                    let item = obj[key].reduce(
                        (a, b) => {
                            return {
                                ARRIVAL_QTYSUM: a.ARRIVAL_QTYSUM + b.ARRIVAL_QTYSUM,
                                LGS_QTY: a.LGS_QTY + b.LGS_QTY
                            }
                        },
                        initial
                    )
                    item.YYYYMMDD = '20' + obj[key][0].YY + obj[key][0].MM + '01'
                    item.ARRIVAL_RATE = this.computeYOYOrReach('reach', item.ARRIVAL_QTYSUM , item.LGS_QTY)
                    newArr.push(item)
                }
                newArr.sort((a, b) => a.YYYYMMDD - b.YYYYMMDD)
                this.doubleLine.series[0].name = this.year + '年'
                this.doubleLine.series[1].name = this.year - 1 + '年'
                let keys = ['YYYYMMDD', 'ARRIVAL_RATE']
                this.doubleLine.series[0].data = newArr.filter(_ => moment(_.YYYYMMDD).format('YYYY') === this.year).map((item, index) => {
                    let isAfter = moment(item.YYYYMMDD).format('YYYYMM') > moment().format('YYYYMM') ? true : false
                    if(isAfter) return 'null' + index
                    return keys.map(key => {
                        if(key === 'YYYYMMDD') return moment(item[key]).format('M月')
                        return item[key]
                    })
                })
                this.doubleLine.series[1].data = newArr.filter(_ => moment(_.YYYYMMDD).format('YYYY') === this.year - 1 + '').map((item, index) => {
                    let isAfter = moment(item.YYYYMMDD).format('YYYYMM') > moment().format('YYYYMM') ? true : false
                    if(isAfter) return 'null' + index
                    return keys.map(key => {
                        if(key === 'YYYYMMDD') return moment(item[key]).format('M月')
                        return item[key]
                    })
                })
            }
            else if(type === 'leftTable') {
                this.leftTable.labelData = ['年份', this.year.slice(2, 4) + '年', (this.year - 1 + '').slice(2, 4) + '年', '差异']
                this.leftTable.tableData = [this.leftTable.labelData.map(_ => '/')]
                let arr = source.filter(_ => [this.year, this.year - 1 + ''].includes('20' + _.YY))
                if(!arr.length) return
                arr.sort((a, b) => {
                    return (b.YY + b.MM) - (a.YY + a.MM)
                })
                let obj = groupBy(arr, _ => _.YY + _.MM)
                let newArr = []
                for(let key in obj){
                    let initial = {
                        // YYYYMMDD:  '20' + obj[0].YY + obj[0].MM + '01',
                        ARRIVAL_QTYSUM: 0,
                        LGS_QTY: 0,
                    }
                    let item = obj[key].reduce(
                        (a, b) => {
                            return {
                                ARRIVAL_QTYSUM: a.ARRIVAL_QTYSUM + b.ARRIVAL_QTYSUM,
                                LGS_QTY: a.LGS_QTY + b.LGS_QTY
                            }
                        },
                        initial
                    )
                    item.YYYYMMDD = '20' + obj[key][0].YY + obj[key][0].MM + '01'
                    item.ARRIVAL_RATE = this.computeYOYOrReach('reach', item.ARRIVAL_QTYSUM , item.LGS_QTY)
                    newArr.push(item)
                }
                newArr.sort((a, b) => a.YYYYMMDD - b.YYYYMMDD)
                let monthObj = groupBy(newArr, _ => moment(_.YYYYMMDD).format('M月'))
                let monthArr = []
                for(let key in monthObj){
                    monthObj[key].sort((a, b) => b.YYYYMMDD - a.YYYYMMDD)
                    let currentYear = monthObj[key].filter(_ => _.YYYYMMDD.slice(0, 4) === this.year)
                    let lastYear = monthObj[key].filter(_ => _.YYYYMMDD.slice(0, 4) === this.year - 1 + '')
                    if(currentYear.length) currentYear = currentYear[0]
                    else currentYear = {}
                    if(lastYear.length) lastYear = lastYear[0]
                    else lastYear = {}
                    let item = {
                        month: key,
                        last_reach: lastYear.ARRIVAL_RATE,
                        current_reach: currentYear.ARRIVAL_RATE,
                    }
                    item.diff = this.computeYOYOrReach('diff', item.current_reach, item.last_reach)
                    monthArr.push(item)
                }
                monthArr.sort((a, b) => a.month.split('月')[0] - b.month.split('月')[0])
                let keys = ['month','current_reach',  'last_reach', 'diff']
                this.leftTable.tableData = monthArr.map(item => {
                    return keys.map(key => {
                        if(key === 'month') return item[key]
                        return ![null, undefined].includes(item[key]) ? (item[key] * 100).toFixed(2) + '%' : '--'
                    })
                })
                let vm = this
                vm.$nextTick(() => {
                    let children = vm.$refs?.leftTable?.$el?.children
                    if(!children) return
                    for(let i = 0; i < children.length; i++) {
                        let content = children[i].children[3].innerText
                        if(content.includes('%') && content.split('%')[0] > 0) children[i].children[3].style.color = '#ff5953'
                        else if(content.includes('%') && content.split('%')[0] < 0) children[i].children[3].style.color = '#00a854'
                    }
                })
            }
            else if(type === 'category') {
                this.$refs?.category?.$refs?.echarts?.clear()
                this.category.series.forEach(item => {
                    item.data = []
                })
                this.category.xAxis.data = []
                this.table.tableData = [this.table.labelData.map(_ => '/')]
                let arr = source.concat()
                if(!arr.length) return
                let obj = groupBy(arr, _ => _.OTHR_DSTRBFB)
                let newArr = []
                for(let key in obj) {
                    if(key === 'null') continue
                    let item = obj[key]
                    item.sort((a, b) => moment(a.TADE_M.replace('-', '') + '01').format('YYYYMM') - moment(b.TADE_M.replace('-', '') + '01').format('YYYYMM'))
                    let innerObj = groupBy(item, _ => _.TADE_M.replace('-', '') + '01')
                    let innerArr = []
                    for(let key in innerObj){
                        let initial = {
                            LGS_QTY: 0
                        }
                        let sum = innerObj[key].reduce((a, b) => {
                            return {
                                LGS_QTY: a.LGS_QTY + b.LGS_QTY
                            }
                        }, initial)
                        sum.YYYYMMDD = innerObj[key][0].TADE_M.replace('-', '') + '01'
                        sum.OTHR_DSTRBFB = innerObj[key][0].OTHR_DSTRBFB
                        innerArr.push(sum)
                    }
                    newArr.push(innerArr)
                }
                let sortByOTHR_DSTRBFB = {
                    'X<1.5': 0,
                    '1.5≤X<2': 1,
                    '2≤X<3': 2,
                    'X≥3': 3,
                }
                newArr.sort((a, b) => sortByOTHR_DSTRBFB[ a[0].OTHR_DSTRBFB ] - sortByOTHR_DSTRBFB[ b[0].OTHR_DSTRBFB ])
                this.category.xAxis.data = Array.from(new Set(
                    arr.map(_ => _.TADE_M)
                        .sort((a, b) => {
                            return moment(a.replace('-', '') + '01').format('YYYYMM') - moment(b.replace('-', '') + '01').format('YYYYMM')
                        })
                ))
                newArr.forEach((_, index) => {
                    this.category.series[index].name = _[0].OTHR_DSTRBFB
                    let keys = ['YYYYMMDD', 'LGS_QTY']
                    this.category.series[index].data = _.map(item => {
                        return keys.map(key => {
                            if(key === 'YYYYMMDD') return moment(item[key]).format('YYYY-MM')
                            return item[key]
                        })
                    })
                })

                let sotreArr = [...newArr[0], ...newArr[1], ...newArr[2], ...newArr[3],]
                let monthObj = groupBy(sotreArr, _ => _.YYYYMMDD)
                let tableArr = []
                for(let key in monthObj) {
                    let item = monthObj[key]
                    let obj = {
                        YYYYMMDD: monthObj[key][0].YYYYMMDD,
                        'X≥3': null,
                        '2≤X<3': null,
                        '1.5≤X<2': null,
                        'X<1.5': null,
                    }
                    item.forEach(_ => {
                        obj[_.OTHR_DSTRBFB] = _.LGS_QTY
                    })
                    tableArr.push(obj)
                }
                tableArr.sort((a, b) => a.YYYYMMDD - b.YYYYMMDD)
                this.table.tableData = tableArr.map(item => {
                    let keys = ['YYYYMMDD', 'X≥3', '2≤X<3', '1.5≤X<2', 'X<1.5']
                    return keys.map(key => {
                        if(key === 'YYYYMMDD') return moment(item[key]).format('YYYY-M')
                        return this.handleNum('round', item[key])
                    })
                })
            }

        },
        computeYOYOrReach(type, a, b){
            if(type === 'YOY'){
                if([null, undefined].includes(a) || [null, undefined, 0].includes(b)) return null
                else return (a - b) / b
            }
            else if(type === 'reach'){
                if([null, undefined].includes(a) || [null, undefined, 0].includes(b)) return null
                else return a / b
            }
            else if(type === 'diff') {
                if([null, undefined].includes(a) || [null, undefined].includes(b)) return null
                else return a - b
            }
        }
    }
}
</script>

<style lang="scss" scoped>
///deep/ .red{
//
//}
///deep/ .green{
//
//}
/deep/ .ant-select{
    font-size: 12px;
}
/deep/ .ant-select-selection--single{
    height: 28px;
}
/deep/ .ant-select-selection__rendered{
    line-height: 26px;
}
/deep/ .ant-checkbox-group {
    display: flex;
    align-items: center;

    .ant-checkbox-wrapper {
        margin-right: 10px;
        width: auto;
        height: 18px;
        overflow: hidden;
        white-space: nowrap;
        font-size: 12px;
        color: #808492;
        margin-left: 0 !important;
        &:nth-last-child(1){
            margin-right: 0;
        }
    }
}
/deep/ .ant-input{
    height: 28px;
    font-size: 12px;
}
.Punctuality {
    height: calc(var(--height) * 1px + 6px);
    .titleBox{
        display: flex;
        align-items: center;
    }
    .title{
        font-size: 16px;
        line-height: 16px;
        color: #343437;
        font-weight: bold;
    }
    .content {
        height: calc(100% - 54px);
        display: flex;

        .leftBox {
            flex: none;
            width: calc(50% - 20px) !important;
            height: 100%;
            .box{
                display: flex;
                align-items: center;
            }
            /deep/ .Table{
                .row{
                    height: 31.25px;
                    line-height: 31.25px;
                    padding: 0 3px;
                }
                .col1{
                    min-width: 60px;
                    max-width: 60px;
                }
            }
        }

        .rightBox {
            flex: none;
            width: calc(50% - 20px);
            height: 100%;
            .box{
                display: flex;
                align-items: center;
            }
            /deep/ .Table{
                .row{
                    padding: 0 3px;
                }
                .col1{
                    min-width: 70px;
                    max-width: 70px;
                }
                //fcfcff
                .row:nth-child(odd) {
                    background: #fcfcff;
                }
                .row:nth-child(1) {
                    background: #f5f7ff;
                }
            }
        }
    }
}
</style>