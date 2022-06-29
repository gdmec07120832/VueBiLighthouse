<template>
    <div class="ChannelOverview">
        <div class="panelBox" style="cursor: pointer">
            <div class="circlePanel" :class="active('全司')" @click="clickPanel('全司')">
                <CircleEchart ref="circle" v-bind="circle" class="circle"/>
                <Panel style="width: calc(100% - 120px)" v-bind="circlePanel"/>
            </div>
            <Panel class="normalPanel" :class="active(item.name)" @click.native="clickPanel(item.name)" v-for="(item, index) in config" :key="index" v-bind="item"/>
        </div>
        <v-chart ref="echart" :options="echart" style="overflow: visible;height: calc(100% - 120px - 10px - 10px - 100px - 10px - 100px)" class="Circle mt10" autoresize></v-chart>
        <Table v-bind="table" class="mt10"/>
        <Table v-bind="table1" class="mt10"/>
    </div>
</template>

<script>
import moment from "moment";
import base from '../../../../utils/base.js'
import Panel from '../../../../components/Panel'
import CircleEchart from '../../../../components/CircleEchart'
import Table from '../../../../components/TableOld'
import _ from 'lodash'
import echartStyle from "@/views/BIView/ProductSupply/StrikeCockpit/utils/echartStyle";
export default {
    mixins: [ base ],
    components: {
        Panel,
        CircleEchart,
        Table,
    },
    props: {
        duration: Number,
        date: {
            type: Array,
            default() {return [moment(), moment()]}
        },
        panelApi: {
            type: String,
            default: 'all_center_send_chnl_sum',
        },
        trendApi: {
            type: String,
            default: 'all_center_send_chnl_trend',
        },
    },
    async created() {
        this.echart = await this.createBarAndLineEchart({
            tooltipFormatter: ['round', 'round'],
            xAxisLabelFormatter: 'normal',
            yAxisLabelFormatter: 'tenThousand'
        })
        this.echart.yAxis[0].show = false
        delete this.echart.legend
        // this.echart.tooltip = {}
        this.echart.grid.top = 10
        this.echart.xAxis[0].data = []
        this.echart.series[0].name = '业绩'
        this.echart.series[0].data = []
        this.echart.series[1].color = '#ccc'
        this.echart.series[1].name = '目标'
        this.echart.series[1].data = []
        this.getPanel()
        this.getTrend()
        let that = this
        this.timer = setInterval(() => {
            that.getPanel()
            that.getTrend()
        }, that.duration)
        console.log(this.echart)
    },
    beforeDestroy() {
        // this.echart !== null ? this.echart = null : null
        clearInterval(this.timer)
    },
    watch: {
        currentPanel: {
            handler() {
                this.getTrend()
            }
        },
        date: {
            handler() {
                this.getPanel()
                this.getTrend()
            },
            deep: true
        }
    },
    data() {
        let area = [
            ['a', 'a', 'a', 'a'],
            ['b', 'b', 'b', 'b'],
            ['c', 'd', 'e', 'f'],
            ['g', 'h', 'i', 'j'],
        ]
        return {
            timer: null,
            circle: {
                value: '--',
                id: 1,
                comp: 'T1_PaymentPerformance',
            },
            circlePanel: {
                name: '全司',
                tabIndex: 'T1_PaymentPerformance',
                row: 4,
                column: 4,
                area: area,
                map: [
                    {areaName: 'a', value: '业绩总览', className: 'title'},
                    {areaName: 'b', keyName: 'PTD_SEND_AMT', className: 'subTitle', valueFormat: 'round'},
                    {areaName: 'c', value: '目标', className: 'label'},
                    {areaName: 'd', keyName: 'PTD_SEND_TGT', className: 'value',  valueFormat: 'hundredMillion_double_dot'},
                    {areaName: 'e', value: '同比', className: 'label'},
                    {areaName: 'f', keyName: 'YOY_SEND_RATE', className: 'value', valueFormat: 'percent'},
                    {areaName: 'g', value: '差额', className: 'label'},
                    {areaName: 'h', keyName: 'PTD_SEND_DIFF', className: 'value', valueFormat: 'hundredMillion_double_dot', colorFormat: 'diff'},
                    {areaName: 'i', value: '同期', className: 'label'},
                    {areaName: 'j', keyName: 'AGO_SEND_AMT', className: 'value', valueFormat: 'hundredMillion_double_dot'},
                ],
                dataSource: {}
            },
            currentPanel: '全司',
            config: [
                {
                    name: '线上渠道',
                    tabIndex: 'T1_PaymentPerformance',
                    row: 4,
                    column: 4,
                    area: area,
                    map: [
                        {areaName: 'a', value: '线上渠道', className: 'title'},
                        {areaName: 'b', keyName: 'PTD_SEND_AMT', className: 'subTitle', valueFormat: 'round'},
                        {areaName: 'c', value: '目标', className: 'label'},
                        {areaName: 'd', keyName: 'PTD_SEND_TGT', className: 'value',  valueFormat: 'hundredMillion_double_dot'},
                        {areaName: 'e', value: '同比', className: 'label'},
                        {areaName: 'f', keyName: 'YOY_SEND_RATE', className: 'value', valueFormat: 'percent',},
                        {areaName: 'g', value: '达成', className: 'label'},
                        {areaName: 'h', keyName: 'PTD_SEND_RATE', className: 'value', valueFormat: 'percent', colorFormat: 'reach'},
                        {areaName: 'i', value: '占总', className: 'label'},
                        {areaName: 'j', keyName: 'TOT_SEND_RATE', className: 'value', valueFormat: 'percent'},
                    ],
                    dataSource: {}
                },
                {
                    name: '线下渠道',
                    tabIndex: 'T1_PaymentPerformance',
                    row: 4,
                    column: 4,
                    area: area,
                    map: [
                        {areaName: 'a', value: '线下渠道', className: 'title'},
                        {areaName: 'b', keyName: 'PTD_SEND_AMT', className: 'subTitle', valueFormat: 'round'},
                        {areaName: 'c', value: '目标', className: 'label'},
                        {areaName: 'd', keyName: 'PTD_SEND_TGT', className: 'value',  valueFormat: 'hundredMillion_double_dot'},
                        {areaName: 'e', value: '同比', className: 'label'},
                        {areaName: 'f', keyName: 'YOY_SEND_RATE', className: 'value', valueFormat: 'percent',},
                        {areaName: 'g', value: '达成', className: 'label'},
                        {areaName: 'h', keyName: 'PTD_SEND_RATE', className: 'value', valueFormat: 'percent', colorFormat: 'reach'},
                        {areaName: 'i', value: '占总', className: 'label'},
                        {areaName: 'j', keyName: 'TOT_SEND_RATE', className: 'value', valueFormat: 'percent'},
                    ],
                    dataSource: {}
                },
                {
                    name: '海外渠道',
                    tabIndex: 'T1_PaymentPerformance',
                    row: 4,
                    column: 4,
                    area: area,
                    map: [
                        {areaName: 'a', value: '海外B2B', className: 'title'},
                        {areaName: 'b', keyName: 'PTD_SEND_AMT', className: 'subTitle', valueFormat: 'round'},
                        {areaName: 'c', value: '目标', className: 'label'},
                        {areaName: 'd', keyName: 'PTD_SEND_TGT', className: 'value',  valueFormat: 'hundredMillion_double_dot'},
                        {areaName: 'e', value: '同比', className: 'label'},
                        {areaName: 'f', keyName: 'YOY_SEND_RATE', className: 'value', valueFormat: 'percent',},
                        {areaName: 'g', value: '达成', className: 'label'},
                        {areaName: 'h', keyName: 'PTD_SEND_RATE', className: 'value', valueFormat: 'percent', colorFormat: 'reach'},
                        {areaName: 'i', value: '占总', className: 'label'},
                        {areaName: 'j', keyName: 'TOT_SEND_RATE', className: 'value', valueFormat: 'percent'},
                    ],
                    dataSource: {}
                },
            ],
            echart: null,
            table: {
                index: 'T1_PaymentPerformance_ChannelOverview',
                labelData: ['日期', '目标', '实际', '达成', '同比'],
                tableData: [],
            },
            table1: {
                index: 'T1_PaymentPerformance_ChannelOverview',
                labelData: ['日期', '目标', '实际', '达成', '同比'],
                tableData: [],
            },
        }
    },
    methods: {
        active(val) {
            if(val === this.currentPanel) return 'active'
            else return ''
        },
        clickPanel(val) {
            this.currentPanel = val
        },
        async getPanel() {
            let query = {
                START_TIME: this.date[0].format('YYYYMMDD'),
                END_TIME: this.date[1].format('YYYYMMDD')
            }
            // this.currentPanel !== '全司' ? query.CHNL_NAME = this.currentPanel : null
            let res = await this.$fetchSql('all_center', this.panelApi, query)
            this.handleData('panel', res.data)
        },
        async getTrend() {
            let query = {
                START_TIME: this.date[0].format('YYYYMMDD'),
                END_TIME: this.date[1].format('YYYYMMDD')
            }
            this.currentPanel !== '全司' ? query.CHNL_NAME = this.currentPanel : null
            let res = await this.$fetchSql('all_center', this.trendApi, query)
            this.handleData('barAndLine', res.data)
            this.handleData('table', res.data)
        },
        handleData(type, source){
            if(type === 'panel'){
                let obj = {
                    CHNL_NAME: null,
                    PTD_SEND_TGT: null,
                    PTD_SEND_AMT: null,
                    AGO_SEND_AMT: null,
                    PTD_SEND_RATE: null,
                    PTD_SEND_DIFF: null,
                    YOY_SEND_RATE: null,
                    TOT_SEND_RATE: null,
                }
                this.circle.value = '--'
                this.circlePanel.dataSource = _.cloneDeep(obj)
                this.config[0].dataSource = _.cloneDeep(obj)
                if(!source.length) return
                this.circle.value = source.filter(_ => _.CHNL_NAME === '全司')[0].PTD_SEND_RATE
                this.circlePanel.dataSource = source.filter(_ => _.CHNL_NAME === '全司')[0]
                this.config[0].dataSource = source.filter(_ => _.CHNL_NAME === '线上渠道')[0]
                this.config[1].dataSource = source.filter(_ => _.CHNL_NAME === '线下渠道')[0]
                this.config[2].dataSource = source.filter(_ => _.CHNL_NAME === '海外渠道')[0]
            }
            else if(type === 'barAndLine'){
                let arr = _.cloneDeep(source)
                this.echart.xAxis[0].data = []
                this.echart.series[0].data = []
                this.echart.series[1].data = []
                this.$refs?.echart?.$refs?.echarts?.clear()
                if(!arr.length) return
                arr.sort((a, b) => a.TDATE - b.TDATE)
                let keys = ['TDATE', 'PTD_SEND_AMT', 'PTD_SEND_TGT']
                this.echart.xAxis[0].data = Array.from(new Set(arr.map(_ => moment(_.TDATE + '').format('M月D日'))))
                this.echart.series[0].data = arr.map(item => {
                    return keys.map(key => {
                        if(key === 'TDATE') return moment(item.TDATE + '').format('M月D日')
                        if(key === 'PTD_SEND_AMT' && moment(item.TDATE + '').format('x') > moment().format('x')) return null
                        return item[key]
                    })
                })
                this.echart.series[1].data = arr.map(item => {
                    return [
                        moment(item.TDATE + '').format('M月D日'),
                        item.PTD_SEND_TGT
                    ]
                })
            }
            else if(type === 'table'){
                this.table.tableData = []
                this.table1.tableData = []
                let keys = ['TDATE', 'PTD_SEND_TGT', 'PTD_SEND_AMT', 'PTD_SEND_RATE', 'YOY_SEND_RATE']
                let arr = _.cloneDeep(source)
                arr.sort((a, b) => a.TDATE - b.TDATE)
                let dayNum = arr.length
                let that = this
                let setData = function(tableName, data) {
                    that[tableName].tableData = data.map(item => {
                        return keys.map(key => {
                            if(key === 'TDATE') return moment(item[key] + '').format('M月D日')
                            if(['PTD_SEND_AMT', 'PTD_SEND_RATE', 'YOY_SEND_RATE'].includes(key) && moment(item.TDATE + '').format('x') > moment().format('x')) return null
                            return item[key]
                        })
                    })
                }
                let emptyData = ['/', '/', '/', '/', '/']
                if(dayNum <= 15) {
                    setData('table', arr)
                    for(let i = 0; i < 15 - dayNum; i++){
                        this.table.tableData.push(emptyData)
                    }
                    for(let j = 0; j < 15; j++){
                        this.table1.tableData.push(emptyData)
                    }
                }
                else if(dayNum === 16) {
                    setData('table', arr)
                    for(let i = 0; i < 16 - dayNum; i++){
                        this.table.tableData.push(emptyData)
                    }
                    for(let i = 0; i < 16; i++){
                        this.table1.tableData.push(emptyData)
                    }
                }
                else if(dayNum > 16 && dayNum <= 30) {
                    setData('table', arr.slice(0, 15))
                    setData('table1', arr.slice(15))
                    for(let i = 0; i < 30 - dayNum; i++){
                        this.table1.tableData.push(emptyData)
                    }
                }
                else if( dayNum > 30 && dayNum <= 32) {
                    setData('table', arr.slice(0, 16))
                    setData('table1', arr.slice(16))
                    for(let i = 0; i < 32 - dayNum; i++){
                        this.table1.tableData.push(emptyData)
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.ChannelOverview{
    height: 100%;
    .panelBox{
        height: 120px;
        display: flex;
        .active{
            background: rgba(0, 0, 0, 0.03);
        }
        .circlePanel{
            height: 100%;
            width: calc(25% - 30px + 120px);
            display: flex;
            .circle{
                width: 120px;
                height: 100%;
            }

            /deep/ .row {
                .column {
                    text-align: left;
                }
                .value {
                    text-align: end;
                    // flex: 65;
                    padding-right: 50px;
                }
            }

            /deep/ .row_1{
                margin-top: 8px;
            }
            /deep/ .row_2{
                margin-top: 6px;
            }
            /deep/ .subTitle{
                font-size: 24px;
            }
            /deep/ .row_3{
                margin-top: 12px;
            }
            /deep/ .row_3, /deep/ .row_4{
                .column:nth-child(2){
                    margin-right: 0px;
                }
            }
        }
        .normalPanel{
            height: 100%;
            width: calc(25% - 30px);
            padding-left: 10px;

            /deep/ .row {
                .column {
                    text-align: left;
                }
                .value {
                    text-align: end;
                    // flex: 65;
                    padding-right: 50px;
                }
            }


            /deep/ .row_1{
                margin-top: 8px;
            }
            /deep/ .row_2{
                margin-top: 6px;
                font-size: 20px;
            }
            /deep/ .row_3{
                margin-top: 12px;
            }





        }
    }
    .Circle{

    }
    /deep/ .Table{
        .row{
            height: 20px;
            line-height: 20px;
        }
    }
}
</style>