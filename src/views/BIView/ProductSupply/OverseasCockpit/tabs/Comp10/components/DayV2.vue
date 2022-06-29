<!--
 * @Author: 黄浩
 * @Date: 2022-01-19 16:04:49
 * @LastEditTime: 2022-02-28 18:00:24
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp10\components\DayV2.vue
-->
<template>
    <div class="Day">
        <div class="header">
            <div class="item">
                <div>退款-当天</div>
                <div class="panel">
                    <div class="col">
                        <div class="row">退款率</div>
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
                        <div class="row">退款{{radioModel === 1 ? '金额' : '数量'}}</div>
                        <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(1, panel1.v4, true)}}</div>
                    </div>
                </div>
            </div>
            <Border :padding="'0 44px'"/>
            <!-- <div style="width: 100%;padding: 10px 5px">
                <div style="width: 100%;height: 1px;background: #f5f5f5;"></div>
            </div> -->
            <div class="item">
                <div>退款-累计本月</div>
                <div class="panel">
                    <div class="col">
                        <div class="row">退款率</div>
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
                        <div class="row">退款{{radioModel === 1 ? '金额' : '数量'}}</div>
                        <div class="row" @contextmenu.prevent="openMenu($event)">{{handleNum(1, panel2.v4, true)}}</div>
                    </div>
                </div>
            </div>
            <CopyBoard ref="CopyBoard"/>
        </div>
        <div class="middle">
            <div style="margin: 0px 0 0px 0">退款率趋势</div>
            <v-chart ref="echart1" style="height: calc(100% - 21px);overflow: visible" :options="echart1" autoresize></v-chart>
        </div>
        <Table class="table" v-bind="table"/>
        <Table class="table" v-bind="table1"/>
    </div>
</template>

<script>
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
    watch: {
        'dateV2.day2': {
            handler() {
                this.getDay()
                this.getMonth()
                this.getData()
            }
        },
        radioModel: {
            handler() {
                this.handleData(1, this.currentDay)
                this.handleData(2, this.currentMonth)
                this.handleData(3, this.echart1Data)
                this.handleData(4, this.echart1Data)
            }
        },
    },
    computed: {
        tableColumns() {
            return [
                { title: '统计日期', dataIndex: 'TDATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text === '合计' ? '合计' : moment(text).format('MM-DD')}</div>
                    }
                },
                { title: '人员', dataIndex: 'STAFF_NAME', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '金额退款率', dataIndex: 'REFUND_AMT_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(2, text)}</div>
                    }
                },
                { title: '本期退款金额', dataIndex: 'REFUND_AMT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(1, text)}</div>
                    }
                },
                { title: '退款金额占比', dataIndex: 'DAY_REFUND_AMT_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(2, text)}</div>
                    }
                },
                { title: '数量退款率', dataIndex: 'REFUND_CNT_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(2, text)}</div>
                    }
                },
                { title: '本期退款数量', dataIndex: 'REFUND_CNT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(1, text)}</div>
                    }
                },
                { title: '退款数量占比', dataIndex: 'DAY_REFUND_CNT_RATE', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(2, text)}</div>
                    }
                },
            ]
        }
    },
    async created() {
        this.echart1 = await _.cloneDeep(this.echartModel1)
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
            echartModel1: {
                tooltip: {
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    formatter: function(params) {
                        let str = `统计日期：${params[0].data[2]}<br/>退款率：${that.handleNum(2, params[0].data[1], true)}`
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
                    top: '25%',
                    right: '0%',
                    orient: 'vertical',
                    align: 'left',
                    itemWidth: 13,
                    itemHeight: 13,
                    data: [],
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
                    symbolSize: 8,
                    name: '当月退款趋势',
                    data: [],
                    type: 'line',
                    smooth: true
                    }
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
            table: {
                type: 2,
                index: '9A',
                labelData: ['统计日期', '商品金额', '退款金额', '退款率'],
                tableData: []
            },
            table1: {
                type: 2,
                index: '9A',
                labelData: ['统计日期', '商品金额', '退款金额', '退款率'],
                tableData: []
            },
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
        }
    },
    methods: {
        computeColor(p, value) {
            if(p === 0) {
                if(value === '--' || value === 0) return
                if(this.panel1.v1 - this.panel1.v2 < 0) return '#ff5953'
                else if(this.panel1.v1 - this.panel1.v2 > 0) return '#00a854'
            }else if(p === 1) {
                if(this.panel2.v1 - this.panel2.v2 < 0) return '#ff5953'
                else if(this.panel2.v1 - this.panel2.v2 > 0) return '#00a854'
            }
        },
        handleChange() {
        },
        // 获取当天
        async getDay() {
            let day = moment(this.dateV2.day2).month() !== moment(new Date()).month() ? moment(this.dateV2.day2).format('YYYYMM') + moment(this.dateV2.day2).daysInMonth() + '' : moment(new Date()).format('YYYYMMDD')
            let query = {
                START_TIME: day,
                END_TIME: day,
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_refund_d', query)
            this.currentDay = res.data.concat()
            this.handleData(1, this.currentDay)
        },
        // 获取当月
        async getMonth() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + moment(this.dateV2.day2).daysInMonth(),
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_refund_m', query)
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
            }
            else if(type === 2) {
            // 当月退款/货
                // 需要合计一下
                if(!source.length){
                    for(let key in this.panel1) {
                        this.panel2[key] = '--'
                    }
                    return
                }
                // 退款
                let keys = ['BQ_REFUND_RATE', 'BQ_REFUND_TARGET', 'diff', 'BQ_REFUND_AMT']
                // 退货
                let keys1 = ['REFUND_CNT_RATE', 'target', 'diff', 'REFUND_CNT']
                let arr = this.radioModel === 1 ? keys : keys1
                // 还需要目标占比和本日差值
                arr.forEach((key, index) => {
                    if(key === 'target') {
                        this.panel2['v' + (index + 1)] = null
                    }
                    else if(key === 'diff') {
                        if(source[0].BQ_REFUND_RATE === null || source[0].BQ_REFUND_TARGET === null || source[0].BQ_REFUND_TARGET === 0) this.panel2['v' + (index + 1)] = null
                        else this.panel2['v' + (index + 1)] = source[0].BQ_REFUND_RATE - source[0].BQ_REFUND_TARGET
                    }
                    else this.panel2['v' + (index + 1)] = source[0][key]
                })
            }else if(type === 3) {
            // 明细
                let daysInMonth = moment(this.dateV2.day2).format('MM') === '02' ? 15 : 16
                this.table.tableData = []
                this.table1.tableData = []
                this.table.labelData =  ['统计日期', '发货金额', this.radioModel === 1 ? '退款金额' : '退款数量', '退款率']
                this.table1.labelData = ['统计日期', '发货金额', this.radioModel === 1 ? '退款金额' : '退款数量', '退款率']
                if(!source.length) {
                    for(let i = 0; i < daysInMonth; i++) {
                        this.table.tableData.push(['/', '/', '/', '/'])
                        this.table1.tableData.push(['/', '/', '/', '/'])
                    }
                    return
                }
                // 金额
                let keys1 = ['TDATE', 'ORDER_AMT', 'REFUND_AMT', 'REFUND_AMT_RATE']
                // 数量
                // let keys2 = ['TDATE', 'FBA_RATE', '', 'FBA_AMOUNT', 'PTD_FBA_SEND_AMT']
                let keys2 = ['TDATE', 'ORDER_AMT', 'REFUND_CNT', 'REFUND_CNT_RATE']
                let arr = source.sort((a, b) => moment(a.TDATE).format('x') - moment(b.TDATE).format('x'))
                arr = arr.map(item => {
                    let keys4 = this.radioModel === 1 ? keys1.concat() : keys2.concat()
                    return [
                        item[keys4[0]],
                        item[keys4[1]],
                        item[keys4[2]],
                        item[keys4[3]],
                        // item[keys4[4]],
                    ]
                })
                if(arr.length <= daysInMonth) {
                    let num = daysInMonth - arr.length
                    for(let i = 0; i < num + daysInMonth; i++) {
                        arr.push(['/', '/', '/', '/'])
                    }
                }else if(arr.length > daysInMonth && arr.length < daysInMonth * 2) {
                    let num = daysInMonth * 2 - arr.length
                    for(let i = 0; i < num; i++) {
                        arr.push(['/', '/', '/', '/'])
                    }
                }
                this.table.tableData = arr.slice(0, daysInMonth).concat()
                this.table1.tableData = arr.slice(daysInMonth, daysInMonth * 2).concat()
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
                console.log(this.echart1);
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                if(!source.length) return
                let arr = source.concat()
                // x轴
                this.echart1.xAxis.data = arr.map(_ => moment(_.TDATE).format('DD'))
                // line
                let keys = this.radioModel === 1 ? ['TDATE', 'REFUND_AMT_RATE', 'TDATE'] : ['TDATE', 'REFUND_CNT_RATE', 'TDATE']
                this.echart1.series[0].data = arr.map(item => {
                    return keys.map((key, index) => {
                        if(index === 0) return moment(item[key]).format('DD')
                        else if(index === 1) return item[key]
                        else if(index === 2) return moment(item[key]).format('YYYY-MM-DD')
                    })
                })
            }
        },
        async getData() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + moment(this.dateV2.day2).daysInMonth(),
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_goods_refund_d', query)
            res.data.sort((a, b) => moment(a.TDATE).get('date') - moment(b.TDATE).get('date'))
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
        margin-bottom: 0px;
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
        height: calc(100% - 315px);
        margin: 10px 0 0px 0;
    }
    .table{
        margin: 0 0 10px 0;
        ///deep/ .row {
        //    height: 30px;
        //    line-height: 30px;
        //}
    }
}
</style>