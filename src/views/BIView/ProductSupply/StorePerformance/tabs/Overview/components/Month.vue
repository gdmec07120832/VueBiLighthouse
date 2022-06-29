<template>
    <div class="Month">
        <div class="echartBox" :style="[{height: tableHeight ? `calc(100% - ${tableHeight})` : '0'}]">
            <div class="title">支付趋势</div>
            <v-chart ref="echart1" class="echart" style="height: calc(100% - 31px);overflow: visible" :options="echart1" autoresize></v-chart>
        </div>
        <Table ref="table" class="table" style="height: 150px" v-bind="table"/>
    </div>
</template>

<script>
import Table from '../../../components/Table'
import base from '../../../utils/base'
import moment from "moment";
export default {
    name: "Month",
    mixins: [ base ],
    props: {
        dateV3: {
            type: Object,
            default() {return {}}
        },
        currentTab: {
            type: String,
            default: '',
        },
        selects: {
            type: Object,
            default() {return {}}
        },
        curPanel: {
            type: Number,
            default: 1,
        },
        allCondition: {
            type: String,
            default: '',
        },
    },
    components: {
        Table,
    },
    watch: {
        dateAndSelects: {
            handler(val) {
                this.getTrend()
            }
        },
        curPanel: {
            handler() {
                // 改变echart细节
                this.handleData('trend1', this.trendData)
                this.handleData('table1', this.trendData)
            }
        }
    },
    computed: {
        dateAndSelects() {
            let select = ''
            for(let key in this.selects[this.currentTab]) {
                select += this.selects[this.currentTab][key].toString() + '-'
            }
            return this.dateV3.day2 + '-' + select
        }
    },
    created() {
        this.echart1 = this.createEcharts()
        this.echart1.series[0].data = []
        this.echart1.series[1].data = []
        this.changeEcharts()
        this.getTrend()
    },
    beforeDestroy() {
        this.echart1 ? this.echart1 = null : null
    },
    mounted() {
        console.log(this.tableHeight, this?.$refs?.table.$el)
        this.tableHeight = this?.$refs?.table?.$el.offsetHeight * 1 + 'px'
    },
    data() {
        return {
            echart1: null,
            table: {
                labels: ['日期','支付目标','支付业绩','日完成率','日同比'],
                datas: [],
                index: '1B',
            },
            tableHeight: null,
            trendData: [],
        }
    },
    methods: {
        async getTrend() {
            let query = {
                START_TIME: this.dateV3.month2 + '01',
                END_TIME: this.dateV3.month2 + '12',
                CHNL_NAME: this.currentTab
            }
            for(let key in this.selects[this.currentTab]) {
                if(key !== 'obj') {
                    let select = this.selects[this.currentTab][key]
                    if(Object.prototype.toString.call(select) === '[object Array]' && select.length) {
                        query[key] = select.toString()
                    }else if(Object.prototype.toString.call(select) === '[object String]' && select) {
                        query[key] = select.toString()
                    }
                }
            }
            let res = await this.$fetchSql('shop_perf', 'shop_perf_month', query)
            res.data.sort((a, b) => moment(a.MONTH_DATE).format('x') - moment(b.MONTH_DATE).format('x'))
            this.trendData = res.data.concat()
            this.handleData('trend1', res.data)
            this.handleData('table1', res.data)
        },
        handleData(type, source) {
            if(type === 'trend1') {
                let arr = source.filter(_ => _.MONTH_DATE !== '合计')
                //清空
                this.echart1.xAxis[0].data = []
                this.echart1.series[0].data = []
                this.echart1.series[1].data = []
                if(!arr.length) return
                this.echart1.xAxis[0].data = Object.freeze(Array.from(new Set(arr.map(_ => _.MONTH_DATE))))
                let keys = [
                    // 支付
                    ['MONTH_DATE', 'PTD_PAY_AMT', 'PTD_PAY_TGT'],
                    // 发货
                    ['MONTH_DATE', 'PTD_DLVR_AMT', 'PTD_DLVR_TGT'],
                    // 付返前
                    ['MONTH_DATE', 'PTD_BEF_DLVR_AMT', 'PTD_DLVR_TGT'],
                ]
                this.echart1.series[0].data = arr.map(item => {
                    return keys[this.curPanel - 1].map(key => {
                        return item[key]
                    })
                })
                this.echart1.series[1].data = arr.map(item => {
                    return [
                        item[keys[this.curPanel - 1][0]],
                        item[keys[this.curPanel - 1][2]],
                    ]
                })
                console.log(this.echart1.series, this.echart1.xAxis[0])
            }
            else if(type === 'table1') {
                let arr = source.concat()
                let labels = [
                    ['日期', '支付目标', '支付业绩', '日完成率', '日同比'],
                    ['日期', '发货目标', '发货业绩', '日完成率', '日同比'],
                    ['日期', '付返前发货目标', '付返前发货业绩', '日完成率', '日同比']
                ]
                this.table.labels = labels[this.curPanel - 1]
                this.table.datas = []
                if(!arr.length) return
                let keys = [
                    ['MONTH_DATE', 'PTD_PAY_TGT', 'PTD_PAY_AMT', 'PTD_PAY_RATE', 'AGO_PAY_RATE'],
                    ['MONTH_DATE', 'PTD_DLVR_TGT', 'PTD_DLVR_AMT', 'PTD_DLVR_RATE', 'AGO_DLVR_RATE'],
                    ['MONTH_DATE', 'PTD_DLVR_TGT', 'PTD_BEF_DLVR_AMT', 'PTD_BEF_DLVR_RATE', 'AGO_BEF_DLVR_RATE'],
                ]
                this.table.datas = arr.map(item => {
                    return keys[this.curPanel - 1].map(key => {
                        return item[key]
                    })
                })
            }
        },
        changeEcharts() {
            this.echart1.tooltip.formatter = (params) => {
                let labels = [
                    ['支付业绩', '支付目标'],
                    ['发货业绩', '发货目标'],
                    ['付返前业绩', '付返前目标'],
                ]
                let str = `统计年月：${params[0].data[0]}<br/>`
                str += `${labels[this.curPanel - 1][0]}：${this.handleNum('tenThousand', params[0].data[1])}<br/>`
                str += `${labels[this.curPanel - 1][1]}：${this.handleNum('tenThousand', params[0].data[2])}`
                return str
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.Month{
    .echartBox{
        //height: calc(100% - 111px);
        .title{
            margin-bottom: 10px;
        }
        .echart{
            //height: calc(100% - 31px);
            overflow: visible;
        }
    }
    //.table{
    //    /deep/ .row{
    //        //height: 30px;
    //    }
    //    /deep/ .row::before{
    //        display: inline-block;
    //        content: '';
    //        height: 100%;
    //        vertical-align: middle;
    //    }
    //}
}
</style>