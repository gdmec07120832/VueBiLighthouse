<template>
    <div class="Racquet">
        <div class="header">
            <Title class="title" :label="'网拍业绩'"/>
            <span style="font-size: 12px">
                统计月份
                <a-month-picker v-model="month" :allowClear="false" class="ml10" :disabledDate="disabledDate" valueFormat="YYYYMM"/>
            </span>
        </div>
        <div class="main">
            <a-radio-group class="radio" v-model="type">
                <a-radio value="支付口径">
                    支付口径
                </a-radio>
                <a-radio value="发货口径">
                    发货口径
                </a-radio>
            </a-radio-group>
            <div class="panels">
                <div class="item" v-for="(item, index) in panels" :key="index">
                    <div>{{item.label}}</div>
                    <div>{{computeNum(index, item.value)}}</div>
                </div>
            </div>
            <div class="echarts" ref="echarts">
                <v-chart ref="circle" class="circle" :style="[{height: echartsHeight + 'px',width: echartsHeight + 'px',overflow: 'visible'}]" :options="circle" autoresize></v-chart>
                <div style="width: 10px"></div>
                <div class="right" style="position: relative" :style="[{width: `calc(100% - ${echartsHeight}px)`,overflow: 'visible'}]" >
<!--                    <div class="title">-->
                    <span style="position: absolute">数据趋势<span>点击左图可以切换区域</span></span>
<!--                        <span v-if="type === '支付口径'">-->
<!--                            <span>非网拍支付业绩</span>-->
<!--                            <span>网拍支付业绩</span>-->
<!--                        </span>-->
<!--                        <span v-if="type === '发货口径'">-->
<!--                            <span>网拍发货业绩</span>-->
<!--                        </span>-->
<!--                    </div>-->
                    <v-chart v-if="type === '支付口径'" ref="bar" class="bar" :options="bar" autoresize></v-chart>
                    <v-chart v-if="type === '发货口径'" ref="line" class="line" :options="line" autoresize></v-chart>
                </div>
            </div>
            <Table v-bind="table" class="table"/>
            <Jump style="display: none"/>
        </div>
    </div>
</template>

<script>
import Title from '../../components/Title'
import moment from 'moment'
import base from '../../utils/base'
import Table from '../../components/Table'
import Jump from '../../components/Jump'
export default {
    name: 'Racquet',
    mixins: [ base ],
    components: {
        Title,
        Table,
        Jump,
    },
    async created() {
        let that = this
        this.circle = await this.createCircle()
        this.circle.series[0].label = {
            show: true
        }
        this.circle.series[0].labelLine = {
            show: true,
            length: 10,
            length2: 10,
            lineStyle: {
                color: '#8C8C8C'
            }
        }
        this.circle.itemStyle = {
            color: (params) => {
                let arr = ['#5b8ff9', '#f6bd16', '#5d7092', '#fd84b6']
                return arr[params.dataIndex]
            }
        }
        this.circle.series[0].radius = ['20%', '50%']
        this.circle.series[0].data = [
            {value: 0, name: '东区'},
            {value: 0, name: '南区'},
            {value: 0, name: '西区'},
            {value: 0, name: '北区'}
        ]
        this.circle.series[0].label.formatter = function(params) {
            // return `${params.data.name}\n${(params.data.value * 100).toFixed(0)}%`
            return `${params.data.name}\n${params.percent}%`
        }
        this.circle.series[0].selectedMode = 'single'
        this.bar = await this.createCategoryX()
        this.bar.grid.top = 30
        this.bar.series[0].label.show = false
        this.bar.series[1].label.show = false
        this.bar.xAxis[0].data = []
        this.bar.series[0].data = []
        this.bar.series[0].name = '非网拍支付业绩'
        this.bar.series[1].data = []
        this.bar.series[1].name = '网拍支付业绩'
        this.bar.yAxis.axisLabel.show = false
        this.bar.tooltip.formatter = function (params) {
            let str = `${params[0].axisValue}<br/>`
            params.forEach(item => {
                str += `${item.marker + item.seriesName}：${that.handleNum('round', item.data[1])}<br/>`
            })
            // let fun = (num) => {
            //     let colors = ['#5b8ff9', '#f6bd16']
            //     return `<div style="border-radius: 5px;width: 10px;height: 10px;background: ${colors[num]};display: inline-block;margin: 1px 5px 1px 0"></div>`
            // }
            // let div1 = fun(0), div2 = fun(1)
            // let str
            // str = `统计月份：${params[0].axisValue}<br/>${div1}非网拍支付业绩：${that.handleNum('round', params[0].data[1])}<br/>${div2}网拍支付金额：${that.handleNum('round', params[0].data[2])}`
            return str
        }
        this.line = this.createLine()
        this.line.xAxis.data = []
        this.line.series[0].data = []
        this.line.series.splice(1,1)
        this.line.series[0].name = '网拍发货业绩'
        this.line.grid.top = 30
        this.line.grid.bottom = 20
        // this.line.legend = null
        this.line.tooltip.formatter = null
        this.line.yAxis[0].axisLabel .formatter = function(val) {
            if(val >= 10000) return that.handleNum('tenThousand', val)
            else if(val < 10000) return that.handleNum('round', val)
        }
        this.getOverView()
        this.getArea()
        this.getTrend()
    },
    mounted() {
        let that = this
        // this.$refs?.circle?.$refs?.echarts?.chart._api.dispatchAction({ type: 'select', seriesIndex: 0, dataIndex: 0 })
        this.$refs?.circle?.$refs?.echarts.$on('click', function(params) {
            if(that.S_OR_N === params.data.name) that.S_OR_N = null
            else that.S_OR_N = params.data.name
        })
        this.echartsHeight = this.$refs.echarts.offsetHeight
        window.addEventListener('resize', () => {
            setTimeout(() => {
                that.echartsHeight = that.$refs?.echarts?.offsetHeight
            }, 200)
        })
    },
    beforeDestroy() {
        this.circle !== null ? this.circle = null : null
    },
    watch: {
        month: {
            handler(val, oval) {
                this.getOverView()
                this.getArea()
                if(moment(val).format('YYYY') !== moment(oval).format('YYYY')) {
                    this.getTrend()
                }
            }
        },
        S_OR_N: {
            handler(val) {
                this.getTrend()
            }
        },
        type: {
            handler() {
                this.handleData('area', this.areaData)
            }
        }
    },
    data() {
        return {
            month: moment(new Date()).format('DD') === '01' ? moment(new Date()).subtract(1, 'month').format('YYYYMM') : moment().format('YYYYMM'),
            panels: [
                {label: '网拍支付业绩', value: null},
                {label: '网拍支付占比', value: null},
                {label: '网拍审核结余', value: null},
                {label: '网拍发货业绩', value: null},
            ],
            type: '支付口径',
            circle: null,
            bar: null,
            line: null,
            table: {
                index: 'Racquet',
                labelData: ['月份', '网拍支付业绩', '网拍支付占比', '审核结余', '网拍发货业绩'],
                tableData: [
                    [],
                    [],
                ]
            },
            echartsHeight: 0,
            S_OR_N: null,
            areaData: [],
        }
    },
    methods: {
        computeNum(p, value) {
            if(p === 1) return this.handleNum('percent', value)
            else return this.handleNum('round', value)
        },
        async getOverView() {
            let query = {
                MDATE: this.month
            }
            let res = await this.$fetchSql('new_retail', 'new_retail_wp_sum', query)
            this.handleData('overview', res.data)
        },
        async getArea() {
            let query = {
                MDATE: this.month
            }
            let res = await this.$fetchSql('new_retail', 'new_retail_wp_area', query)
            this.areaData = res.data.concat()
            this.handleData('area', res.data)
        },
        async getTrend() {
            let query = {
                YDATE: moment(this.month).format('YYYY'),
                S_OR_N: this.S_OR_N
            }
            let res = await this.$fetchSql('new_retail', 'new_retail_wp_trend', query)
            this.handleData('trend', res.data)
            this.handleData('table', res.data)
            this.handleData('line', res.data)
        },
        handleData(type, source) {
            if(type === 'overview') {
                this.panels.forEach(item => {
                    item.value = null
                })
                if(!source.length) return
                let keys = ['PTD_WP_PAY_AMT', 'PTD_PAY_RATE', 'PTD_WP_END_AMT', 'PTD_WP_SEND_AMT']
                this.panels.forEach((item, index) => {
                    item.value = source[0][keys[index]]
                })
            }
            else if(type === 'area') {
                if(this.circle === null) return
                this.circle?.series[0]?.data?.forEach(item => {
                    item.value = 0
                })
                if(!source.length) return
                let arr = ['东区', '南区', '西区', '北区'].map(area => {
                    return source.filter(_ => _.S_OR_N === area)[0]
                })
                this.circle.series[0].data.forEach((item, index) => {
                    item.value = arr[index][this.type === '支付口径' ? 'PTD_WP_PAY_AMT' : 'PTD_WP_SEND_AMT']
                })
            }
            else if(type === 'trend') {
                this.$refs?.bar?.$refs?.echarts?.clear()
                if(!source.length) return
                let arr = source.filter(_ => _.MONTH_DATE !== '累计')
                arr.sort((a, b) => a.MONTH_DATE.split('月')[0] - b.MONTH_DATE.split('月')[0])
                // arr.unshift(source.filter(_ => _.MONTH_DATE === '累计')[0])
                let keys = ['MONTH_DATE','PTD_FWP_PAY_AMT', 'PTD_WP_PAY_AMT']
                this.bar.series[0].data = arr.map((item, index) => {
                    let itemDate = moment(this.month).format('YYYY') + item.MONTH_DATE.split('月')[0] + '01'
                    let isAfter = itemDate > moment().format('YYYYMMDD') ? true : false
                    if(isAfter) return 'null' + index
                    return keys.map(key => {
                        if(key === 'MONTH_DATE' && item[key].split('月')[0] < 10) return item[key].split('月')[0].split('0')[1] + '月'
                        else if(key === 'MONTH_DATE' && item[key] >= 10) return item[key]
                        else if(key !== 'MONTH_DATE') {
                            return item[key]
                        }
                    })
                })
                this.bar.series[1].data = arr.map((item, index) => {
                    let itemDate = moment(this.month).format('YYYY') + item.MONTH_DATE.split('月')[0] + '01'
                    let isAfter = itemDate > moment().format('YYYYMMDD') ? true : false
                    if(isAfter) return 'null' + index
                    return [
                        item[keys[0]].split('月')[0] < 10 ? item[keys[0]].split('月')[0].split('0')[1] + '月' : item[keys[0]],
                        item[keys[2]]
                    ]
                })
                this.bar.xAxis[0].data = Object.freeze(Array.from(new Set(arr.map(_ => _.MONTH_DATE))))
                this.bar.xAxis[0].data = this.bar.xAxis[0].data.map(_ => {
                    if(_.split('月')[0] < 10) return _.split('月')[0].split('0')[1] + '月'
                    else return _
                })
            }
            else if(type === 'table') {
                this.table.tableData = []
                if(!source.length) return
                let keys = ['MONTH_DATE', 'PTD_WP_PAY_AMT', 'PTD_PAY_RATE', 'PTD_WP_END_AMT', 'PTD_WP_SEND_AMT']
                let arr = source.filter(_ => _.MONTH_DATE !== '累计')
                arr.sort((a, b) => a.MONTH_DATE.split('月')[0] - b.MONTH_DATE.split('月')[0])
                arr.unshift(source.filter(_ => _.MONTH_DATE === '累计')[0])
                this.table.tableData = arr.map((item, index) => {
                    let itemDate = moment(this.month).format('YYYY') + item.MONTH_DATE.split('月')[0] + '01'
                    let isAfter = itemDate > moment().format('YYYYMMDD') ? true : false
                    if(index !== 0) {
                        return keys.map(key => {
                            if(key === 'MONTH_DATE') return item[key]
                            return !isAfter ? item[key] : null
                        })
                    }else if(index === 0) {
                        return keys.map(key => {
                            return item[key]
                        })
                    }
                })
            }
            else if(type === 'line') {
                this.$refs?.line?.$refs?.echarts?.clear()
                if(!source.length) return
                let arr = source.filter(_ => _.MONTH_DATE !== '累计')
                arr.sort((a, b) => a.MONTH_DATE.split('月')[0] - b.MONTH_DATE.split('月')[0])
                let keys = ['MONTH_DATE', 'PTD_WP_SEND_AMT']
                this.line.series[0].data = arr.map((item, index) => {
                    let itemDate = moment(this.month).format('YYYY') + item.MONTH_DATE.split('月')[0] + '01'
                    let isAfter = itemDate > moment().format('YYYYMMDD') ? true : false
                    if(isAfter) return 'null' + index
                    return keys.map(key => {
                        return item[key]
                    })
                })
                this.line.xAxis.data = arr.map(_ => _.MONTH_DATE)
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.Racquet{
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
        height: calc(100% - 57px);
        position: relative;
        margin-top: 19px;
        .radio{
            position: absolute;
            right: 0;
            top: 0;
        }
        .panels{
            display: flex;
            //margin-top: 19px;
            .item{
                margin-right: 100px;
                div:nth-child(1) {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #666666;
                    line-height: 22px;
                    margin-bottom: 8px;
                }
                div:nth-child(2) {
                    font-size: 20px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #333333;
                    line-height: 24px;
                }
            }
        }
        .echarts{
            display: flex;
            height: calc(100% - 250px)!important;
            margin-top: 26px;
            .right{
                .title{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    >span:nth-child(1) {
                        font-size: 14px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        //font-weight: 600;
                        color: #000000;
                        line-height: 20px;
                    }
                    >span:nth-child(1) >span:nth-child(1) {
                        margin-left: 4px;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: rgba(0, 0, 0, 0.45);
                        line-height: 17px;
                    }
                    >span:nth-child(2) {
                        span{
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            color: #8C8C8C;
                            line-height: 17px;
                        }
                        span::before{
                            content: '';
                            display: inline-block;
                            width: 10px;
                            height: 4px;
                            background: #5b8ff9;
                            margin: 0 3px 3px 20px;
                        }
                        span:nth-child(2)::before{
                            background: #f6bd16;
                        }
                    }
                }
                .bar, .line{
                    //height: calc(100% - 21px)!important;
                }
            }
        }
        .table{
            /deep/ .row{
                height: 32px;
                line-height: 32px;
            }
        }
    }
}
</style>