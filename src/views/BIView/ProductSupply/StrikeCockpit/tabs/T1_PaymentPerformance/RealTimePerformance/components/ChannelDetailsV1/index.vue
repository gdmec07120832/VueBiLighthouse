<template>
    <div class="ChannelDetailsV1">
        <div class="selects">
            <a-tabs v-model="tab.value" type="card" size="small">
                <a-tab-pane v-for="item in tab.options" :key="item" :tab="item">
                </a-tab-pane>
            </a-tabs>
            <div style="flex: 1;"></div>
            <template v-if="tab.value === '线上店铺'">
                <virtual-select
                v-for="(item, index) in groupAndStore"
                :key="index"
                style="width: 275px;margin-left: 20px;margin-right: 0"
                v-model="item.value"
                :label="item.label"
                :options="item.options.map((_) => ({ label: _ }))"
                :allowShowClear="false"
                ></virtual-select>
            </template>
            <Radio v-if="tab.value === '线下区域'" v-bind.sync="categories"/>
        </div>
        <div ref="bottomBox" class="bottomBox" :style="{'--tabValue': tab.value === '线上店铺' ? 'flex-start' : 'flex-end'}">
            <Table v-if="tab.value === '线上店铺'" :class="[tab.value === '线上店铺' ? 'online': '']" style="width: calc(40% - 16px);height: 100%;"  v-bind.sync="table"/>
            <Table v-else style="width: calc(40% - 16px);height: 100%;" v-bind.sync="table1"/>
            <div style="width: 32px"></div>
            <div class="right">
                <div class="time" style="display: flex;align-items: center">
                    <div>
                        {{ rightTitle }}{{tab.value !== '线上店铺' ? `（${categories.value}）` : ''}}
                    </div>
                    <div style="flex: 1"></div>
                    <SwitchButton :label1="'同期对比'" :label2="'对比日期'"
                    :currentBtn.sync="currentBtn"/>
                    <a-date-picker :disabledDate="disabledDate" class="ml10" :allowClear="false" v-if="currentBtn === 1"
                    style="width: 150px" size="small" v-model="date" valueFormat="YYYYMMDD"/>
                </div>
                <AnySizeTitle title="分时趋势图"/>
                <v-chart ref="barAndLine1" :options="line1" style="overflow: visible;height: calc(50% - 37px);" class="Circle mb10" autoresize></v-chart>
                <AnySizeTitle title="时段累计图"/>
                <v-chart ref="barAndLine2" :options="line2" style="overflow: visible;height: calc(50% - 37px);" class="Circle" autoresize></v-chart>
            </div>
        </div>
    </div>
</template>

<script>
import base from '../../../../../utils/base.js'
import moment from 'moment'
import AnySizeTitle from "../../../../../components/AnySizeTitle";
import Table from '../../../../../components/TableRow'
import _ from 'lodash'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import SwitchButton from '../RealTimeOverview/components/SwitchButton.vue'
import Radio from '../../../../../components/Radio'
export default {
    mixins: [ base ],
    components: {
        VirtualSelect,
        AnySizeTitle,
        Table,
        SwitchButton,
        Radio,
    },
    props: {
        duration: Number,
    },
    watch: {
        // 线上店铺 / 线下区域
        'tab.value': {
            handler(){
                this.getTable()
                this.getTrend()
            }
        },
        'table.currentClick': {
            handler(val, oval){
                if(JSON.stringify(val) === JSON.stringify(oval)) return
                this.rightTitle = val.value
                if(val.i == 0) this.rightTitle = '合计'
                this.getTrend()
            },
            deep: true
        },
        'table1.currentClick': {
            handler(val, oval){
                if(JSON.stringify(val) === JSON.stringify(oval)) return
                this.rightTitle = val.value
                if(val.i == 0) this.rightTitle = '合计'
                this.getTrend()
            },
            deep: true
        },
        'table.pagination.page': {
            handler(){
                this.handleData('table', this.tableData)
                this.table.currentClick.value = '合计'
                this.table.currentClick.i = 0
                this.table.currentClick.j = 1
            }
        },
        'table.pagination.pageSize': {
            handler(){
                this.handleData('table', this.tableData)
                this.table.currentClick.value = '合计'
                this.table.currentClick.i = 0
                this.table.currentClick.j = 1
            }
        },
        'table1.pagination.page': {
            handler(){
                this.handleData('table1', this.tableData1)
                this.table1.currentClick.value = '合计'
                this.table1.currentClick.i = 0
                this.table1.currentClick.j = 0
            }
        },
        'table1.pagination.pageSize': {
            handler(){
                this.handleData('table1', this.tableData1)
                this.table1.currentClick.value = '合计'
                this.table1.currentClick.i = 0
                this.table1.currentClick.j = 0
            }
        },
        'table.sorting': {
            handler(val){
                this.table.currentClick.value = '合计'
                this.table.currentClick.i = 0
                this.table.currentClick.j = 1
                this.handleData('table', this.tableData)
                this.table.tableColumn.forEach(item => {
                    if(Object.prototype.hasOwnProperty.call(item, 'sort')){
                        item.sort = null
                        let {field, order} = val
                        if(field !== 'rownum' && item.key === field) item.sort = order === 'asc' ? 'up' : 'down'
                    }
                })
            },
            deep: true
        },
        'table1.sorting': {
            handler(val){
                this.table1.currentClick.value = '合计'
                this.table1.currentClick.i = 0
                this.table1.currentClick.j = 0
                this.handleData('table1', this.tableData1)
                this.table1.tableColumn.forEach(item => {
                    if(Object.prototype.hasOwnProperty.call(item, 'sort')){
                        item.sort = null
                        let {field, order} = val
                        if(field !== 'rownum' && item.key === field) item.sort = order === 'asc' ? 'up' : 'down'
                    }
                })
            },
            deep: true
        },
        'categories.value': {
            handler(){
                this.getTable()
                this.getTrend()
            }
        },
        'groupAndStore.0.value': {
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
                        this.groupAndStore[0].value = ['全部']
                    }
                }
                else if(!diff.includes('全部') && val.length > oval.length){
                    this.groupAndStore[0].value = this.groupAndStore[0].value.filter(_ => _ !== '全部')
                }
                if(val.length === 0){
                    this.groupAndStore[0].value = ['全部']
                }
                if(val.toString() !== '全部'){
                    this.groupAndStore[1].options = this.allOptions.filter(_ => val.includes(_.SHOP_GROUP)).map(_ => _.SHOP_NAME)
                    this.groupAndStore[1].options.unshift('全部')
                }
                else if(val.toString() === '全部'){
                    this.groupAndStore[1].options = this.allOptions.map(_ => _.SHOP_NAME)
                    this.groupAndStore[1].options.unshift('全部')
                }
                if(this.tab.value === '线上店铺') this.table.pagination.page = 1
                else this.table1.pagination.page = 1
                this.getTable()
                this.getTrend()
            }
        },
        'groupAndStore.1.value': {
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
                        this.groupAndStore[1].value = ['全部']
                    }
                }
                else if(!diff.includes('全部') && val.length > oval.length){
                    this.groupAndStore[1].value = this.groupAndStore[1].value.filter(_ => _ !== '全部')
                }
                if(val.length === 0){
                    this.groupAndStore[1].value = ['全部']
                }
                if(this.tab.value === '线上店铺') this.table.pagination.page = 1
                else this.table1.pagination.page = 1
                this.getTable()
                this.getTrend()
            }
        },
        currentBtn: {
            handler(val){
                if(val === 0){
                    this.date = moment().format('YYYYMMDD')
                    this.line1.series[1].name = '同期支付业绩'
                    this.line2.series[1].name = '同期支付业绩'
                }
                else{
                    this.line1.series[1].name = '对比日期支付业绩'
                    this.line2.series[1].name = '对比日期支付业绩'
                }
            }
        },
        date: {
            handler(){
                this.getTrend()
            }
        },
    },
    async created(){
        this.line1 = await this.createLine({
            xAxisLabelFormatter: 'normal',
            yAxisLabelFormatter: 'tenThousand',
        })
        this.line2 = await this.createLine({
            xAxisLabelFormatter: 'normal',
            yAxisLabelFormatter: 'tenThousand',
        })
        this.line1.grid.top = 20
        this.line1.xAxis[0].data = []
        this.line1.series[0].name = '支付业绩'
        this.line1.series[0].data = []
        this.line1.series[1].name = '同期支付业绩'
        this.line1.series[1].data = []
        this.line2.grid.top = 20
        this.line2.series[0].name = '支付业绩'
        this.line2.series[0].data = []
        this.line2.series[1].name = '同期支付业绩'
        this.line2.series[1].data = []
        this.getOption()
        this.getTable()
        this.getTrend()
        let that = this
        this.timer = setInterval(() => {
            that.rightTitle = '合计'
            that.table.currentClick.value = '合计'
            that.table.currentClick.i = 0
            that.table.currentClick.j = 1
            that.table1.currentClick.value = '合计'
            that.table1.currentClick.i = 0
            that.table1.currentClick.j = 0
            that.getTable()
            that.getTrend()
        }, that.duration)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    data() {
        this.getTrend = _.debounce(this.getTrend, 300, {
            leading: false,
            trailing: true
        })
        this.getTable = _.debounce(this.getTable, 300, {
            leading: false,
            trailing: true
        })
        return {
            timer: null,
            rightTitle: '合计',
            currentBtn: 0,
            tab: {
                value: '线上店铺',
                options: ['线上店铺', '线下区域']
            },
            // 所有选项 选平台时过滤店铺选项
            allOptions: [],
            // 平台 店铺选项
            groupAndStore: [
                {
                    label: '平台搜索',
                    value: ['全部'],
                    options: []
                },
                {
                    label: '店铺搜索',
                    value: ['全部'],
                    options: []
                }
            ],
            categories: {
                label: '主营类目',
                value: '全部',
                options: ['全部', '成品', '定制']
            },
            // 线上店铺
            table: {
                // height: '200px',
                maxHeight: 'calc(100% - 63px)',
                height: 'calc(100% - 63px)',
                sorting: {
                    field: 'PTD_PAY_TGT',
                    order: 'desc',
                },
                currentClick: {
                    i: 0,
                    j: 1,
                    value: '合计',
                },
                header: {
                    area: [
                        ['a', 'b', 'c', 'd', 'e'],
                    ],
                    data: {
                        a: '平台',
                        b: '店铺',
                        c: '目标',
                        d: '实际',
                        e: '达成',
                    },
                },
                // 配置字段
                // valueFormat sumFirstFormat sumLastFormat 可以是字符串或函数
                tableColumn: [
                    {key: 'SHOP_GROUP', areaName: 'a', valueFormat: 'normal'},
                    {key: 'SHOP_NAME', areaName: 'b', valueFormat: 'normal', canClick: true},
                    {key: 'PTD_PAY_TGT', areaName: 'c', valueFormat: 'round', sort: 'down'},
                    {key: 'PTD_PAY_AMT', areaName: 'd', valueFormat: 'round', sort: null},
                    {key: 'PTD_PAY_RATE', areaName: 'e', valueFormat: 'percent', sort: null},
                ],
                // 合并项
                // 首行或首列 尾行或尾列
                sum: {
                    first: {
                        show: false,
                    },
                    last: {
                        show: false,
                    }
                },
                // 放数据
                dataSource: [
                    {SHOP_GROUP: '/', SHOP_NAME: '/', PTD_PAY_TGT: '/', PTD_PAY_AMT: '/', PTD_PAY_RATE: '/'}
                ],
                pagination: {
                    show: true,
                    page: 1,
                    pageSize: 12,
                    pageSizeOptions: ['12', '20', '30', '50', '100'],
                    total: 0,
                },
            },
            // 线下区域
            table1: {
                // height: '200px',
                maxHeight: 'calc(100% - 63px)',
                height: 'calc(100% - 63px)',
                sorting: {
                    field: 'PTD_PAY_TGT',
                    order: 'desc',
                },
                currentClick: {
                    i: 0,
                    j: 0,
                    value: '合计',
                },
                header: {
                    area: [
                        ['a', 'b', 'c', 'd'],
                    ],
                    data: {
                        a: '区域（全部）',
                        b: '目标',
                        c: '实际',
                        d: '达成',
                    },
                },
                // 配置字段
                // valueFormat sumFirstFormat sumLastFormat 可以是字符串或函数
                tableColumn: [
                    {key: 'S_OR_N', areaName: 'a', valueFormat: 'normal', canClick: true},
                    {key: 'PTD_PAY_TGT', areaName: 'b', valueFormat: 'round', sort: 'down'},
                    {key: 'PTD_PAY_AMT', areaName: 'c', valueFormat: 'round', sort: null},
                    {key: 'PTD_PAY_RATE', areaName: 'd', valueFormat: 'percent', sort: null},
                ],
                // 合并项
                // 首行或首列 尾行或尾列
                sum: {
                    first: {
                        show: false,
                    },
                    last: {
                        show: false,
                    }
                },
                // 放数据
                dataSource: [
                    {S_OR_N: '/', PTD_PAY_TGT: '/', PTD_PAY_AMT: '/', PTD_PAY_RATE: '/'}
                ],
                pagination: {
                    show: true,
                    page: 1,
                    pageSize: 12,
                    pageSizeOptions: ['12', '20', '30', '50', '100'],
                    total: 0,
                },
            },
            tableData: [],
            tableData1: [],
            date: moment().format('YYYYMMDD'),
            line1: null,
            line2: null,
            // 由选项和 表格点击行影响
            // currentQuery: {}
        }
    },
    methods: {
        disabledDate(current){
            return current && current > moment().startOf('day');
        },
        async getOption(){
            let {data} = await this.$fetchSql('all_center', 'all_center_pay_rt_shop_online_dtl')
            data.sort((a, b) => b.PTD_PAY_AMT - a.PTD_PAY_AMT)
            this.allOptions = data.concat()
            this.groupAndStore[0].options = Array.from(new Set(data.map(_ => _.SHOP_GROUP)))
            this.groupAndStore[0].options.unshift('全部')
            this.groupAndStore[0].value = ['全部']
            this.groupAndStore[1].options = Array.from(new Set(data.map(_ => _.SHOP_NAME)))
            this.groupAndStore[1].options.unshift('全部')
            this.groupAndStore[1].value = ['全部']
        },
        async getTable(){
            let query = {}
            let api
            if(this.tab.value === '线上店铺'){
                let {value:SHOP_GROUP} = this.groupAndStore[0]
                let {value:SHOP_NAME} = this.groupAndStore[1]
                if(SHOP_GROUP.toString() !== '全部') query.SHOP_GROUP = SHOP_GROUP.toString()
                if(SHOP_NAME.toString() !== '全部') query.SHOP_NAME = SHOP_NAME.toString()
                api = 'all_center_pay_rt_shop_online_dtl'
            }
            else {
                let { value:PRODUCT_CATE } = this.categories
                if(PRODUCT_CATE !== '全部') query.PRODUCT_CATE = PRODUCT_CATE
                api = 'all_center_pay_rt_shop_offline_dtl'
            }
            let {data} = await this.$fetchSql('all_center', api, query)
            if(this.tab.value === '线上店铺'){
                this.tableData = data.concat()
                this.handleData('table', data)
            }
            else{
                this.tableData1 = data.concat()
                this.handleData('table1', data)
            }

        },
        async getTrend(){
            let query = {
                TDATE: this.date - 10000 + ''
            }
            let api
            if(this.tab.value === '线上店铺'){
                let {value:SHOP_NAME} = this.table.currentClick
                if(SHOP_NAME !== '合计') query.SHOP_NAME = SHOP_NAME
                else {
                    let {value:SHOP_GROUP_1} = this.groupAndStore[0]
                    let {value:SHOP_NAME_1} = this.groupAndStore[1]
                    if(SHOP_GROUP_1.toString() !== '全部') query.SHOP_GROUP = SHOP_GROUP_1.toString()
                    if(SHOP_NAME_1.toString() !== '全部') query.SHOP_NAME = SHOP_NAME_1.toString()
                }
                api = 'all_center_pay_rt_shop_online_trend'
            }
            else {
                let {value:PRODUCT_CATE} = this.categories
                if(PRODUCT_CATE !== '全部') query.PRODUCT_CATE = PRODUCT_CATE
                let {value:S_OR_N} = this.table1.currentClick
                if(S_OR_N !== '合计') query.S_OR_N = S_OR_N
                api = 'all_center_pay_rt_shop_offline_trend'
            }
            let {data} = await this.$fetchSql('all_center', api, query)
            await this.handleData('trend', data)
        },
        handleData(type, source){
            if(type === 'table'){
                let arr = _.cloneDeep(source)
                this.table.dataSource = [
                    {SHOP_GROUP: '/', SHOP_NAME: '/', PTD_PAY_TGT: '/', PTD_PAY_AMT: '/', PTD_PAY_RATE: '/'}
                ]
                if(!arr.length) return
                let {field, order} = this.table.sorting
                if(field !== 'rownum' && order === 'asc') arr.sort((a, b) => a[field] - b[field])
                else if(field !== 'rownum' && order === 'desc') arr.sort((a, b) => b[field] - a[field])
                this.table.pagination.total = arr.length
                let {page, pageSize} = this.table.pagination
                let initial = {
                    SHOP_GROUP: '--',
                    SHOP_NAME: '合计',
                    PTD_PAY_TGT: 0,
                    PTD_PAY_AMT: 0
                }
                let sum = arr.reduce((a, b) => {
                    return {
                        SHOP_GROUP: '--',
                        SHOP_NAME: '合计',
                        PTD_PAY_TGT: a.PTD_PAY_TGT + b.PTD_PAY_TGT,
                        PTD_PAY_AMT: a.PTD_PAY_AMT + b.PTD_PAY_AMT
                    }
                }, initial)
                if([undefined, null].includes(sum.PTD_PAY_AMT) || [undefined, null, 0].includes(sum.PTD_PAY_TGT)) sum.PTD_PAY_RATE = null
                else sum.PTD_PAY_RATE = sum.PTD_PAY_AMT / sum.PTD_PAY_TGT
                this.table.dataSource = arr.slice((page - 1) * pageSize, page * pageSize)
                this.table.dataSource.unshift(sum)
            }
            else if(type === 'trend'){
                let arr = _.cloneDeep(source)
                // this.line1
                arr.sort((a, b) => a.TDATE_HOURS - b.TDATE_HOURS)
                this.line1.xAxis[0].data = []
                this.line2.xAxis[0].data = []
                for(let i = 0; i < 24; i ++){
                    this.line1.xAxis[0].data.push(i + '')
                    this.line2.xAxis[0].data.push(i + '')
                }
                this.line1.series[0].data = []
                this.line1.series[1].data = []
                this.line2.series[0].data = []
                this.line2.series[1].data = []
                this.$refs.barAndLine1.$refs.echarts.clear();
                this.$refs.barAndLine2.$refs.echarts.clear();
                if(!arr.length) return
                let line1Keys = ['TDATE_HOURS', 'PTD_PAY_AMT']
                this.line1.series[0].data = arr.map((item, index) => {
                    if(item.TDATE_HOURS > moment().format('HH')) return 'null' + index
                    return line1Keys.map(key => {
                        if(key === 'TDATE_HOURS') return this.handleHour(item[key])
                        return item[key]
                    })
                })
                let line1Keys1 = ['TDATE_HOURS', 'AGO_PAY_AMT']
                this.line1.series[1].data = arr.map(item => {
                    return line1Keys1.map(key => {
                        if(key === 'TDATE_HOURS') return this.handleHour(item[key])
                        return item[key]
                    })
                })
                let line2Keys = ['TDATE_HOURS', 'PTD_PAY_AMT_TOT']
                this.line2.series[0].data = arr.map((item, index) => {
                    if(item.TDATE_HOURS > moment().format('HH')) return 'null' + index
                    return line2Keys.map(key => {
                        if(key === 'TDATE_HOURS') return this.handleHour(item[key])
                        return item[key]
                    })
                })
                let line2Keys1 = ['TDATE_HOURS', 'AGO_PAY_AMT_TOT']
                this.line2.series[1].data = arr.map(item => {
                    return line2Keys1.map(key => {
                        if(key === 'TDATE_HOURS') return this.handleHour(item[key])
                        return item[key]
                    })
                })
            }
            else if(type === 'table1'){
                let arr = _.cloneDeep(source)
                this.table1.header.data.a = `区域（${this.categories.value}）`
                this.table1.dataSource = [
                    {S_OR_N: '/', PTD_PAY_TGT: '/', PTD_PAY_AMT: '/', PTD_PAY_RATE: '/'}
                ]
                if(!arr.length) return
                let {field, order} = this.table1.sorting
                if(field !== 'rownum' && order === 'asc') arr.sort((a, b) => a[field] - b[field])
                else if(field !== 'rownum' && order === 'desc') arr.sort((a, b) => b[field] - a[field])
                this.table1.pagination.total = arr.length
                let {page, pageSize} = this.table1.pagination
                let initial = {
                    S_OR_N: '合计',
                    PTD_PAY_TGT: 0,
                    PTD_PAY_AMT: 0,
                    PTD_PAY_RATE: 0
                }
                let sum = arr.reduce((a, b) => {
                    return {
                        S_OR_N: '合计',
                        PTD_PAY_TGT: a.PTD_PAY_TGT + b.PTD_PAY_TGT,
                        PTD_PAY_AMT: a.PTD_PAY_AMT + b.PTD_PAY_AMT
                    }
                }, initial)
                if([undefined, null].includes(sum.PTD_PAY_AMT) || [undefined, null, 0].includes(sum.PTD_PAY_TGT)) sum.PTD_PAY_RATE = null
                else sum.PTD_PAY_RATE = sum.PTD_PAY_AMT / sum.PTD_PAY_TGT
                this.table1.dataSource = arr.slice((page - 1) * pageSize, page * pageSize)
                this.table1.dataSource.unshift(sum)
            }
        },
        handleHour(hour){
            if(hour === '00') return '0'
            else if(hour < 10 && hour > 0) return hour.split('0')[1]
            else if(hour >= 10) return hour
        }
    }
}
</script>

<style lang="scss" scoped>
.ChannelDetailsV1{
    margin-top: 10px;
    width: 100%;
    height: calc(100% - 38px);
    .selects{
        height: 48px;
        //background: #FAFAFA;
        display: flex;
        align-items: center;
        //padding: 0 12px;
        /deep/ .ant-tabs-bar{
            margin-bottom: 0;
            border-bottom: 0;
        }
        /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container{
            height: 28px;
        }
        /deep/ .ant-tabs-tab:not(.ant-tabs-tab-active):hover {
            background: rgba(0,0,0,.05);

        }
        /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab{
            margin-right: 0;
            height: 28px;
            line-height: 26px;
        }
        /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active{
            position: relative;
            &::before{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: #00B08D;
                //border-top: 2px solid #fff
            }
        }
    }
    .bottomBox{
        height: calc(100% - 64px);
        margin-top: 16px;
        display: flex;
        /deep/ .TableBox{
            //td:nth-child(1){
            //    width: 80px;
            //    flex: none;
            //}
            td:nth-child(2){
                width: 150px;
                flex: none;
                justify-content: var(--tabValue)
            }
        }
        /deep/ .online{
            td:nth-child(1){
                width: 80px;
                flex: none;
            }
        }
        .right{
            width: calc(60% - 16px);
        }
    }
}
</style>