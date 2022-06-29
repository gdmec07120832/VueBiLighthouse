<template>
    <div class="StoreDetails">
        <div class="selects">
            <a-tabs v-model="tab.value" type="card" size="small">
                <a-tab-pane v-for="item in tab.options" :key="item" :tab="item">
                </a-tab-pane>
            </a-tabs>
            <div style="flex: 1;"></div>
            <Radio v-bind.sync="selects[0]"/>
        </div>
        <div class="bottomBox">
            <Table style="width: calc(40% - 16px);height: 100%;" v-bind.sync="table"/>
            <div style="width: 32px"></div>
            <div class="right">
<!--                <div>{{table.currentClick.value}}（{{this.selects[0].value}}）</div>-->
                <div>{{table.currentClick.i == 0 ? '合计' : table.currentClick.value}}（{{this.selects[0].value}}）</div>
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
import Table from '../../../../components/TableRow'
import AnySizeTitle from "../../../../components/AnySizeTitle";
import _ from 'lodash'
import moment from 'moment'
import Radio from '../../../../components/Radio'
export default {
    mixins: [ base ],
    components: {
        Table,
        AnySizeTitle,
        Radio,
    },
    props: {
        duration: Number,
        date: {
            type: Array,
            default() {return [moment().startOf('month'), moment()]}
        },
        tab: {
            type: Object,
            default() {return {value: '线下区域',options: ['线上店铺', '线下区域']}}
        },
        tableApi: {
            type: String,
            default: 'all_center_send_shop_offline_dtl',
        },
        trendApi: {
            type: String,
            default: 'all_center_send_shop_offline_trend',
        },
    },
    async created() {
        let that = this
        this.barAndLine = await this.createBarAndLineEchart({
            tooltipFormatter: ['round', 'round'],
            xAxisLabelFormatter: 'normal',
            yAxisLabelFormatter: 'tenThousand'
        })
        this.line = await this.createLine({
            tooltipFormatter: ['round', 'round'],
            xAxisLabelFormatter: 'normal',
            yAxisLabelFormatter: 'tenThousand'
        })
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
        delete this.barAndLine.legend
        this.barAndLine.grid.top = 10
        this.barAndLine.series[0].name = '业绩'
        this.barAndLine.series[0].data = []
        this.barAndLine.series[1].name = '目标'
        this.barAndLine.series[1].data = []
        // this.barAndLine.series[1].yAxisIndex = 1
        this.line.legend.show = false
        this.line.grid.top = 10
        this.line.series[0].data = []
        this.line.series[0].name = '业绩'
        this.line.series[1].data = []
        this.line.series[1].name = '同期'
        this.getTable()
        this.getTrend()
        this.timer = setInterval(() => {
            that.getTable()
            let PRODUCT_CATE = that.selects[0].value.toString()
            that.getTrend(PRODUCT_CATE !== '全部' ? PRODUCT_CATE : null, null)
        }, that.duration)
    },
    beforeDestroy() {
        this.barAndLine !== null ? this.barAndLine = null : null
        this.line !== null ? this.line = null : null
        clearInterval(this.timer)
    },
    watch: {
        date: {
            handler(){
                this.getTable()
                let PRODUCT_CATE = this.selects[0].value.toString()
                this.getTrend(PRODUCT_CATE !== '全部' ? PRODUCT_CATE : null, null)
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
                if(val.i + val.value === oval.i + oval.value) return
                if(val.i == 0){
                    let PRODUCT_CATE = this.selects[0].value.toString()
                    this.getTrend(PRODUCT_CATE === '全部' ? null: PRODUCT_CATE, null)
                }
                else if(val.i != 0){
                    let PRODUCT_CATE = this.selects[0].value.toString()
                    this.getTrend(PRODUCT_CATE === '全部' ? null: PRODUCT_CATE, val.value)
                }
            }
        },
        'selects.0.value': {
            handler(val){
                this.getTable()
                this.getTrend(val.toString() !== '全部' ? val.toString() : null, null)
            }
        },
        'table.sorting': {
            handler(val){
                this.table.currentClick.value = '合计'
                this.table.currentClick.i = 0
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
    data() {
        return {
            timer: null,
            currentTab: 1,
            selects: [
                {
                    label: '主营类目',
                    value: '全部',
                    options: ['全部', '成品', '定制'],
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
                    value: '合计',
                },
                header: {
                    area: [
                        ['a', 'b', 'c', 'd', 'e', 'f'],
                    ],
                    data: {
                        a: '线下区域',
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
                    {key: 'S_OR_N', areaName: 'a', valueFormat: 'normal', sumFirstFormat: 'normal', canClick: true},
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
                    {S_OR_N: '/', PTD_SEND_TGT: '/', PTD_SEND_AMT: '/', PTD_SEND_RATE: '/', AGO_SEND_AMT: '/', YOY_SEND_RATE: '/'}
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
        async getTable(){
            let query = {
                START_TIME: this.date[0].format('YYYYMMDD'),
                END_TIME: this.date[1].format('YYYYMMDD')
            }
            if(this.selects[0].value.indexOf('全部') === -1) query.PRODUCT_CATE = this.selects[0].value.toString()
            let res = await this.$fetchSql('all_center', this.tableApi, query)
            this.tableData = _.cloneDeep(res.data)
            this.handleData('table', res.data)
        },
        async getTrend(PRODUCT_CATE = null, S_OR_N = null){
            let query = {
                START_TIME: this.date[0].format('YYYYMMDD'),
                END_TIME: this.date[1].format('YYYYMMDD')
            }
            if(PRODUCT_CATE !== null) query.PRODUCT_CATE = PRODUCT_CATE
            if(S_OR_N !== null) query.S_OR_N = S_OR_N
            let res = await this.$fetchSql('all_center', this.trendApi, query)
            this.handleData('trend', res.data)
        },
        handleData(type, source){
            if(type === 'table'){
                let arr = _.cloneDeep(source)
                this.table.header.data.a = `线下区域（${this.selects[0].value}）`
                this.table.sum.first.data = []
                this.table.dataSource = [
                    {S_OR_N: '/', PTD_SEND_TGT: '/', PTD_SEND_AMT: '/', PTD_SEND_RATE: '/', AGO_SEND_AMT: '/', YOY_SEND_RATE: '/'}
                ]
                if(!arr.length) return
                let {field, order} = this.table.sorting
                if(field !== 'rownum' && order === 'asc') arr.sort((a, b) => a[field] - b[field])
                else if(field !== 'rownum' && order === 'desc') arr.sort((a, b) => b[field] - a[field])
                let {page, pageSize} = this.table.pagination
                this.table.pagination.total = arr.length - 1
                this.table.sum.first.data = arr.filter(_ => _.S_OR_N === '合计')
                this.table.dataSource = arr.filter(_ => _.S_OR_N !== '合计').slice((page - 1) * pageSize, page * pageSize)
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