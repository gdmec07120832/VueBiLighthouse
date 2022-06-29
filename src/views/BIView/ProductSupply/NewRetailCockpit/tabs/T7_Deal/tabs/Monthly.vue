<template>
    <div class="main">
        <div class="topBox">
            <span>{{ type === '支付口径' ? '成交毛利率趋势' : '采购毛利率趋势' }}</span>
            <div></div>
        </div>
        <div class="selects">
            <span class="mr10">渠道选择</span>
            <a-select
                    style="margin-right: 24px;min-width: 100px"
                    v-model="channel"
            >
<!--                size="small"-->
                <a-select-option :value="item" v-for="item in channelOptions" :key="item">
                    {{ item }}
                </a-select-option>
            </a-select>
            <span class="mr10">货品分类</span>
            <a-select
                    style="min-width: 100px"
                    v-model="goodsType"
                    mode="multiple"
            >
<!--                size="small"-->
                <a-select-option :value="item" v-for="item in goodsTypeOption" :key="item">
                    {{ item }}
                </a-select-option>
            </a-select>
            <span></span>
            <a-radio-group class="radio" v-model="radio" size="small" buttonStyle="solid">
                <a-radio-button value="渠道">
                    渠道
                </a-radio-button>
                <a-radio-button value="区域">
                    区域
                </a-radio-button>
            </a-radio-group>
        </div>
        <div class="channel" v-if="radio === '渠道'">
            <v-chart ref="line" class="line" :options="line" autoresize></v-chart>
            <Table v-bind="table" class="table"/>
        </div>
        <div class="area" ref="area" v-if="radio === '区域'">
            <Table class="table1" v-bind="table1"/>
            <Table class="table2" v-bind="table2"/>
            <Table class="table3" v-bind="table3"/>
            <Table class="table4" v-bind="table4"/>
        </div>
    </div>
</template>

<script>
import Table from '../../../components/Table'
import base from '../../../utils/base'
import moment from "moment";
export default {
    name: 'Monthly',
    mixins: [base],
    components: {
        // Select,
        Table,
    },
    props: {
        year: {
            type: String
        },
        type: {
            type: String
        }
    },
    async created() {
        this.line = await this.createLine()
        this.line.series[0].name = '当期'
        this.line.series[0].z = 1
        this.line.series[1].name = '同期'
        this.line.series[1].z = 0
        this.line.grid.top = 20
        this.line.legend.data = ['当期', '同期']
        await this.getOption()
        this.getChannelData()
    },
    watch: {
        radio: {
            handler(val) {
                // this.getOption()
                if(val === '渠道') this.getChannelData()
                else if(val === '区域') this.getAreaData()
            }
        },
        condiction: {
            handler() {
                if(this.radio === '渠道') {
                    this.getChannelData()
                }
                else if(this.radio === '区域') {
                    this.getAreaData()
                }
            }
        },
        type: {
            handler() {
                if(this.radio === '渠道'){
                    this.handleData('line', this.currentYear, this.oldYear)
                    this.handleData('table', this.currentYear, this.oldYear)
                }
                else if(this.radio === '区域') {
                    this.handleData('table1', this.currentYear, this.oldYear)
                }
            }
        }
    },
    computed: {
        condiction() {
            return this.year + '-' + this.channel + '-' + this.goodsType.toString()
        }
    },
    mounted() {
        let that = this
    },
    data() {
        return {
            channel: '线下',
            channelOptions: ['线下', '直营', '经销'],
            goodsType: ['A货', 'B货', 'C货', 'D货'],
            goodsTypeOption: ['A货', 'B货', 'C货', 'D货'],
            radio: '渠道',
            line: null,
            table: {
                index: 'Deal_channel',
                labelData: ['渠道', '线下'],
                tableData: [
                    ['年月', '目标', null, null, '差值', '同比', '达成'],
                    ['年累计', null, null, null, null, null, null],
                    ['当期累计', null, null, null, null, null, null],
                    [null, null, null, null, null, null, null]
                ]
            },
            table1: {
                index: 'Deal_area',
                labelData: ['区域', '东区'],
                tableData: [
                    ['年月', 'null', 'null', '同比', '达成'],
                    ['年累计', null, null, null, null],
                    ['当期累计', null, null, null, null],
                    [null, null, null, null, null],
                ]
            },
            table2: {
                index: 'Deal_area',
                labelData: ['区域', '南区'],
                tableData: [
                    ['年月', 'null', 'null', '同比', '达成'],
                    ['年累计', null, null, null, null],
                    ['当期累计', null, null, null, null],
                    [null, null, null, null, null],
                ]
            },
            table3: {
                index: 'Deal_area',
                labelData: ['区域', '西区'],
                tableData: [
                    ['年月', 'null', 'null', '同比', '达成'],
                    ['年累计', null, null, null, null],
                    ['当期累计', null, null, null, null],
                    [null, null, null, null, null],
                ]
            },
            table4: {
                index: 'Deal_area',
                labelData: ['区域', '北区'],
                tableData: [
                    ['年月', 'null', 'null', '同比', '达成'],
                    ['年累计', null, null, null, null],
                    ['当期累计', null, null, null, null],
                    [null, null, null, null, null],
                ]
            },
            currentYear: [],
            oldYear: [],
        }
    },
    methods: {
        async getOption() {
            // let api = this.radio === '渠道' ? 'new_retail_grs_jh_qd' : 'new_retail_grs_jh_qy'
            let api = 'new_retail_grs_jh_qd'
            let query = {
                YDATE: this.year
            }
            let res = await this.$fetchSql('new_retail', api, query)
            // this.channelOptions = Object.freeze(Array.from(new Set(res.data.map(_ => _.CHANNEL))))
            // this.channel = this.channelOptions[0]
        },
        async getChannelData() {
            let query = {
                YDATE: this.year,
            }
            if (this.channel !== '') query.CHANNEL = this.channel.toString()
            if (this.goodsType.length) query.SALES_PROFIT_CLASS = this.goodsType.toString()
            let currentYear = await this.$fetchSql('new_retail', 'new_retail_grs_jh_qd', query)
            query.YDATE--
            let oldYear = await this.$fetchSql('new_retail', 'new_retail_grs_jh_qd', query)
            this.currentYear = currentYear.data.concat()
            this.oldYear = oldYear.data.concat()
            this.handleData('line', currentYear.data, oldYear.data)
            this.handleData('table', currentYear.data, oldYear.data)
        },
        async getAreaData() {
            let query = {
                YDATE: this.year,
            }
            if (this.channel !== '') query.CHANNEL = this.channel.toString()
            if (this.goodsType.length) query.SALES_PROFIT_CLASS = this.goodsType.toString()
            let currentYear = await this.$fetchSql('new_retail', 'new_retail_grs_jh_qy', query)
            query.YDATE--
            let oldYear = await this.$fetchSql('new_retail', 'new_retail_grs_jh_qy', query)
            this.currentYear = currentYear.data.concat()
            this.oldYear = oldYear.data.concat()
            this.handleData('table1', currentYear.data, oldYear.data)
        },
        comparyNone(arr = [], filterZeroFlag) {
            if (!arr.length) return
            let flag = true
            arr.forEach(item => {
                if (item === null || item === undefined) flag = false
            })
            if (filterZeroFlag && arr[1] === 0) flag = false
            return flag
        },
        handleData(type, source, source1) {
            let arr = source.filter(_ => _.CALIBER === this.type)
            let arr1 = source1.filter(_ => _.CALIBER === this.type)
            if (type === 'line') {
                this.line.xAxis.data = []
                this.line.series[0].data = []
                this.line.series[1].data = []
                this.$refs?.line?.$refs?.echarts?.clear()
                if(!arr.length && !arr1.length) return
                arr.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                arr1.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                let that = this
                let createMontnCol = function() {
                    let obj = {
                        MDATE: null,
                        PROFIT_RATE: null,
                        LOCK_COST: null,
                        PRE_DSCNT_ACT_PRC: null,
                        AGO_PROFIT_RATE: null,
                        AGO_PRE_DSCNT_ACT_PRC: null,
                        AGO_LOCK_COST: null,
                    }
                    let arr = []
                    for (let i = 0; i < 12; i++) {
                        arr.push(JSON.parse(JSON.stringify(obj)))
                        if(i < 9) {
                            arr[i].MDATE = moment(that.year).format('YYYY') + '0' + (i + 1)
                        }
                        else {
                            arr[i].MDATE = moment(that.year).format('YYYY') + (i + 1)
                        }
                    }
                    return arr
                }
                let newArr = createMontnCol()
                arr.forEach(item => {
                    let keys = ['PROFIT_RATE','PRE_DSCNT_ACT_PRC', 'LOCK_COST', 'PROFIT_RATE_GOAL']
                    let dateIndex
                    for(let i = 0; i < 12; i++) {
                        if(moment(newArr[i].MDATE).format('MM') === moment(item.MDATE).format('MM')) {
                            dateIndex = i
                            break
                        }
                    }
                    if(dateIndex !== undefined) {
                        keys.forEach(key => {
                            newArr[dateIndex][key] = item[key]
                        })
                    }
                })
                arr1.forEach((item, index) => {
                    let keys = [
                        {key: 'AGO_PROFIT_RATE', key1: 'PROFIT_RATE'},
                        {key: 'AGO_PRE_DSCNT_ACT_PRC', key1: 'PRE_DSCNT_ACT_PRC'},
                        {key: 'AGO_LOCK_COST', key1: 'LOCK_COST'},
                    ]
                    let dateIndex
                    for(let i = 0; i < 12; i++){
                        if(moment(newArr[i].MDATE).format('MM') === moment(item.MDATE).format('MM')) {
                            dateIndex = i
                            break
                        }
                    }
                    if(dateIndex !== undefined) {
                        keys.forEach(kItem => {
                            newArr[dateIndex][kItem.key] = item[kItem.key1]
                        })
                    }
                })
                newArr.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                this.line.xAxis.data = Array.from(new Set(newArr.map(_ => moment(_.MDATE).format('MM月'))))
                this.line.xAxis.data.sort((a, b) => a.split('月')[0] - b.split('月')[0])
                let keys = ['MDATE', 'PROFIT_RATE', 'AGO_PROFIT_RATE']
                this.line.series[0].data = newArr.map(item => {
                    // if(moment(item.MDATE).format('x') > moment().format('x')) return null
                    return keys.map((key, index) => {
                        if (index === 0) {
                            if(moment(item.MDATE).format('x') > moment().format('x')) return key + index
                            return moment(item[key]).format('MM月')
                        }
                        return item[key]
                    })
                })
                this.line.series[1].data = newArr.map(item => {
                    return [
                        moment(item[keys[0]]).format('MM月'),
                        item[keys[2]]
                    ]
                })
            }
            else if (type === 'table') {
                arr.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                arr1.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                this.table.labelData[1] = this.channel
                this.table.tableData.splice(3)
                let col0 = this.table.tableData[0]
                let col1 = this.table.tableData[1]
                let col2 = this.table.tableData[2]
                col0 = col0.map((item, index) => {
                    if(index === 0) return item
                    else if(index === 2) return this.year + '年'
                    else if(index === 3) return this.year - 1 + '年'
                    else return item
                })
                col1 = col1.map((item, index) => {
                    if (index === 0) return item
                    else return null
                })
                col2 = col2.map((item, index) => {
                    if (index === 0) return item
                    else return null
                })
                this.table.tableData[0] = col0
                this.table.tableData[1] = col1
                this.table.tableData[2] = col2
                if (!arr.length && !arr1.length) return
                let keys = ['MDATE', 'PROFIT_RATE_GOAL', 'PROFIT_RATE', 'AGO_PROFIT_RATE', 'diff', 'YearOnYear', 'Reach']
                let that = this
                let createMontnCol = function() {
                    let obj = {
                        MDATE: null,
                        PROFIT_RATE: null,
                        LOCK_COST: null,
                        PRE_DSCNT_ACT_PRC: null,
                        AGO_PROFIT_RATE: null,
                        AGO_PRE_DSCNT_ACT_PRC: null,
                        AGO_LOCK_COST: null,
                    }
                    let arr1 = []
                    for (let i = 0; i < 12; i++) {
                        arr1.push(JSON.parse(JSON.stringify(obj)))
                        if(i < 9) {
                            arr1[i].MDATE = moment(that.year).format('YYYY') + '0' + (i + 1)
                        }
                        else {
                            arr1[i].MDATE = moment(that.year).format('YYYY') + (i + 1)
                        }
                    }
                    return arr1
                }
                let newArr = createMontnCol()
                arr.forEach(item => {
                    let keys = ['PROFIT_RATE','PRE_DSCNT_ACT_PRC', 'LOCK_COST', 'PROFIT_RATE_GOAL']
                    let dateIndex
                    for(let i = 0; i < 12; i++) {
                        if(moment(newArr[i].MDATE).format('MM') === moment(item.MDATE).format('MM')) {
                            dateIndex = i
                            break
                        }
                    }
                    if(dateIndex !== undefined) {
                        keys.forEach(key => {
                            newArr[dateIndex][key] = item[key]
                        })
                    }
                })
                arr1.forEach((item, index) => {
                    let keys = [
                        {key: 'AGO_PROFIT_RATE', key1: 'PROFIT_RATE'},
                        {key: 'AGO_PRE_DSCNT_ACT_PRC', key1: 'PRE_DSCNT_ACT_PRC'},
                        {key: 'AGO_LOCK_COST', key1: 'LOCK_COST'},
                    ]
                    let dateIndex
                    for(let i = 0; i < 12; i++){
                        if(moment(newArr[i].MDATE).format('MM') === moment(item.MDATE).format('MM')) {
                            dateIndex = i
                            break
                        }
                    }
                    if(dateIndex !== undefined) {
                        keys.forEach(kItem => {
                            newArr[dateIndex][kItem.key] = item[kItem.key1]
                        })
                    }
                })
                let computeFun = function(type = 'reach', arr = []) {
                    if(type === 'reach') {
                        if(!that.comparyNone(arr, true)) return null
                        else return arr[0] / arr[1]
                    }
                    else if(type === 'YOY') {
                        if(!that.comparyNone(arr, true)) return null
                        else return (arr[0] - arr[1]) / arr[1]
                    }
                    else if(type === 'diff') {
                        if(!that.comparyNone(arr)) return null
                        else return arr[0] - arr[1]
                    }
                }
                let newObj = [
                    {targetKey: 'diff', key1: 'PROFIT_RATE', key2: 'AGO_PROFIT_RATE', funType: 'diff'},
                    {targetKey: 'YearOnYear', key1: 'PROFIT_RATE', key2: 'AGO_PROFIT_RATE', funType: 'YOY'},
                    {targetKey: 'Reach', key1: 'PROFIT_RATE', key2: 'PROFIT_RATE_GOAL', funType: 'reach'},
                ]
                newArr.forEach(item => {
                    for(let i = 0; i < newObj.length; i ++) {
                        item[newObj[i].targetKey] = computeFun(newObj[i].funType, [ item[newObj[i].key1], item[newObj[i].key2] ])
                    }
                })
                let monthCol = newArr.map(item => {
                    return keys.map((key, index) => {
                        if(key === 'MDATE') return moment(item[key]).format('M月')
                        if((index === 1 || index === 2 || index === 5) && moment(item.MDATE).format('x') > moment().format('x')) return null
                        return item[key]
                    })
                })
                this.table.tableData = this.table.tableData.concat(monthCol)
                // this.table.tableData = this.table.tableData.map((item, index) => {
                //     if()
                //     return [
                //         item[0],
                //         item[5],
                //         ...item.slice(1,5),
                //         item[6]
                //     ]
                // })
                let createSomeMonthCol = function(array) {
                    let obj = {
                        LOCK_COST: null,
                        AGO_LOCK_COST: null,
                        PRE_DSCNT_ACT_PRC: null,
                        AGO_PRE_DSCNT_ACT_PRC: null,

                        PROFIT_RATE: null,
                        AGO_PROFIT_RATE: null,
                        diff: null,
                        YearOnYear: null,
                        PROFIT_RATE_GOAL: null,
                        Reach: null,
                    }
                    if(!array.length) return obj
                    let reduceKey = ['LOCK_COST', 'AGO_LOCK_COST', 'PRE_DSCNT_ACT_PRC', 'AGO_PRE_DSCNT_ACT_PRC']
                    reduceKey.forEach(key => {
                        let sum = array.map(_ => _[key]).filter(_ => _ !== null && _ !== undefined)
                        if(sum.length) obj[key] = sum.reduce((a, b) => a + b)
                    })

                    let computeFun = function(type = 'reach', arr = []) {
                        if(type === 'reach') {
                            if(!that.comparyNone(arr, true)) return null
                            else return arr[0] / arr[1]
                        }
                        else if(type === 'YOY') {
                            if(!that.comparyNone(arr, true)) return null
                            else return (arr[0] - arr[1]) / arr[1]
                        }
                        else if(type === 'diff') {
                            if(!that.comparyNone(arr)) return null
                            else return arr[0] - arr[1]
                        }
                        else if(type === 'MLL') {
                            if(!that.comparyNone(arr, true)) return null
                            else return (arr[1] - arr[0]) / arr[1]
                        }
                    }
                    let newObj = [
                        {targetKey: 'PROFIT_RATE', key1: 'LOCK_COST', key2: 'PRE_DSCNT_ACT_PRC', funType: 'MLL'},
                        {targetKey: 'AGO_PROFIT_RATE', key1: 'AGO_LOCK_COST', key2: 'AGO_PRE_DSCNT_ACT_PRC', funType: 'MLL'},
                        {targetKey: 'diff', key1: 'PROFIT_RATE', key2: 'AGO_PROFIT_RATE', funType: 'diff'},
                        {targetKey: 'YearOnYear', key1: 'PROFIT_RATE', key2: 'AGO_PROFIT_RATE', funType: 'YOY'},
                    ]
                    for(let i = 0; i < newObj.length; i++) {
                        let item = newObj[i]
                        obj[item.targetKey] = computeFun(item.funType, [ obj[item.key1], obj[item.key2] ])
                    }
                    return obj
                }
                let someMonthCol, sumYearCol
                if(this.year === moment(new Date()).format('YYYY')) {
                    someMonthCol = createSomeMonthCol(newArr.slice(0, moment(new Date()).month() + 1))
                    sumYearCol = createSomeMonthCol(newArr)
                }
                else if(this.year < moment(new Date()).format('YYYY')){
                    someMonthCol = createSomeMonthCol(newArr)
                    sumYearCol = createSomeMonthCol(newArr)
                }
                else if(this.year > moment(new Date()).format('YYYY')) {
                    someMonthCol = {
                        PROFIT_RATE: null,
                        LOCK_COST: null,
                        PRE_DSCNT_ACT_PRC: null,
                        AGO_PROFIT_RATE: null,
                        AGO_PRE_DSCNT_ACT_PRC: null,
                        AGO_LOCK_COST: null,
                        diff: null,
                        YearOnYear: null,
                        PROFIT_RATE_GOAL: null,
                        Reach: null,
                    }
                    sumYearCol = JSON.parse(JSON.stringify(someMonthCol))
                }
                this.table.tableData[2] = [
                    this.table.tableData[2][0],
                    ...keys.slice(1).map(key => {
                        return someMonthCol[key]
                    })
                ]
                this.table.tableData[1] = [
                    this.table.tableData[1][0],
                    ...keys.slice(1).map(key => {
                        return sumYearCol[key]
                    })
                ]
            }
            else if (type === 'table1') {
                arr.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                arr1.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                let tableArr = ['table1', 'table2', 'table3', 'table4']
                tableArr.forEach(tablekey => {
                    this[tablekey].tableData.splice(3)
                    let col0 = this[tablekey].tableData[0]
                    let col1 = this[tablekey].tableData[1]
                    let col2 = this[tablekey].tableData[2]
                    col0 = col0.map((item, index) => {
                        if (index === 0) return item
                        else if (index === 1) return this.year + '年'
                        else if (index === 2) return this.year - 1 + '年'
                        else return item
                    })
                    col1 = col1.map((item, index) => {
                        if (index === 0) return item
                        else return null
                    })
                    col2 = col2.map((item, index) => {
                        if (index === 0) return item
                        else return null
                    })
                    this[tablekey].tableData[0] = col0
                    this[tablekey].tableData[1] = col1
                    this[tablekey].tableData[2] = col2
                })
                if (!arr.length && !arr1.length) return
                tableArr.forEach(tablekey => {
                    let itemArr = arr.filter(_ => _.S_OR_N === this[tablekey].labelData[1])
                    let itemArr1 = arr1.filter(_ => _.S_OR_N === this[tablekey].labelData[1])
                    let keys = ['MDATE', 'PROFIT_RATE', 'AGO_PROFIT_RATE', 'YearOnYear', 'Reach']
                    let that = this
                    let createMontnCol = function () {
                        let obj = {
                            MDATE: null,
                            PROFIT_RATE: null,
                            LOCK_COST: null,
                            PRE_DSCNT_ACT_PRC: null,
                            AGO_PROFIT_RATE: null,
                            AGO_PRE_DSCNT_ACT_PRC: null,
                            AGO_LOCK_COST: null,
                        }
                        let arr = []
                        for (let i = 0; i < 12; i++) {
                            arr.push(JSON.parse(JSON.stringify(obj)))
                            if (i < 9) {
                                arr[i].MDATE = moment(that.year).format('YYYY') + '0' + (i + 1)
                            } else {
                                arr[i].MDATE = moment(that.year).format('YYYY') + (i + 1)
                            }
                        }
                        return arr
                    }
                    let newArr = createMontnCol()
                    itemArr.forEach((item, index) => {
                        let keys = ['PROFIT_RATE', 'PRE_DSCNT_ACT_PRC', 'LOCK_COST', 'PROFIT_RATE_GOAL']
                        let dateIndex
                        for(let i = 0; i < 12; i++) {
                            if(moment(newArr[i].MDATE).format('MM') === moment(item.MDATE).format('MM')) {
                                dateIndex = i
                                break
                            }
                        }
                        if(dateIndex !== undefined) {
                            keys.forEach(key => {
                                newArr[dateIndex][key] = item[key]
                            })
                        }
                    })
                    itemArr1.forEach((item, index) => {
                        let keys = [
                            {key: 'AGO_PROFIT_RATE', key1: 'PROFIT_RATE'},
                            {key: 'AGO_PRE_DSCNT_ACT_PRC', key1: 'PRE_DSCNT_ACT_PRC'},
                            {key: 'AGO_LOCK_COST', key1: 'LOCK_COST'},
                        ]
                        let dateIndex
                        for(let i = 0; i < 12; i++){
                            if(moment(newArr[i].MDATE).format('MM') === moment(item.MDATE).format('MM')) {
                                dateIndex = i
                                break
                            }
                        }
                        if(dateIndex !== undefined) {
                            keys.forEach(kItem => {
                                newArr[dateIndex][kItem.key] = item[kItem.key1]
                            })
                        }
                    })

                    let computeFun = function(type = 'reach', arr = []) {
                        if(type === 'reach') {
                            if(!that.comparyNone(arr, true)) return null
                            else return arr[0] / arr[1]
                        }
                        else if(type === 'YOY') {
                            if(!that.comparyNone(arr, true)) return null
                            else return (arr[0] - arr[1]) / arr[1]
                        }
                        else if(type === 'diff') {
                            if(!that.comparyNone(arr)) return null
                            else return arr[0] - arr[1]
                        }
                    }
                    let newObj = [
                        {targetKey: 'YearOnYear', key1: 'PROFIT_RATE', key2: 'AGO_PROFIT_RATE', funType: 'YOY'},
                        {targetKey: 'Reach', key1: 'PROFIT_RATE', key2: 'PROFIT_RATE_GOAL', funType: 'reach'},
                    ]
                    newArr.forEach(item => {
                        for(let i = 0; i < newObj.length; i ++) {
                            item[newObj[i].targetKey] = computeFun(newObj[i].funType, [ item[newObj[i].key1], item[newObj[i].key2] ])
                        }
                    })
                    let monthCol = newArr.map(item => {
                        return keys.map((key, index) => {
                            if(key === 'MDATE') return moment(item[key]).format('M月')
                            if((index === 1 || index === 3)&& moment(item.MDATE).format('x') > moment().format('x')) return null
                            return item[key]
                        })
                    })

                    this[tablekey].tableData = this[tablekey].tableData.concat(monthCol)
                    
                    let createSomeMonthCol = function(array) {
                        let obj = {
                            LOCK_COST: null,
                            AGO_LOCK_COST: null,
                            PRE_DSCNT_ACT_PRC: null,
                            AGO_PRE_DSCNT_ACT_PRC: null,

                            PROFIT_RATE: null,
                            AGO_PROFIT_RATE: null,
                            diff: null,
                            YearOnYear: null,
                            PROFIT_RATE_GOAL: null,
                            Reach: null,
                        }
                        if(!array.length) return obj
                        let reduceKey = ['LOCK_COST', 'AGO_LOCK_COST', 'PRE_DSCNT_ACT_PRC', 'AGO_PRE_DSCNT_ACT_PRC']
                        reduceKey.forEach(key => {
                            let sum = array.map(_ => _[key]).filter(_ => _ !== null && _ !== undefined)
                            if(sum.length) obj[key] = sum.reduce((a, b) => a + b)
                        })

                        let computeFun = function(type = 'reach', arr = []) {
                            if(type === 'reach') {
                                if(!that.comparyNone(arr, true)) return null
                                else return arr[0] / arr[1]
                            }
                            else if(type === 'YOY') {
                                if(!that.comparyNone(arr, true)) return null
                                else return (arr[0] - arr[1]) / arr[1]
                            }
                            else if(type === 'diff') {
                                if(!that.comparyNone(arr)) return null
                                else return arr[0] - arr[1]
                            }
                            else if(type === 'MLL') {
                                if(!that.comparyNone(arr, true)) return null
                                else return (arr[1] - arr[0]) / arr[1]
                            }
                        }
                        let newObj = [
                            {targetKey: 'PROFIT_RATE', key1: 'LOCK_COST', key2: 'PRE_DSCNT_ACT_PRC', funType: 'MLL'},
                            {targetKey: 'AGO_PROFIT_RATE', key1: 'AGO_LOCK_COST', key2: 'AGO_PRE_DSCNT_ACT_PRC', funType: 'MLL'},
                            {targetKey: 'diff', key1: 'PROFIT_RATE', key2: 'AGO_PROFIT_RATE', funType: 'diff'},
                            {targetKey: 'YearOnYear', key1: 'PROFIT_RATE', key2: 'AGO_PROFIT_RATE', funType: 'YOY'},
                        ]
                        for(let i = 0; i < newObj.length; i++) {
                            let item = newObj[i]
                            obj[item.targetKey] = computeFun(item.funType, [ obj[item.key1], obj[item.key2] ])
                        }
                        return obj
                    }

                    let someMonthCol, sumYearCol
                    if(this.year === moment(new Date()).format('YYYY')) {
                        someMonthCol = createSomeMonthCol(newArr.slice(0, moment(new Date()).month() + 1))
                        sumYearCol = createSomeMonthCol(newArr)
                    }
                    else if(this.year < moment(new Date()).format('YYYY')){
                        someMonthCol = createSomeMonthCol(newArr)
                        sumYearCol = createSomeMonthCol(newArr)
                    }
                    else if(this.year > moment(new Date()).format('YYYY')) {
                        someMonthCol = {
                            PROFIT_RATE: null,
                            LOCK_COST: null,
                            PRE_DSCNT_ACT_PRC: null,
                            AGO_PROFIT_RATE: null,
                            AGO_PRE_DSCNT_ACT_PRC: null,
                            AGO_LOCK_COST: null,
                            diff: null,
                            YearOnYear: null,
                            PROFIT_RATE_GOAL: null,
                            Reach: null,
                        }
                        sumYearCol = JSON.parse(JSON.stringify(someMonthCol))
                    }
                    this[tablekey].tableData[2] = [
                        this[tablekey].tableData[2][0],
                        ...keys.slice(1).map(key => {
                            return someMonthCol[key]
                        })
                    ]
                    this[tablekey].tableData[1] = [
                        this[tablekey].tableData[1][0],
                        ...keys.slice(1).map(key => {
                            return sumYearCol[key]
                        })
                    ]
                })
            }

        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    height: calc(100% - 38px - 31px);

    .topBox {
        height: 42px;
        display: grid;
        grid-template-columns: repeat(1, auto 1fr auto);
        align-items: center;

        div:nth-child(1) {
            font-size: 14px;
            color: #000000;
            line-height: 20px;
        }
    }

    .selects {
        width: 100%;
        height: 46px;
        background: #FAFAFA;
        display: grid;
        align-items: center;
        padding: 0 15px;
        grid-template-columns: repeat(1, auto auto auto auto 1fr auto);

        .radio {

        }
    }

    .channel {
        height: calc(100% - 88px);

        .line {
            height: calc(100% - 175px) !important;
        }

        .table {
            /deep/ .col1 .row {
                text-align: center;
            }

            /deep/ .col1 .row:nth-child(2) {
                height: calc(100% - 25px);
            }

            /deep/ .col1 .row:nth-child(2)::before {
                content: '';
                height: 100%;
                display: inline-block;
                vertical-align: middle;
            }
        }
    }

    .area {
        height: calc(100% - 88px);
        //display: grid;
        display: flex;
        flex-direction: column;

        .table1, .table2, .table3, .table4 {
            flex: 4;

            /deep/ .row {
                line-height: 0;
            }

            /deep/ .col {
                display: flex;
                flex-direction: column;

                .row {
                    flex: 1;
                }

                .row::before {
                    content: '';
                    height: 100%;
                    vertical-align: middle;
                    display: inline-block;
                }
            }

            /deep/ .col1 .row {
                text-align: center;
            }

            /deep/ .col1 {
                .row:nth-child(1) {
                    height: 20%;
                }

                .row:nth-child(2) {
                    height: 80%;
                }

                .row:nth-child(1)::before, .row:nth-child(2)::before {
                    content: '';
                    height: 100%;
                    display: inline-block;
                    vertical-align: middle;
                }
            }
        }

        .table1 {
            flex: 5;
        }

        .table2, .table3, .table4 {
            margin-top: 2px;

            /deep/ .row:nth-child(1) {
                display: none;
            }

            /deep/ .col1 .row:nth-child(2) {
                height: 100%;
            }
        }
    }
}
</style>