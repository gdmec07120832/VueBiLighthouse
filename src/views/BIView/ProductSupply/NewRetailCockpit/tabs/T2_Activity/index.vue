<template>
    <div class="Activity">
        <div class="header">
            <Title class="title" :label="'活动蓄水'"/>
            <Select class="select" v-bind="select" :value.sync="select.value"></Select>
        </div>
        <div class="main">
            <div class="panel">
                <Panel v-for="(item, index) in panels" :key="index" v-bind="item"/>
                <TimeLine class="timeLine" :datas="timeLineDatas"/>
            </div>
            <v-chart ref="barAndLine" class="echarts" style="overflow: visible;" :options="echart" autoresize></v-chart>
            <div class="box">
                <div class="innerBox">
                    <!-- <Table v-if="table1.tableData.length <= 15" class="table" v-bind="table1"/> -->
                    <!-- <Table v-else class="table1" v-bind="table1"/> -->
                    <Table class="table" v-bind="table1"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Title from '../../components/Title'
import Select from '../../components/Select'
import Panel from '../../components/Panel'
import Table from '../../components/Table'
import base from '../../utils/base'
import moment from 'moment'
import TimeLine from './components/TimeLine'
export default {
    name: 'Activity',
    mixins: [ base ],
    components: {
        Title,
        Select,
        Panel,
        Table,
        TimeLine,
    },
    async created() {
        this.echart = await this.createBarAndLineEchart()
        this.echart.yAxis[0].show = false
        let that = this
        this.echart.tooltip.formatter = function (params) {
            return  `统计日期：${params[0].data[0]}<br/>蓄水目标：${that.handleNum('round', params[0].data[2])}<br/>蓄水金额：${that.handleNum('round', params[0].data[1])}`
        }
        this.echart.yAxis[0].axisLabel.formatter = function(val) {
            return that.handleNum('round', val)
        }
        await this.getOptions()
        this.getOverView()
        this.getLine()
        this.timer = setInterval(() => {
            that.getOverView()
            that.getLine()
        }, 30000)
    },
    beforeDestroy() {
        this.echart === null ? this.echart = null : null
        clearInterval(this.timer)
    },
    watch: {
        'select.value': {
            handler() {
                this.getOverView()
                this.getLine()
                this.handleData('timeLine', this.options)
            }
        }
    },
    data() {
        return {
            timer: null,
            options: [],
            select: {
                label: '活动选择',
                value: '',
                options: [],
            },
            panels: [
                {
                    comp: 'Activity',
                    type: 'type3',
                    echart: {
                        label: '完成',
                        value: '--',
                        id: 1,
                    },
                    datas: {
                        label1: '蓄水金额达成',
                        value1: null,
                        label2: '目标',
                        value2: null,
                        label3: '差值',
                        value3: null,
                        // label4: '完成率',
                        // value4: null,
                    }
                },
                {
                    comp: 'Activity',
                    type: 'type3',
                    echart: {
                        label: '完成',
                        value: '--',
                        id: 2,
                    },
                    datas: {
                        label1: '蓄水支付达成',
                        value1: null,
                        label2: '蓄水未支付金额',
                        value2: null,
                        // label3: '差值',
                        // value3: null,
                        // label4: '完成率',
                        // value4: null,
                    }
                },
            ],
            echart: null,
            timeLineDatas: [
                {
                    label: '活动蓄水开始',
                    date: null,
                    date1: null,
                },
                {
                    label: '活动蓄水结束',
                    date: null,
                    date1: null,
                },
                {
                    label: '活动付款开始',
                    date: null,
                    date1: null,
                },
                {
                    label: '活动付款结束',
                    date: null,
                    date1: null,
                },
            ],
            table1: {
                index: 'Activity',
                labelData: ['日期', '蓄水目标', '蓄水金额', '蓄水达成', '日销', '日销+蓄水达成'],
                tableData: [],
            },
        }
    },
    methods: {
        async getOptions() {
            let res =  await this.$fetchSql('new_retail', 'new_retail_act_scr')
            this.options = res.data.concat()
            this.options.sort((a, b) => moment(b.SP_ENDDING_DATE).format('x') - moment(a.SP_ENDDING_DATE).format('x'))
            this.select.options = Array.from(new Set(this.options.map(_ => _.ACTIVITY_NAME).filter(_ => _ !== null)))
            this.select.value = this.select.options[0]
            this.handleData('timeLine', this.options)
        },
        async getOverView() {
            let query = {
                ACTIVITY_NAME: this.select.value
            }
            let res = await this.$fetchSql('new_retail', 'new_retail_act_sum', query)
            this.handleData('overView', res.data)
        },
        async getLine() {
            let select = this.options.filter(_ => _.ACTIVITY_NAME === this.select.value)
            if(!select.length) return
            let query = {
                START_TIME: moment(select[0].SP_STARTING_DATE).format('YYYYMMDD'),
                END_TIME: moment(select[0].SP_ENDDING_DATE).format('YYYYMMDD')
            }
            let res = await this.$fetchSql('new_retail', 'new_retail_act_trend', query)
            this.handleData('line', res.data)
            this.handleData('table', res.data)
        },
        handleData(type, source) {
            if (type === 'overView') {
                let arr = source.concat()
                this.panels.forEach(item => {
                    if (item.echart) item.echart.value = 0
                    item.datas.value1 = '--'
                    item.datas.value2 = '--'
                    item.datas.value3 = '--'
                })
                if (!arr.length) return
                let item0 = this.panels[0]
                item0.echart.value = arr[0].PTD_ORDER_RATE
                item0.datas.value1 = arr[0].PTD_ORDER_AMT
                item0.datas.value2 = arr[0].PTD_ORDER_TGT
                item0.datas.value3 = arr[0].PTD_ORDER_DIFF
                let item1 = this.panels[1]
                item1.echart.value = arr[0].PTD_ORDER_PAY_RATE
                item1.datas.value1 = arr[0].PTD_PAY_AMT
                item1.datas.value2 = arr[0].PTD_NOT_PAY_AMT
            }
            else if(type === 'line') {
                let arr = source.filter(_ => _.TDATE_DAY !== '总计')
                this.echart.xAxis[0].data = []
                this.echart.series[0].data = []
                this.echart.series[1].data = []
                this.$refs?.barAndLine?.$refs?.echarts?.clear()
                if(!arr.length) return
                let keys = ['TDATE_DAY', 'PTD_ORDER_AMT', 'PTD_ORDER_TGT']
                arr.sort((a, b) => moment(a[keys[0]]).format('x') - moment(b[keys[0]]).format('x'))
                this.echart.xAxis[0].data = Object.freeze(Array.from(new Set(arr.map(_ => _[keys[0]]))))
                this.echart.series[0].data = arr.map(item => {
                    return keys.map(key => {
                        return item[key]
                    })
                })
                this.echart.series[1].data = arr.map(item => {
                    return [
                        item[keys[0]],
                        item[keys[2]]
                    ]
                })
            }
            else if(type === 'table') {
                let arr = source.filter(_ => _.TDATE_DAY !== '总计')
                arr.sort((a, b) => moment(a.TDATE_DAY).format('x') - moment(b.TDATE_DAY).format('x'))
                this.table1.tableData = []
                if(!arr.length) return
                let sum = source.filter(_ => _.TDATE_DAY === '总计')[0]
                arr.unshift(sum)
                let keys = ['TDATE_DAY', 'PTD_ORDER_TGT', 'PTD_ORDER_AMT', 'PTD_ORDER_RATE', 'PTD_PAY_AMT', 'PTD_TOT_RATE']
                this.table1.tableData = arr.map(item => {
                    return keys.map(key => {
                        return item[key]
                    })
                })
            }
            else if(type === 'timeLine') {
                this.timeLineDatas.forEach(item => {
                    item.data = null
                    item.data1 = null
                })
                if(!source.length) return
                let keys = ['SP_STARTING_DATE', 'SP_ENDDING_DATE', 'ACTIVITY_STARTING_DATE', 'ACTIVITY_ENDDING_DATE']
                let obj = source.filter(_ => _.ACTIVITY_NAME === this.select.value)[0]
                this.timeLineDatas.forEach((item, index) => {
                    item.date = obj[keys[index]].split(' ')[0]
                    item.date1 = obj[keys[index]].split(' ')[1]
                })
                this.timeLineDatas.forEach((item, index) => {
                    if(index === this.timeLineDatas.length - 1) return
                    let val = moment(this.timeLineDatas[index].date).format('x')
                    let val1 = moment(this.timeLineDatas[index + 1].date).format('x')
                    item.num = ((val1 - val) / (3600 * 24 * 1000)).toFixed(0) * 1
                })


            }
        }
    }
}
</script>

<style lang="scss" scoped>
.Activity{
    .header{
        height: 38px;
        padding-bottom: 10px;
        border-bottom: 1px solid #F0F0F0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }
    .main{
        height: calc(100% - 38px);
        .panel{
            margin-top: 10px;
            height: 136px;
            display: grid;
            grid-template-columns: 366px 366px 1fr;
            .timeLine{
                padding: 30px 20px 0 26px;
            }
        }
        .echarts{
            height: calc(100% - 348px)!important;
        }
        .box{
            height: 202px;
            .innerBox{
                overflow-x: scroll;
                .table{
                    /deep/ .row {
                        height: 32px;
                        line-height: 32px;
                        text-overflow: inherit;
                        white-space: inherit;
                        padding: 0 2px;
                    }
                    /deep/ .row:nth-child(3) {
                        background: #f5f7ff;
                    }
                }
                .table1{
                    white-space: nowrap;
                    display: block;
                    /deep/ .col1 {
                        display: inline-block;
                    }
                    /deep/ .col{
                        display: inline-block;
                    }
                    /deep/ .row {
                        height: 32px;
                        line-height: 32px;
                    }
                    /deep/ .row:nth-child(3) {
                        background: #f5f7ff;
                    }
                }
            }
        }
   
    }
}
</style>