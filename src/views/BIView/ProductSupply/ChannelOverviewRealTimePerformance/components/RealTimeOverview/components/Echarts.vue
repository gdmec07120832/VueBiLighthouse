<!--
 * @Author: 黄浩
 * @Date: 2021-12-23 11:51:01
 * @LastEditTime: 2021-12-31 09:04:01
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\ChannelOverviewRealTimePerformance\components\RealTimeOverview\components\echarts.vue
-->
<template>
    <div class="echarts">
        <div id="line1" class="left"></div>
        <div id="line2" class="right"></div>
    </div>
</template>

<script>
import numeral from 'numeral'
import * as echarts from 'echarts5/lib/echarts'
import 'echarts5/lib/component/tooltip'
import 'echarts5/lib/component/title'
import { GridComponent } from 'echarts5/components'
import { LineChart } from 'echarts5/charts';
import moment from 'moment'
// import { LegendComponent } from 'echarts5/components';
import _ from 'lodash'

echarts.use([GridComponent])
echarts.use([LineChart])
// echarts.use([LegendComponent]);

export default {
    watch: {
        currentTab: {
            async handler() {
                await this.getData()
                if(this.currentBtn === 1){
                    this.getAgoData(this.date)
                }
            }
        },
        currentView: {
            async handler() {
                await this.getData()
                if(this.currentBtn === 1){
                    this.getAgoData(this.date)
                }
            }
        },
        currentBtn: {
            handler(val) {
                if(val === 0){
                    this.$emit('update:date',moment(new Date()).format('YYYYMMDD'))
                    this.getData()
                }else if(val === 1) {
                    this.getAgoData(this.date)
                }
            }
        },
        date: {
            handler() {
                this.getAgoData(this.date)
            }
        }
    },
    props: {
        currentTab: {
            type: Number
        },
        currentView: {
            type: Number
        },
        date: {
            type: String
        },
        currentBtn: {
            type: Number
        },
        duration: {
            type: Number
        }
    },
    created() {
        let that = this
        this.timer = setInterval(async () => {
            if(that.currentBtn === 0){
                that.getData()
            }else if(that.currentBtn === 1) {
                await that.getData()
                that.getAgoData(that.date)
            }
        }, that.duration);
        this.getData()
        // this.getData(moment(new Date()).format('YYYYMMDD') - 10000 + '', 1, 1)
    },
    mounted() {
        this.initLine('line1',this.option1)
        this.initLine('line2',this.option2)
    },
    beforeDestroy() {
        if(this.line1 !== null) this.line1.dispose()
        if(this.line2 !== null) this.line2.dispose()
        clearInterval(this.timer)
    },
    data() {
        return {
            timer: null,
            model: {
                title: {
                    text: '分时趋势图',
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 400,
                        fontFamily: 'PingFangSC-Medium, PingFang SC',
                        color: '#4D5053',
                        lineHeight: 20,
                    },
                    top: 2,
                    left: 16,
                },
                // // 绘图系统
                grid: {
                    top: '40',
                    bottom: '30',
                    // left: '4%',
                    right: '10',
                },
                // 取色盘
                color: ['#5B8FF9','#DFE4EA','#DFE4EA'],
                // 每条线的取色策略
                colorBy: 'series',
                // 图例
                // legend: {
                //     data: ['同期业绩', '支付业绩'],
                //     show: false,
                // },
                // 提示框
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        let str = `小时: ${params[0].axisValue}<br/>`
                        params.forEach(item => {
                            str += item.seriesName + ':' + numeral(item.value).format('0,0') + '<br/>'
                        })
                        return str
                    },
                    axisPointer: {
                        type: 'none'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
                    // 坐标轴刻度标签
                    axisLabel: {
                        color: 'rgba(0,0,0,0.45)',
                        fontSize: 12,
                        fontFamily: 'Helvetica'
                    },
                    // 坐标轴刻度
                    axisTick: {
                        show: false
                    },
                    // 坐标轴轴线
                    axisLine: {
                        show: false
                    },
                },
                yAxis: {
                    type: 'value',
                    // 坐标轴在 grid 区域中的分隔线。
                    splintLine: {
                        lineStyle: {
                            color: ['#DFE4EA']
                        }
                    },
                    axisLabel: {
                        color: 'rgba(0,0,0,0.45)',
                        fontSize: 12,
                        fontFamily: 'Helvetica',
                        formatter: function (value,index) {
                            return (value / 10000).toLocaleString() + '万';
                        },
                    },
                },
                series: [
                    {
                        name: '支付业绩',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        z: 2,
                    },
                    {
                        name: '同期业绩',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        z: 1,
                    },
                ],
            },
            // 分时趋势图
            line1: null,
            option1: {},
            // 时段累计图
            line2: null,
            option2: {}
        }
    },
    methods: {
        initLine(id,option) {
            if(this[id] === null) {
                this[id] = echarts.init(document.getElementById(id))
            }
            let myChart = this[id]
            myChart.setOption(option)
            let that = this
            window.addEventListener('resize',function() {
                let el = document.getElementsByClassName('echarts')[0]
                setTimeout(() => {
                    myChart.resize()
                }, 100)
            })
        },
        // 分时趋势图数据
        // 获取数据并赋值 tdate 哪一天的数据    optionIndex 更改那个option    index 更改option中那series哪一行的数据
        // key 决定属性名 SALE_AMT 业绩 
        async getData() {
            let map = ['全司视角', '全中视角', '品市视角']
            let map1 = ['全司', '线上渠道', '线下渠道', '海外渠道']
            let params = {
                CHANNEL_VIEW: map[this.currentView - 1],
                CHANNEL: this.currentTab === 1 ? ['全司', '全中', '品市'][this.currentView - 1] : map1[this.currentTab - 1],
                TDATE: moment(new Date()).format('YYYYMMDD'),
            }
            let res = await this.$fetchSql('real_time', 'read_time_hours', params)
            this.option1 = _.cloneDeep(this.model)
            this.option2 = _.cloneDeep(this.model)
            this.option2.title.text = '时段累计图'
            if(res.data.length){
                let length = moment(new Date()).format('HH')*1 + 1
                // 图一 第一条线 当前
                this.option1.series[0].data = res.data.map(item => {
                    return item.SALE_AMT
                })
                // 图一 第二条线 同期
                this.option1.series[1].data = res.data.map(item => {
                    return item.AGO_AMT
                })
                // 图二 第一条线 当前
                this.option2.series[0].data = res.data.map(item => {
                    return item.SALE_AMT_TOT
                })
                // 图二 第二条线 同期
                this.option2.series[1].data = res.data.map(item => {
                    return item.AGO_AMT_TOT
                })
                this.option1.series[0].data.splice(length)
                this.option2.series[0].data.splice(length)
            }else{
                this.option1.series[0].data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                this.option1.series[1].data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                this.option2.series[0].data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                this.option2.series[1].data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            }
            this.initLine('line1',this.option1)
            this.initLine('line2',this.option2)
        },
        async getAgoData(TDATE) {
            let map = ['全司视角', '全中视角', '品市视角']
            let map1 = ['全司', '线上渠道', '线下渠道', '海外渠道']
            let params = {
                CHANNEL_VIEW: map[this.currentView - 1],
                CHANNEL: this.currentTab === 1 ? ['全司', '全中', '品市'][this.currentView - 1] : map1[this.currentTab - 1],
                TDATE: TDATE,
            }
            let res = await this.$fetchSql('real_time', 'read_time_hours', params)
            if(res.data.length){
                this.option1.series[1].data = res.data.map(item => {
                    return item.SALE_AMT
                })
                this.option1.series[1].name = '对比业绩'
                this.option2.series[1].data = res.data.map(item => {
                    return item.SALE_AMT_TOT
                })
                this.option2.series[1].name = '对比累计业绩'
            }else{
                this.option1.series[1].name = '对比业绩'
                this.option1.series[1].data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                this.option2.series[1].name = '对比累计业绩'
                this.option2.series[1].data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            }
            this.initLine('line1',this.option1)
            this.initLine('line2',this.option2)
        }
    }
}
</script>

<style lang='scss' scoped>
.echarts{
    // flex: 1;
    height: 290px;
    display: flex;
    .left{
        height: 290px;
        width: 50%;
        overflow: visible;
    }
    .right{
        height: 290px;
        width: 50%;
        overflow: visible;
    }
}
</style>