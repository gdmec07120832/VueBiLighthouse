<template>
    <div class="StoreDetails">
        <div class="selects">
            <a-tabs v-model="tab.value" type="card" size="small">
                <a-tab-pane v-for="item in tab.options" :key="item" :tab="item">
                </a-tab-pane>
            </a-tabs>
            <div style="flex: 1;"></div>
            <virtual-select
            style="width: 275px;margin-right: 20px"
            v-model="selects[0].value"
            :label="selects[0].label"
            :options="selects[0].options.map((_) => ({ label: _ }))"
            :allowShowClear="false"
            ></virtual-select>
            <virtual-select
            style="width: 275px;margin-right: 0"
            v-model="selects[1].value"
            :label="selects[1].label"
            :options="selects[1].options.map((_) => ({ label: _ }))"
            :allowShowClear="false"
            ></virtual-select>
        </div>
        <div class="bottomBox">
            <Table style="width: calc(40% - 16px);height: 100%;" v-bind.sync="table"/>
            <div style="width: 32px"></div>
            <div class="right">
                <div>{{table.currentClick.i == 0 ? '合计' : table.currentClick.value}}</div>
                <AnySizeTitle title="业绩达成趋势"/>
                <v-chart ref="barAndLine" :options="barAndLine" style="overflow: visible;height: calc(50% - 33.5px);" class="Circle mb10" autoresize></v-chart>
                <AnySizeTitle title="业绩同期对比"/>
                <v-chart ref="line" :options="line" style="overflow: visible;height: calc(50% - 33.5px);" class="Circle" autoresize></v-chart>
            </div>
        </div>
    </div>
</template>

<script>
import base from '../../../../utils/base.js'
// import Select from '../../../components/Select'
import Table from '../../../../components/TableRow'
import AnySizeTitle from "../../../../components/AnySizeTitle";
import _ from 'lodash'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import moment from 'moment'
export default {
    mixins: [ base ],
    components: {
        // Select,
        Table,
        AnySizeTitle,
        VirtualSelect,
    },
    props: {
        duration: Number,
        date: {
            type: Array,
            default() {return [moment().startOf('month'), moment()]}
        },
        tab: {
            type: Object,
            default() {return []}
        },
        tableApi: {
            type: String,
            default: 'all_center_send_shop_online_dtl',
        },
        trendApi: {
            type: String,
            default: 'all_center_send_shop_online_trend',
        },
    },
    async created() {
        let that = this
        this.line = await this.createLine({
            tooltipFormatter: ['round', 'round'],
            xAxisLabelFormatter: 'normal',
            yAxisLabelFormatter: 'tenThousand'
        })
        this.barAndLine = await this.createBarAndLineEchart({
            tooltipFormatter: ['round', 'round'],
            xAxisLabelFormatter: 'normal',
            yAxisLabelFormatter: 'tenThousand'
        })
        delete this.barAndLine.legend
        // this.barAndLine.series[0].itemStyle = {
        //     normal: {
        //         color: function (params) {
        //             let color = ['#00a854', '#ff5953', '#5b8ff9']
        //             let index
        //             if(params.data[2] > 1) index = 1
        //             else if(params.data[2] < 1) index = 0
        //             else if([null, undefined].includes(params.data[2])) index = 2
        //             return color[index]
        //         },
        //         barBorderRadius: [10, 10, 0, 0]
        //     }
        // }
        this.barAndLine.yAxis.push({
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false,
                formatter: function(val){
                    return that.handleNum('percent', val)
                },
            },
            splitLine: {
                show: false,
            }
        })
        this.barAndLine.grid.top = 10
        this.barAndLine.series[0].name = '业绩'
        this.barAndLine.series[0].data = []
        // this.barAndLine.series[1].yAxisIndex = 1
        this.barAndLine.series[1].name = '目标'
        this.barAndLine.series[1].data = []
        this.line.legend.show = false
        this.line.grid.top = 10
        this.line.series[0].data = []
        this.line.series[0].name = '业绩'
        this.line.series[1].data = []
        this.line.series[1].name = '同期'
        await this.getOptions()
        this.getTable()
        this.getTrend()
        this.timer = setInterval(() => {
            that.getTable()
            let SHOP_GROUP = that.selects[0].value.toString()
            let SHOP_NAME = that.selects[1].value.toString()
            that.getTrend(SHOP_GROUP !== '全部' ? SHOP_GROUP : null, SHOP_NAME !== '全部' ? SHOP_NAME : null)
        }, that.duration)
    },
    beforeDestroy() {
        this.barAndLine !== null ? this.barAndLine = null : null
        this.line !== null ? this.line = null : null
        clearInterval(this.timer)
    },
    watch: {
        date: {
            async handler(){
                await this.getOptions()
                this.getTable()
                let SHOP_GROUP = this.selects[0].value.toString()
                let SHOP_NAME = this.selects[1].value.toString()
                this.getTrend(SHOP_GROUP !== '全部' ? SHOP_GROUP : null, SHOP_NAME !== '全部' ? SHOP_NAME : null)
            },
            deep: true,
        },
        'table.pagination.page': {
            handler(){
                this.handleData('table', this.tableData)
            }
        },
        'table.pagination.pageSize': {
            handler(){
                this.table.pagination.page = 1
                this.handleData('table', this.tableData)
            }
        },
        'table.currentClick': {
            handler(val, oval){
                console.log(val, oval)
                if(JSON.stringify(val) === JSON.stringify(oval)) return
                if(val.i == 0){
                    let SHOP_GROUP = this.selects[0].value.toString()
                    let SHOP_NAME = this.selects[1].value.toString()
                    this.getTrend(SHOP_GROUP === '全部' ? null: SHOP_GROUP, SHOP_NAME === '全部' ? null : SHOP_NAME)

                }
                else if(val.i != 0){
                    this.getTrend(null, val.value)
                }
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
                this.filterSHOP_NAME()
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
            }
        },
        twoSelects: {
            handler(val){
                this.table.pagination.page = 1
                this.getTable()
                let SHOP_GROUP = val.split('**')[0]
                let SHOP_NAME = val.split('**')[1]
                this.getTrend(SHOP_GROUP === '全部' ? null: SHOP_GROUP, SHOP_NAME === '全部' ? null : SHOP_NAME)
            }
        },
        'table.sorting': {
            handler(val){
                this.table.currentClick = {
                    value: '合计',
                    i: 0,
                    j: 0
                }
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
    },
    computed: {
        twoSelects(){
            return this.selects[0].value + '**' + this.selects[1].value
        }
    },
    data() {
        this.filterSHOP_NAME = _.debounce(this.filterSHOP_NAME, 300, {
            leading: false,
            trailing: true,
        })
        this.getTable = _.debounce(this.getTable, 300, {
            leading: false,
            trailing: true,
        })
        this.getTrend = _.debounce(this.getTrend, 300, {
            leading: false,
            trailing: true,
        })
        return {
            timer: null,
            currentTab: 1,
            selects: [
                {
                    label: '平台搜索',
                    value: [],
                    options: [],
                },
                {
                    label: '店铺选择',
                    value: [],
                    options: [],
                },
            ],
            table: {
                // height: '200px',
                maxHeight: 'calc(100% - 63px)',
                height: 'calc(100% - 63px)',
                sorting: {
                    field: 'PTD_SEND_AMT',
                    order: 'desc',
                },
                currentClick: {
                    i: 0,
                    j: 0,
                    value: '合计'
                },
                header: {
                    area: [
                        ['a', 'b', 'c', 'd', 'e', 'f'],
                    ],
                    data: {
                        a: '线上店铺',
                        b: '目标',
                        c: '实际',
                        d: '达成',
                        e: '同期',
                        f: '同比',
                    },
                },
                // 配置字段
                // valueFormat sumFirstFormat sumLastFormat 可以是字符串或函数
                tableColumn: [
                    {key: 'SHOP_NAME', areaName: 'a', valueFormat: 'normal', sumFirstFormat: 'normal', canClick: true},
                    {key: 'PTD_SEND_TGT', areaName: 'b', valueFormat: 'round', sumFirstFormat: 'round', sort: null},
                    {key: 'PTD_SEND_AMT', areaName: 'c', valueFormat: 'round', sumFirstFormat: 'round', sort: 'down'},
                    {key: 'PTD_SEND_RATE', areaName: 'd', valueFormat: 'percent', sumFirstFormat: 'percent', colorFormat: 'reach', sort: null},
                    {key: 'AGO_SEND_AMT', areaName: 'e', valueFormat: 'round', sumFirstFormat: 'round', sort: null},
                    {key: 'YOY_SEND_RATE', areaName: 'f', valueFormat: 'percent', sumFirstFormat: 'percent', colorFormat: 'YOY', sort: null},
                ],
                // 合并项
                // 首行或首列 尾行或尾列
                sum: {
                    first: {
                        show: true,
                        // 暂时只能固定一行 一列 多的会被覆盖
                        data: [],
                        sticky: true,
                    },
                    last: {
                        show: false,
                    }
                },
                // 放数据
                dataSource: [
                    {SHOP_NAME: '/', PTD_SEND_TGT: '/', PTD_SEND_AMT: '/', PTD_SEND_RATE: '/', AGO_SEND_AMT: '/', YOY_SEND_RATE: '/'}
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
            barAndLine: null,
            line: null,
            allData: [],
        }
    },
    methods: {
        filterSHOP_NAME(){
            let arr = _.cloneDeep(this.selects[0].value)
            if(arr.includes('全部')) {
                this.selects[1].options = Array.from(new Set(this.allData.map(_ => _.SHOP_NAME).filter(_ => _ !== '合计')))
                this.selects[1].value = ['全部']
                this.selects[1].options.unshift('全部')
            }
            else {
                this.selects[1].options = Array.from(new Set(this.allData.filter(_ => arr.indexOf(_.SHOP_GROUP) > -1).map(_ => _.SHOP_NAME).filter(_ => _ !== '合计')))
                this.selects[1].value = ['全部']
                this.selects[1].options.unshift('全部')
            }
        },
        async getOptions(){
            let query = {
                START_TIME: this.date[0].format('YYYYMMDD'),
                END_TIME: this.date[1].format('YYYYMMDD')
            }
            let res = await this.$fetchSql('all_center', this.tableApi, query)
            res.data.sort((a, b) => b.PTD_SEND_AMT - a.PTD_SEND_AMT)
            this.allData = _.cloneDeep(res.data)
            this.selects[0].options = Array.from(new Set(res.data.map(_ => _.SHOP_GROUP).filter(_ => _ !== '合计')))
            this.selects[0].value = ['全部']
            this.selects[0].options.unshift('全部')
            this.selects[1].options = Array.from(new Set(res.data.map(_ => _.SHOP_NAME).filter(_ => _ !== '合计')))
            this.selects[1].value = ['全部']
            this.selects[1].options.unshift('全部')
        },
        async getTable(){
            let query = {
                START_TIME: this.date[0].format('YYYYMMDD'),
                END_TIME: this.date[1].format('YYYYMMDD')
            }
            if(this.selects[0].value.indexOf('全部') === -1) query.SHOP_GROUP = this.selects[0].value.toString()
            if(this.selects[1].value.indexOf('全部') === -1) query.SHOP_NAME = this.selects[1].value.toString()
            let res = await this.$fetchSql('all_center', this.tableApi, query)
            this.tableData = _.cloneDeep(res.data)
            this.handleData('table', res.data)
        },
        async getTrend(SHOP_GROUP = null, SHOP_NAME = null){
            let query = {
                START_TIME: this.date[0].format('YYYYMMDD'),
                END_TIME: this.date[1].format('YYYYMMDD')
            }
            if(SHOP_GROUP !== null) query.SHOP_GROUP = SHOP_GROUP
            if(SHOP_NAME !== null) query.SHOP_NAME = SHOP_NAME
            let res = await this.$fetchSql('all_center', this.trendApi, query)
            this.handleData('trend', res.data)
        },
        handleData(type, source){
            if(type === 'table'){
                let arr = _.cloneDeep(source)
                this.table.sum.first.data = []
                this.table.dataSource = [
                    {SHOP_NAME: '/', PTD_SEND_TGT: '/', PTD_SEND_AMT: '/', PTD_SEND_RATE: '/', AGO_SEND_AMT: '/', YOY_SEND_RATE: '/'}
                ]
                if(!arr.length) return
                let {field, order} = this.table.sorting
                if(field !== 'rownum' && order === 'asc') arr.sort((a, b) => a[field] - b[field])
                else if(field !== 'rownum' && order === 'desc') arr.sort((a, b) => b[field] - a[field])
                let {page, pageSize} = this.table.pagination
                this.table.pagination.total = arr.length - 1
                this.table.sum.first.data = arr.filter(_ => _.SHOP_NAME === '合计')
                this.table.dataSource = arr.filter(_ => _.SHOP_NAME !== '合计').slice((page - 1) * pageSize, page * pageSize)
            }
            else if(type === 'trend'){
                let arr = _.cloneDeep(source)
                if(!this.barAndLine) return
                this.barAndLine.xAxis[0].data = []
                this.barAndLine.series[0].data = []
                this.barAndLine.series[1].data = []
                this.line.xAxis[0].data = []
                this.line.series[0].data = []
                this.line.series[1].data = []
                this.$refs?.barAndLine?.$refs?.echarts?.clear()
                this.$refs?.line?.$refs?.echarts?.clear()
                if(!arr.length) return
                arr.sort((a, b) => a.TDATE_DAY - b.TDATE_DAY)
                let keys = ['TDATE_DAY', 'PTD_SEND_AMT', 'PTD_SEND_TGT']
                let keys1 = ['TDATE_DAY', 'PTD_SEND_AMT', 'AGO_SEND_AMT']
                this.barAndLine.xAxis[0].data = Array.from(new Set(arr.map(_ => _.TDATE_DAY)))
                this.barAndLine.series[0].data = arr.map(item => {
                    return keys.map(key => {
                        if(key === 'PTD_SEND_AMT' && moment(item.TDATE + '').format('x') > moment().format('x')) return null
                        return item[key]
                    })
                })
                this.barAndLine.series[1].data = arr.map(item => {
                    return [
                        item.TDATE_DAY,
                        item.PTD_SEND_TGT
                    ]
                })
                this.line.xAxis[0].data = Array.from(new Set(arr.map(_ => _.TDATE_DAY)))
                this.line.series[0].data = arr.map(item => {
                    return keys1.map(key => {
                        if(key === 'PTD_SEND_AMT' && moment(item.TDATE + '').format('x') > moment().format('x')) return null
                        return item[key]
                    })
                })
                this.line.series[1].data = arr.map(item => {
                    return [
                        item.TDATE_DAY,
                        item.AGO_SEND_AMT
                    ]
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.StoreDetails{
    height: 100%;
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
            td:nth-child(1){
                width: 150px;
                flex: none;
            }
        }
        .right{
            width: calc(60% - 16px);
        }
    }

}
</style>