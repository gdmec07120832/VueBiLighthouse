<template>
    <div class="main">
        <div class="channel">
            <div class="title">渠道视角</div>
            <div class="panels">
                <div class="item" v-for="(item) in panels" :key="item.label">
                    <div>{{ item.label }}</div>
                    <div>{{ handleNum('percent', item.datas[0]) }}</div>
                    <div>
                        <span>达成</span>
                        <span :class="[computeColor('reach', item.datas[1])]">{{ handleNum('percent', item.datas[1]) }}</span>
                    </div>
                    <div>
                        <span>同比</span>
                        <span :class="[computeColor('YearOnYear', item.datas[2])]">{{ handleNum('percent', item.datas[2]) }}</span>
                    </div>
                    <div>
                        <span>环比</span>
                        <span :class="[computeColor('MonthOnMonth', item.datas[3])]">{{ handleNum('percent', item.datas[3]) }}</span>
                    </div>
                </div>
            </div>
            <div class="channelTrend">
                <div class="line1">{{ this.type === '支付口径' ? '线下成交毛利趋势' : '线下采购毛利趋势' }}</div>
                <v-chart ref="line1" class="line" :options="channelTrend" autoresize></v-chart>
            </div>
        </div>
        <div class="goods">
            <div class="title">货品视角</div>
            <Table v-bind="table" class="table"/>
            <div class="goodsTrend">
                <div class="line1">{{ this.type === '支付口径' ? '货品成交毛利趋势' : '货品采购毛利趋势' }}</div>
                <v-chart ref="line2" class="line" :options="goodsTrend" autoresize></v-chart>
            </div>
        </div>
    </div>
</template>

<script>
import base from '../../../utils/base'
import Table from '../components/Table'
import moment from 'moment'
export default {
    name: 'CurrentMonth',
    mixins: [ base ],
    components: {
        Table
    },
    props: {
        month: {
            type: String
        },
        type: {
            type:String
        },

    },
    created() {
        let that = this
        this.channelTrend = this.createLine()
        this.channelTrend.grid.top = 40
        this.channelTrend.legend.data = ['线下', '目标']
        this.channelTrend.series[0].name = '线下'
        this.channelTrend.series[1].name = '目标'
        this.goodsTrend = this.createLine()
        this.goodsTrend.grid.top = 40
        this.goodsTrend.legend.data = ['A货', 'B货', 'C货', 'D货']
        this.goodsTrend.color = ['#5B8FF9', '#F6BD16', '#2EBFBE', '#DFDFDF']
        delete this.goodsTrend.series[0].areaStyle
        delete this.goodsTrend.series[1].areaStyle
        this.goodsTrend.series.push(JSON.parse(JSON.stringify(this.goodsTrend.series[1])))
        this.goodsTrend.series.push(JSON.parse(JSON.stringify(this.goodsTrend.series[1])))
        this.goodsTrend.series[0].name = 'A货'
        this.goodsTrend.series[1].name = 'B货'
        this.goodsTrend.series[2].name = 'C货'
        this.goodsTrend.series[3].name = 'D货'
        this.getOverView()
        this.getTrend()
    },
    beforeDestroy() {
        this.channelTrend === null ? this.channelTrend = null : null
    },
    watch: {
        month: {
            handler() {
                this.getOverView()
                this.getTrend()
            }
        },
        type: {
            handler() {
                this.handleData('channelPanel', this.channelPanel)
                this.handleData('goodsPanel', this.goodsPanel)
                this.handleData('channelTrend', this.channelTrendData)
                this.handleData('goodsTrend', this.goodsTrendData)
            }
        }
    },
    data() {
        return {
            panels: [
                {label: '线下', datas: [null, null, null, null]},
                {label: '直营', datas: [null, null, null, null]},
                {label: '经销', datas: [null, null, null, null]},
            ],
            channelPanel: null,
            channelTrend: null,
            channelTrendData: [],
            goodsPanel: null,
            table: {
                labelData: ['货品', 'A货', 'B货', 'C货', 'D货'],
                tableData: []
            },
            goodsTrend: null,
            goodsTrendData: [],
        }
    },
    methods: {
        computeColor(type, value) {
            if(value === null || value === undefined || value === '--') return
            if(type === 'reach') {
                if(value >= 1) return 'red'
                else if(value < 1) return 'green'
            }else if(type === 'YearOnYear' || type === 'MonthOnMonth') {
                if(value > 0) return 'red'
                else if(value < 0) return 'green'
            }
        },
        computeNum(col, row, value) {
            if(this.channelPanel === null) return
            let source = this.channelPanel.filter(_ => _.CALIBER === this.type && _.CLASS_DETAIL === this.panels[col].label)
            if(!source.length) return
            return value
            // return value
            // console.log(source);
            // if(col === 0) {
                // if()
            // }
        },
        async getOverView() {
            let query = {
                MDATE: this.month
            }
            let res = await this.$fetchSql('new_retail', 'new_retail_grs_fl', query)
            this.channelPanel = res.data.filter(_ => _.CLASS === '渠道')
            this.goodsPanel = res.data.filter(_ => _.CLASS === '货品')
            this.handleData('channelPanel', this.channelPanel)
            this.handleData('goodsPanel', this.goodsPanel)
        },
        async getTrend(){
            let query = {
                MDATE: this.month
            }
            let res = await this.$fetchSql('new_retail', 'new_retail_grs_rt', query)
            this.channelTrendData = res.data.filter(_ => _.CLASS.indexOf('线下') > -1)
            this.goodsTrendData = res.data.filter(_ => _.CLASS.indexOf('货') > -1)
            this.handleData('channelTrend', this.channelTrendData)
            this.handleData('goodsTrend', this.goodsTrendData)
        },
        handleData(type, source) {
            if(type === 'channelPanel') {
                this.panels.forEach(item => {
                    item.datas = [null, null, null, null]
                })
                let arr = source.filter(_ => _.CALIBER === this.type)
                if(!arr.length) return
                this.panels.forEach(item => {
                    // PROFIT_REACH_RATE PROFIT_RATE_GOAL
                    let keys = ['PROFIT_RATE', 'reach', 'PROFIT_RATE_YOY', 'PROFIT_RATE_MOM']
                    let obj = arr.filter(_ => _.CLASS_DETAIL === item.label)
                    if(obj.length) {
                        obj = obj[0]
                        item.datas = keys.map(key => {
                            if(key === 'reach') {
                                if((obj.PROFIT_RATE === null || obj.PROFIT_RATE_GOAL === null) || obj.PROFIT_RATE_GOAL === 0) return null
                                else return obj.PROFIT_RATE / obj.PROFIT_RATE_GOAL
                            }
                            return obj[key]
                        })
                    }
                    else {
                        item.datas = keys.map(key => null)
                    }
                  
                })
            }
            else if(type === 'goodsPanel') {
                let arr = source.filter(_ => _.CALIBER === this.type)
                this.table.tableData = []
                if(!arr.length) return
                arr.sort((a, b) => a.CLASS_DETAIL.split('货')[0] - b.CLASS_DETAIL.split('货')[0])
                let obj = [
                    {label: '业绩占比', key: 'AMT_RATE'},
                    {label: '成交毛利率', key: 'PROFIT_RATE'},
                    {label: '同期', key: 'AGO_PROFIT_RATE'},
                    {label: '同比', key: 'PROFIT_RATE_YOY'},
                    {label: '上期', key: 'LAST_PROFIT_RATE'},
                    {label: '环比', key: 'PROFIT_RATE_MOM'},
                ]
                this.table.tableData = obj.map(item => {
                    return [
                        item.label,
                        ...arr.map(_ => _[item.key])
                    ]
                })
            }
            else if(type === 'channelTrend') {
                let arr = source.filter(_ => _.CALIBER === this.type)
                this.channelTrend.series[0].data = []
                this.channelTrend.series[1].data = []
                this.channelTrend.xAxis.data = []
                this.$refs?.line1?.$refs?.echarts?.clear()
                if(!arr.length) return
                arr.sort((a, b) => moment(a.TDATE).format('x') - moment(b.TDATE).format('x'))
                this.channelTrend.xAxis.data = arr.map(_ => moment(_.TDATE).format('DD'))
                let keys = ['TDATE', 'PROFIT_RATE', 'PROFIT_RATE_GOAL']
                this.channelTrend.series[0].data = arr.map(item => {
                    return keys.map((key, index) => {
                        if(index === 0) return moment(item[key]).format('DD')
                        return item[key]
                    })
                })
                this.channelTrend.series[1].data = arr.map(item => {
                    return [
                        moment(item[keys[0]]).format('DD'),
                        item[keys[2]]
                    ]
                })
            }
            else if(type === 'goodsTrend') {
                let arr = source.filter(_ => _.CALIBER === this.type)
                this.goodsTrend.series[0].data = []
                this.goodsTrend.series[1].data = []
                this.goodsTrend.series[2].data = []
                this.goodsTrend.series[3].data = []
                this.goodsTrend.xAxis.data = []
                this.$refs?.line2?.$refs?.echarts?.clear()
                if(!arr.length) return
                arr.sort((a, b) => moment(a.TDATE).format('x') - moment(b.TDATE).format('x'))
                let CLASS = Array.from(new Set(arr.map(_ => _.CLASS)))
                CLASS.sort((a, b) => a - b)
                this.goodsTrend.xAxis.data = Object.freeze(Array.from(new Set(arr.map(_ => moment(_.TDATE).format('DD')))))
                let keys = ['TDATE', 'PROFIT_RATE', 'PROFIT_RATE_GOAL']
                // this.goodsTrend.series[0].data = arr.filter(_ => _.CLASS === CLASS[0]).map(item => {
                //     return keys.map((key, index) => {
                //         if(index === 0) return moment(item[key]).format('DD')
                //         return item[key]
                //     })
                // })
                for(let i = 0; i < 4; i++){
                    this.goodsTrend.series[i].data = arr.filter(_ => _.CLASS === CLASS[i]).map(item => {
                        return [
                            moment(item[keys[0]]).format('DD'),
                            item[keys[1]]
                        ]
                    })
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.red {
    color: #ff5953!important;
}
.green{
    color: #00a854!important;
}
.main {
    height: calc(100% - 38px - 31px);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(1, 100%);
    gap: 88px;
    .channel {
        .title {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #000000;
            line-height: 20px;
            margin-top: 43px;
            margin-bottom: 13px;
        }
        .panels {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 88px;
            .item {
                div:nth-child(1) {
                    font-size: 13px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: rgba(0, 0, 0, 0.64);
                    line-height: 22px;
                    margin-bottom: 6px;
                }

                div:nth-child(2) {
                    font-size: 18px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: rgba(0, 0, 0, 0.64);
                    line-height: 24px;
                    margin-bottom: 12px;
                }

                div:nth-child(3), div:nth-child(4), div:nth-child(5) {
                    display: grid;
                    justify-content: space-between;
                    grid-template-columns: repeat(2, 1fr);

                    span:nth-child(1) {
                        text-align: left;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #999999;
                        line-height: 18px;
                    }

                    span:nth-child(2) {
                        text-align: right;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #999999;
                        line-height: 18px;
                    }
                }
            }
        }
        .channelTrend{
            margin-top: 47px;
            height: calc(100% - 194px - 47px);
            position: relative;
            .line1{
                position: absolute;
                left: 0;
                top: 0;
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.64);
                line-height: 22px;
            }
            .line{
            }
        }
    }

    .goods {
        .title{
            margin-top: 43px;
            margin-bottom: 13px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #000000;
            line-height: 20px;
        }
        .table{
        }
        .goodsTrend{
            margin-top: 39px;
            height: calc(100% - 240px);
            position: relative;
            .line1{
                position: absolute;
                top: 0;
                left: 0;
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.64);
                line-height: 22px;
            }
        }
    }
}
</style>