<!--
 * @Author: 黄浩
 * @Date: 2022-01-19 16:04:49
 * @LastEditTime: 2022-03-01 09:14:44
 * @LastEditors: Please set LastEditors
 * @Descripttion: 退款率
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp15\components\MonthV2.vue
-->
<template>
    <div class="Day">
        <div class="header">
            <div class="item">
                <div>未发取消-当天</div>
                <div class="panel">
                    <div class="col">
                        <div class="row">未发取消率</div>
                        <div class="row" @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(0, panel1.v1)}]">{{handleNum(2, panel1.v1, true)}}</div>
                    </div>
                    <div class="col">
                        <div class="row">目标占比</div>
                        <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(2, panel1.v2, true)}}</div>
                    </div>
                    <div class="col">
                        <div class="row">本日差值</div>
                        <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(2, panel1.v3)}}</div>
                    </div>
                    <div class="col" style="padding: 0">
                        <div class="row">未发取消{{radioModel === 1 ? '金额' : '数量'}}</div>
                        <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(1, panel1.v4, true)}}</div>
                    </div>
                </div>
            </div>
            <Border :padding="'0 44px'"/>
            <!-- <div style="width: 100%;padding: 10px 5px">
                <div style="width: 100%;height: 1px;background: #f5f5f5;"></div>
            </div> -->
            <div class="item">
                <div>未发取消-累计本月</div>
                <div class="panel">
                    <div class="col">
                        <div class="row">未发取消率</div>
                        <div class="row" @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(1, panel2.v1)}]">{{handleNum(2, panel2.v1, true)}}</div>
                    </div>
                    <div class="col">
                        <div class="row">目标占比</div>
                        <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(2, panel2.v2, true)}}</div>
                    </div>
                    <div class="col">
                        <div class="row">本月差值</div>
                        <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(2, panel2.v3)}}</div>
                    </div>
                    <div class="col">
                        <div class="row">未发取消{{radioModel === 1 ? '金额' : '数量'}}</div>
                        <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(1, panel2.v4, true)}}</div>
                    </div>
                </div>
            </div>
            <CopyBoard ref="CopyBoard"/>
        </div>
        <div class="right middle">
            <div style="margin: 0 0 10px 0">未发取消率趋势</div>
            <v-chart ref="echart1" style="height: calc(100% - 31px)" :options="echart1" autoresize></v-chart>
        </div>
        <Table class="table" v-bind="table"/>
    </div>
</template>

<script>
import graphic from 'echarts/lib/util/graphic'
import moment from 'moment'
import _ from 'lodash'
import base from '../../../utils/base.js'
import CopyBoard from '../../../components/CopyBoard.vue'
import Table from '../../../components/Table'
import Border from '../../../components/Border'
export default {
    mixins: [ base ],
    props: {
        dateV2: {
            type: Object,
            default: () => {}
        },
        radioModel: {
            type: Number,
        }
    },
    components: {
        CopyBoard,
        Table,
        Border
    },
    computed: {
        month() {
            return this.dateV2.month1 + this.dateV2.month2
        }  
    },
    watch: {
        // 'dateV2.day2': {
        //     handler() {
        //         // this.getDay()
        //         // this.getMonth()
        //         this.getPeople()
        //         this.getData()
        //     }
        // },
        radioModel: {
            handler() {
                // this.handleData(1, this.currentDay)
                // this.handleData(2, this.currentMonth)
                this.handleData(3, this.echart1Data)
                this.handleData(4, this.echart1Data)
                console.log(this.echart2Data);
                this.handleData(5, this.echart2Data)
                this.handleData(6, this.echart3Data)
            }
        },
        month: {
            handler() {
                this.getDay()
                this.getMonth()
                this.getData()
            }
        }
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel1)
        this.getDay()
        this.getMonth()
        this.getData()
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
    },
    data() {
        let that = this
        return {
            // 右上角图
            echartModel1: {
                tooltip: {
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    formatter: function(params) {
                        let fun = (num) => {
                        let colors = ['#2680eb', '#cce0e9']
                            return `<div style="border-radius: 5px;width: 10px;height: 10px;background: ${colors[num]};display: inline-block;margin: 1px 5px 1px 0"></div>`
                        }
                        let div1 = fun(0), div2 = fun(1)
                        let flag = moment(params[0].data[0]).format('x') > moment(moment(new Date()).format('YYYYMM')).format('x')
                        let str = `统计年月：${params[0].data[0]}<br/>${div1}未发取消率：${flag ? '--' : that.handleNum(2, params[0].data[1], true)}<br/>${div2}同期未发取消率：${that.handleNum(2, params[0].data[2], true)}`
                        return str
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ccc'
                },
                legend: {
                    // top: '25%',
                    // right: '0%',
                    // orient: 'vertical',
                    // align: 'left',
                    // itemWidth: 13,
                    // itemHeight: 13,
                    // data: [],
                    icon: 'circle',
                    selectedMode: false
                },
                color: ['#6c9bf9'],
                grid: {
                    left: '0%',
                    right: '0%',
                    top: '8%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        formatter: (value) => {
                            return (moment(value).month() + 1) + '月'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#f6f6f6'
                        }
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        formatter: value => {
                            return (value * 100).toFixed(2) + '%'
                        }
                    }
                },
                series: [
                    {
                        // symbolSize: 8,
                        name: '未发取消率',
                        data: [],
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            color: '#2680eb'
                        },
                        lineStyle: {
                            color: '#2680eb',
                            width: 1.5
                        },
                        areaStyle: {
                            color: new graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                offset: 0,
                                color: '#2680eb'
                                },
                                {
                                offset: 1,
                                color: '#2680eb00'
                                }
                            ])
                        },
                        // symbol: 'none'
                    },
                    {
                        name: '同期未发取消率',
                        type: 'line',
                        barWidth: '20',
                        data: [],
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 1,
                        smooth: true,
                        // symbol: 'none',
                        itemStyle: {
                            color: '#cce0e9'
                        },
                        lineStyle: {
                            color: '#cce0e9',
                            width: 1.5,
                        },
                        areaStyle: {
                            color: new graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                offset: 0,
                                color: '#cce0e9'
                                },
                                {
                                offset: 1,
                                color: '#cce0e900'
                                }
                            ])
                        },
                    },
                ]
            },
            echart1: null,
            radio2: {
                name: '选项',
                arr: [
                    { label: '趋势', value: 1 },
                    { label: '明细', value: 2 },
                ],
                model: 1
            },
            people: [],
            peopleArr: [],
            tableData: {},
            panel1: {
                v1: 0,
                v2: 0,
                v3: 0,
                v4: 0
            },
            panel2: {
                v1: 0,
                v2: 0,
                v3: 0,
                v4: 0
            },
            currentDay: [],
            currentMonth: [],
            echart1Data: [],
            table: {
                type: 2,
                index: '14B',
                labelData: ['月份', '本期未发取消金额', '未发取消率', '同期未发取消率'],
                tableData: []
            },
        }
    },
    methods: {
        computeColor(p, value) {
            if(p === 0) {
                if(this.panel1.v1 - this.panel1.v2 < 0) return '#ff5953'
                else if(this.panel1.v1 - this.panel1.v2 > 0) return '#00a854'
            }else if(p === 1) {
                if(this.panel2.v1 - this.panel2.v2 < 0) return '#ff5953'
                else if(this.panel2.v1 - this.panel2.v2 > 0) return '#00a854'
            }
        },
        handleChange() {

        },
        // 获取当天 月最后一天
        async getDay() {
            let day = moment(this.dateV2.day2).month() !== moment(new Date()).month() ? moment(this.dateV2.day2).format('YYYYMM') + moment(this.dateV2.day2).daysInMonth() + '' : moment(new Date()).format('YYYYMMDD')
            let query = {
                START_TIME: day,
                END_TIME: day,
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_cannel_d', query)
            this.currentDay = res.data.concat()
            this.handleData(1, this.currentDay)
        },
        // 获取当月
        async getMonth() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + moment(this.dateV2.day2).daysInMonth(),
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_cannel_m', query)
            this.currentMonth = res.data.concat()
            this.handleData(2, this.currentMonth)
        },
        async handleData(type, source) {
            // 1当天退款/货 2当月 3明细 4echart1 5echart2 6echart3
            if(type === 1) {
                if(!source.length){
                    for(let key in this.panel1) {
                        this.panel1[key] = '--'
                    }
                    return
                }
                // 退款
                let keys = ['REFUND_AMT_RATE', 'MON_TARGET', 'REFUND_AMT_DIFF', 'REFUND_AMT']
                // 退货
                let keys1 = ['REFUND_CNT_RATE', 'MON_TARGET', 'REFUND_CNT_DIFF', 'REFUND_CNT']
                let arr = this.radioModel === 1 ? keys : keys1
                // 还需要目标占比和本日差值
                arr.forEach((key, index) => {
                    // if(index !== 3 && index !== 6) {
                        this.panel1['v' + (index + 1)] = source[0][key]
                    // }
                    // else if(index === 3) {
                    //     this.panel['v' + (index + 1)] = (source[0][arr[1]] === null || source[0][arr[2]] === null) ? '--' : source[0][arr[1]] - source[0][arr[2]]
                    // }else if(index === 6) {
                    //     // 需要上期目标
                    //     this.panel['v' + (index + 1)] = (source[0][arr[1]] === null || source[0][arr[5]] === null) ? '--' : source[0][arr[1]] - source[0][arr[5]]
                    // }
                })
            }else if(type === 2) {
            // 当月退款/货
                // 需要合计一下
                if(!source.length){
                    for(let key in this.panel1) {
                        this.panel2[key] = '--'
                    }
                    return
                }
                // 退款
                let keys = ['REFUND_AMT_RATE', 'MON_TARGET', 'REFUND_AMT_DIFF', 'REFUND_AMT']
                // 退货
                let keys1 = ['REFUND_CNT_RATE', 'MON_TARGET', 'REFUND_CNT_DIFF', 'REFUND_CNT']
                let arr = this.radioModel === 1 ? keys : keys1
                // 还需要目标占比和本日差值
                arr.forEach((key, index) => {
                    // if(index !== 3 && index !== 6) {
                        this.panel2['v' + (index + 1)] = source[0][key]
                    // }
                    // else if(index === 3) {
                    //     this.panel['v' + (index + 1)] = (source[0][arr[1]] === null || source[0][arr[2]] === null) ? '--' : source[0][arr[1]] - source[0][arr[2]]
                    // }else if(index === 6) {
                    //     // 需要上期目标
                    //     this.panel['v' + (index + 1)] = (source[0][arr[1]] === null || source[0][arr[5]] === null) ? '--' : source[0][arr[1]] - source[0][arr[5]]
                    // }
                })
            }else if(type === 3) {
            // 明细
                this.table.tableData = []
                this.table.labelData =  ['月份', this.radioModel === 1 ? '本期未发取消金额' : '本期未发取消数量', '未发取消率', '同期未发取消率']
                if(!source.length) {
                    this.table.tableData.push(['/', '/', '/', '/'])
                    return
                }
                // 金额
                let keys1 = ['MDATE', 'REFUND_AMT', 'REFUND_AMT_RATE', 'TQ_REFUND_AMT_RATE']
                // 数量
                let keys2 = ['MDATE', 'REFUND_CNT', 'REFUND_CNT_RATE', 'TQ_REFUND_CNT_RATE']
                let arr = source.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
                arr = arr.map(item => {
                    let keys4 = this.radioModel === 1 ? keys1.concat() : keys2.concat()
                    return [
                        item[keys4[0]],
                        item[keys4[1]],
                        item[keys4[2]],
                        item[keys4[3]],
                    ]
                })
                this.table.tableData = arr.concat()
                // if(arr.length < 31) {
                //     let num = 31 - arr.length
                //     for(let i = 0; i < num; i++) {
                //         arr.push(['--', '--', '--', '--', '--'])
                //     }
                // }
                // this.table.tableData = arr.concat()
                console.log(arr);
            }else if(type === 4) {
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel1)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                if(!source.length) return
                let arr = source.concat()
                // x轴
                this.echart1.xAxis.data = arr.map(_ => moment(_.MDATE).format('YYYY-MM'))
                // line
                let keys = this.radioModel === 1 ? ['MDATE', 'REFUND_AMT_RATE', 'TQ_REFUND_AMT_RATE'] : ['MDATE', 'REFUND_CNT_RATE', 'TQ_REFUND_CNT_RATE']
                this.echart1.series[0].data = arr.map(item => {
                    return keys.map((key, index) => {
                        if(index === 0) return moment(item[key]).format('YYYY-MM')
                        else if(index === 1) return moment(moment(item[keys[0]]).format('YYYYMM')).format('x') > moment(moment(new Date()).format('YYYYMM')).format('x') ? null : item[key]
                        else if(index === 2) return item[key]
                    })
                })
                this.echart1.series[1].data = arr.map(item => {
                    return keys.map((key, index) => {
                        if(index === 0) return moment(item[key]).format('YYYY-MM')
                        else if(index === 1) return item[keys[2]]
                    })
                })
            }
        },
        async getData() {
            let query = {
                START_TIME: this.dateV2.month2 + '0101',
                // END_TIME: this.dateV2.month2 + moment(this.dateV2.month2).daysInMonth(),
                END_TIME: this.dateV2.month2 + '1231',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_cannel_m', query)
            res.data.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
            this.echart1Data = res.data.concat()
            this.handleData(3, res.data)
            this.handleData(4, res.data)
        }
    }
}
</script>

<style lang='scss' scoped>
@import '../../../assets/styles.scss';
.Day{
    .header{
        // flex: 45;
        // height: calc(100% - 299px);
        display: flex;
        // border-bottom: 1px solid #f5f5f5;
        position: relative;
        margin-bottom: 10px;
        .item{
            // flex: 1;
            // display: flex;
            // flex-direction: column;
            .panel{
                // flex: 1;
                display: flex;
                .col{
                    // flex: 1;
                    padding: 0 50px 0 0 ;
                    .row{
                        font-size: 12px;
                        line-height: 32px;
                        height: 50%;
                    }
                }
                .col:nth-child(1) .row:nth-child(2) {
                    font-size: 20px;
                }
            }
        }
        .item:nth-child(1) {
            //margin: 0 88px 0 0;
        }
    }
    .middle{
        height: calc(100% - 325px);
        margin: 0 0 20px 0;
    }
    .table{
        margin: 0 0 10px 0;
        /deep/ .col1 {
            min-width: 120px;
            max-width: 120px;
        }
        /deep/ .row{
            height: 50px;
            line-height: 50px;
        }
    }
}
</style>