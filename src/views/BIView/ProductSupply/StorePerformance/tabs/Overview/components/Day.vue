<template>
    <div class="Day">
        <div class="echartBox">
            <div class="title">{{curPanel === 1 ? '支付趋势' : curPanel === 2 ? '发货趋势' : '付返前发货趋势'}}</div>
            <v-chart ref="echart1" class="echart" style="height: calc(100% - 21px)" :options="echart1" autoresize></v-chart>
        </div>
        <Table v-bind="table" class="mb10"/>
        <Table v-bind="table1"/>
    </div>
</template>

<script>
import Table from '../../../components/Table'
import base from '../../../utils/base.js'
import moment from "moment";
export default {
    name: "Day",
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
                select += JSON.stringify(this.selects[this.currentTab][key]) + '-'
            }
            return this.dateV3.day2 + '-' + select
        }
    },
    data() {
        let that = this
        return {
            table: {
                index: '1A',
                labels: ['日期','支付目标','支付业绩','日完成率','日同比'],
                datas: []
            },
            table1: {
                index: '1A',
                labels: ['日期','支付目标','支付业绩','日完成率','日同比'],
                datas: []
            },
            echart1: null,
            trendData: [],
        }
    },
    methods: {
        async getTrend() {
            let query = {
                MDATE: this.dateV3?.day2,
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
            let res = await this.$fetchSql('shop_perf', 'shop_perf_day', query)
            res.data.sort((a, b) => a.TDATE_DAY - b.TDATE_DAY)
            this.trendData = res.data.concat()
            this.handleData('trend1', res.data)
            this.handleData('table1', res.data)
        },
        handleData(type, source) {
            if(type === 'trend1') {
                let arr = source.concat()
                //清空
                this.echart1.xAxis[0].data = []
                this.echart1.series[0].data = []
                this.echart1.series[1].data = []
                if(!arr.length) return
                this.echart1.xAxis[0].data = Object.freeze(Array.from(new Set(arr.map(_ => _.TDATE_DAY))))
                let keys = [
                    // 支付
                    ['TDATE_DAY', 'PTD_PAY_AMT', 'PTD_PAY_TGT', 'MDATE'],
                    // 发货
                    ['TDATE_DAY', 'PTD_DLVR_AMT', 'PTD_DLVR_TGT', 'MDATE'],
                    // 付返前
                    ['TDATE_DAY', 'PTD_BEF_DLVR_AMT', 'PTD_DLVR_TGT', 'MDATE'],
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
                console.log(this.echart1.series)
            }
            else if(type === 'table1') {
                let arr = source.concat()
                let labels = [
                    ['日期', '支付目标', '支付业绩', '日完成率', '日同比'],
                    ['日期', '发货目标', '发货业绩', '日完成率', '日同比'],
                    ['日期', '付返前发货目标', '付返前发货业绩', '日完成率', '日同比']
                ]
                this.table.labels = labels[this.curPanel - 1]
                this.table1.labels = labels[this.curPanel - 1]
                this.table.datas = []
                this.table1.datas = []
                if(!arr.length) return
                let keys = [
                    ['TDATE_DAY', 'PTD_PAY_TGT', 'PTD_PAY_AMT', 'PTD_PAY_RATE', 'AGO_PAY_RATE'],
                    ['TDATE_DAY', 'PTD_DLVR_TGT', 'PTD_DLVR_AMT', 'PTD_DLVR_RATE', 'AGO_DLVR_RATE'],
                    ['TDATE_DAY', 'PTD_DLVR_TGT', 'PTD_BEF_DLVR_AMT', 'PTD_BEF_DLVR_RATE', 'AGO_BEF_DLVR_RATE'],
                ]
                let daysOnMonth = moment(this.dateV3.day2).daysInMonth()
                let colNumber = 0
                if(daysOnMonth >= 30) colNumber = 16
                else colNumber = 15
                console.log(colNumber, this.dateV3.day2)
                this.table.datas = arr.slice(0, colNumber).map(item => {
                    return keys[this.curPanel - 1].map((key, index) => {
                        if(index === 2 || index === 3 || index === 4) {
                            let date = this.dateV3.day2 + item[keys[this.curPanel - 1][0]]
                            if(moment(date).format('x') <= moment(new Date()).format('x')) return item[key]
                            else return '--'
                        }
                        return item[key]
                    })
                })
                console.log(this.table.datas, arr.slice(0, colNumber))
                if(arr.length <= colNumber) {
                    for(let i = 0; i < colNumber - arr.length; i++) {
                        this.table.datas.push(this.table.labels.map(_ => '/'))
                    }
                    for(let i = 0; i < colNumber; i++) {
                        this.table1.datas.push(this.table1.labels.map(_ => '/'))
                    }
                }else {
                    this.table1.datas = arr.slice(colNumber).map(item => {
                        return keys[this.curPanel - 1].map((key, index) => {
                            if(index === 2 || index === 3 || index === 4) {
                                let date = this.dateV3.day2 + item[keys[this.curPanel - 1][0]]
                                if(moment(date).format('x') <= moment(new Date()).format('x')) return item[key]
                                else return '--'
                            }
                            return item[key]
                        })
                    })
                    for(let i = 0; i < 2 * colNumber - arr.length; i++) {
                        this.table1.datas.push(this.table1.labels.map(_ => '/'))
                    }
                }
            }
        },
        changeEcharts() {
            this.echart1.tooltip.formatter = (params) => {
                let labels = [
                    ['支付业绩', '支付目标'],
                    ['发货业绩', '发货目标'],
                    ['付返前业绩', '付返前目标'],
                ]
                let str = `统计年月：${moment(params[0].data[3] + '').format('YYYY-MM-') + params[0].data[0]}<br/>`
                str += `${labels[this.curPanel - 1][0]}：${this.handleNum('tenThousand', params[0].data[1])}<br/>`
                str += `${labels[this.curPanel - 1][1]}：${this.handleNum('tenThousand', params[0].data[2])}`
                return str
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.Day{
    .echartBox{
        height: calc(100% - 210px);
        .title{
            //margin-bottom: 10px;
        }
        .echart{
            //height: calc(100% - 31px);
            overflow: visible;
        }
    }

}
</style>