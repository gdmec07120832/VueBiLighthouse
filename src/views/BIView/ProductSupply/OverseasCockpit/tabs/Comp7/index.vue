<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 18:11:13
 * @LastEditTime: 2022-02-11 11:55:36
 * @LastEditors: Please set LastEditors
 * @Descripttion: 头程费用
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp7\index.vue
-->
<template>
    <div class="Comp7">
        <div class="select">
            <Radio v-if="dateV2.dayOrMonth === 2" v-bind="radio" :model.sync="radio.model"/>
            <Border v-if="dateV2.dayOrMonth === 2" style="padding: 5px 20px"/>
            <!-- <a-month-picker v-model="date" :allowClear="false" format="年月(YYYY-MM)" valueFormat="YYYYMM" suffixIcon=" " style="width: 150px"/> -->
            <!-- <Datepicker :date1.sync="month1" :date2.sync="month2" :size="'default'"/> -->
            <DatepickerV3 v-bind="dateV2" 
            :dayOrMonth.sync="dateV2.dayOrMonth"
            :day2.sync="dateV2.day2"
            :month1.sync="dateV2.month1"
            :month2.sync="dateV2.month2"
            />
        </div>
        <div class="header">
            <div>头程费用-累计当月</div>
            <div class="bottom">
                <div class="left">
                    <div class="row1">
                        实际占比
                    </div>
                    <div class="row2" @contextmenu.prevent="openMenu($event)" :style="[{'font-size': '20px','font-weight': 'bold', color: computeColor(panel.v1)}]">
                        {{handleNum(2, panel.v1)}}
                    </div>
                </div>
                <div class="item">
                    <div class="col">
                        <div class="row1">
                            占比目标
                        </div>
                        <div class="row2" @contextmenu.prevent="openMenu($event)">
                            {{handleNum(2, panel.v2)}}
                        </div>
                    </div>
                    <div class="col">
                        <div class="row1">
                            头程费用
                        </div>
                        <div class="row2" @contextmenu.prevent="openMenu($event)">
                            {{handleNum(1, panel.v3)}}
                        </div>
                    </div>
                    <div class="col">
                        <div class="row1">
                            本月差值
                        </div>
                        <div class="row2" @contextmenu.prevent="openMenu($event)">
                            {{handleNum(1, panel.v4)}}
                        </div>
                    </div>
                </div>
                <Border style="padding: 5px 20px"/>
                <div class="item">
                    <div class="col">
                        <div class="row1">
                            上月占比
                        </div>
                        <div class="row2" @contextmenu.prevent="openMenu($event)">
                            {{handleNum(2, panel.v5)}}
                        </div>
                    </div>
                    <div class="col">
                        <div class="row1">
                            上期费用
                        </div>
                        <div class="row2" @contextmenu.prevent="openMenu($event)">
                            {{handleNum(1, panel.v6)}}
                        </div>
                    </div>
                    <div class="col">
                        <div class="row1">
                            上期差值
                        </div>
                        <div class="row2" @contextmenu.prevent="openMenu($event)">
                            {{handleNum(1, panel.v7)}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <CopyBoard ref="CopyBoard"/>
        <div class="chart">
            <div>头程费用情况</div>
            <v-chart ref="chart1" class="content" :options="echart1" autoresize></v-chart>
        </div>
        <Table class="table" style="margin: 10px 0" v-bind="table"/>
    </div>
</template>

<script>
import Radio from '../../components/Radio'
import Border from '../../components/Border'
import moment from 'moment'
import _ from 'lodash'
import Table from '../../components/Table'
// import Datepicker from '../../components/Datepicker'
import DatepickerV3 from '../../components/DatepickerV3'
import base from '../../utils/base.js'
import CopyBoard from '../../components/CopyBoard.vue'
export default {
    mixins: [ base ],
    components: {
        Radio,
        Border,
        Table,
        // Datepicker,
        DatepickerV3,
        CopyBoard,
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel)
        this.getCurrent()
        this.getData()
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
    },
    computed: {
        month() {
            return this.dateV2.month1 + this.dateV2.month2
        }
    },
    watch: {
        'dateV2.day2': {
            handler() {
                this.getCurrent()
            }
        },
        month: {
            handler() {
                this.getData()
            }
        },
        'radio.model': {
            handler() {
                this.handleData(1, this.currentData)
                this.handleData(2, this.tableData)
                this.handleData(3, this.tableData)
            }
        }
    },
    data() {
        let that = this
        return {
            radio: {
                name: '是否含关税',
                arr: [
                    { label: '含关税', value: 1 },
                    { label: '不含关税', value: 2 },
                ],
                model: 1
            },
            dateV2: {
                options: ['核心指标', '趋势明细'],
                dayOrMonth: 1,
                day2: moment(new Date()).format('YYYYMM'),
                monthType: 2,
                month1: moment(new Date()).subtract(1, 'y').format('YYYYMM'),
                month2: moment(new Date()).format('YYYYMM'),
            },
            echartModel: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: function(params) {
                        let str = `统计年月：${params[0].data[0]}<br/>头程费用：${that.handleNum(1, params[0].data[1])}<br/>实际占比：${that.handleNum(2, params[1].data[1])}`
                        return str
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)'
                    },
                    borderWidth: 1,
                    borderColor: '#ccc'
                },
                // legend: {
                //     top: '0%',
                //     left: 'center',
                //     orient: 'horizontal',
                //     align: 'left',
                //     itemWidth: 13,
                //     itemHeight: 13,
                //     data: ['花费', '广告RoAS'],
                //     icon: 'rect'
                // },
                color: ['#6395f9', '#f6bd16'],
                grid: {
                    left: '0%',
                    right: '0%',
                    top: '9%',
                    bottom: '0%',
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
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: false,
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        }
                    },
                    {
                        type: 'value',
                        // show: false,
                        splitLine: {
                            show: false,
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            formatter: value => value + '%'
                        }
                    }
                ],
                series: [
                    {
                        name: '花费',
                        data: [],
                        type: 'bar',
                        smooth: true,
                        yAxisIndex: 0,
                        barWidth: 20
                    },
                    {
                        name: '广告RoAS',
                        data: [],
                        type: 'line',
                        smooth: true,
                        symbolSize: 7,
                        yAxisIndex: 1,
                    }
                ]
            },
            echart1: null,
            table: {
                type: 2,
                index: 6,
                labelData: ['统计年月', '实际占比', '目标占比', '头程费用', '发货业绩'],
                tableData: []
            },
            tableData: [],
            panel: {
                v1: 0,
                v2: 0,
                v3: 0,
                v4: 0,
                v5: 0,
                v6: 0,
                v7: 0,
            }
        }
    },
    methods: {
        computeColor(value) {
            if(value === null || this.panel.v2 === null) return
            if(value - this.panel.v2 > 0) return '#00a854'
            else if(value - this.panel.v2 < 0) return '#ff5953'
        },
        async getData() {
            let query = {
                START_TIME: this.dateV2.month1 + '01',
                END_TIME: this.dateV2.month2  + '01',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_hp_hk', query)
            res.data.sort((a, b) => moment(a.TDATE).toDate().getTime() - moment(b.TDATE).toDate().getTime())
            this.tableData = res.data.concat()
            this.handleData(2, res.data)
            this.handleData(3, res.data)
        },
        // 获取当月数据
        async getCurrent() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2  + '01',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_hp_hk', query)
            this.currentData = res.data.concat()
            this.handleData(1, this.currentData)
        },
        async handleData(type, source) {
            // panel数据
            if(type === 1) {
                if(!source.length){
                    for(let key in this.panel) {
                        this.panel[key] = '--'
                    }
                    return
                }
                // 含税 
                let keys = ['RATE_TAX', 'TARGET', 'AMOUNT_TAX', 'DIFF_TAX', 'LAST_RATE_TAX', 'LAST_AMOUNT_TAX', 'LAST_DIFF_TAX']
                // 不含税
                let keys1 = ['RATE', 'TARGET', 'AMOUNT', 'DIFF', 'LAST_RATE', 'LAST_AMOUNT', 'LAST_DIFF']
                let arr = this.radio.model === 1 ? keys : keys1
                arr.forEach((key, index) => {
                    this.panel['v' + (index + 1)] = source[0][key]
                })
            // table数据
            }else if(type === 2) {
                if(!source.length) {
                    this.table.tableData = []
                    this.table.tableData.push(['--', '--', '--', '--', '--'])
                    return
                }
                this.table.labelData = ['统计年月', '实际占比', '目标占比', '头程费用', '发货业绩']
                // 含税 不含税
                let keys = this.radio.model === 1 ? ['TDATE', 'RATE_TAX', 'TARGET', 'AMOUNT_TAX', 'DLVR_AMT'] : ['TDATE', 'RATE', 'TARGET', 'AMOUNT', 'DLVR_AMT']
                let arr = source.concat()
                arr = arr.map(item => {
                    return [
                        item[keys[0]],
                        item[keys[1]],
                        item[keys[2]],
                        item[keys[3]],
                        item[keys[4]]
                    ]
                })
                // 获取合计
                let query = {
                    START_TIME: this.dateV2.month1 + '01',
                    END_TIME: this.dateV2.month2 + '01',
                }
                let res = await this.$fetchSql('oversea_cockpit', 'oversea_hp_hk_s', query)
                arr.unshift(keys.map((key, index) => {
                    if(index === 0) return '合计'
                    else return res.data[0][key]
                }))
                this.table.tableData = arr.concat()
            // chart
            }else if(type === 3) {
                if(!source.length) {
                    this.$refs?.chart1?.$refs?.echarts.clear()
                    this.echart1 = _.cloneDeep(this.echartModel)
                    this.echart1.xAxis.data = []
                    this.echart1.series[0].data = []
                    this.echart1.series[1].data = []
                    return
                }
                this.$refs?.chart1?.$refs?.echarts.clear()
                this.echart1 = _.cloneDeep(this.echartModel)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                this.echart1.series[1].data = []
                // x轴
                let arr = source.concat()
                this.echart1.xAxis.data = arr.map(_ => moment(_.TDATE).format('YYYY-MM'))
                // bar 费用
                let keys = ['TDATE', this.radio.model === 1 ? 'AMOUNT_TAX' : 'AMOUNT']
                this.echart1.series[0].data = arr.map((item) => {
                    return keys.map((key, index) => {
                        if(index === 0) return moment(item[key]).format('YYYY-MM')
                        else if(index === 1) return item[key]
                    })
                })
                // line 占比
                let keys1 = ['TDATE', this.radio.model === 1 ? 'RATE_TAX' : 'RATE']
                this.echart1.series[1].data = arr.map((item) => {
                    return keys1.map((key, index) => {
                        if(index === 0) return moment(item[key]).format('YYYY-MM')
                        else if(index === 1) return item[key]
                    })
                })
                console.log(this.echart1);
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.Comp7{
    flex: 1;
    position: relative;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    .select{
        position: absolute;
        right: 20px;
        top: 10px;
        display: flex;
    }
    .header{
        display: flex;
        flex-direction: column;
        .bottom{ 
            flex: 1;
            display: flex;
            .left{
                width: 8%;
                height: 64px;
                .row1, .row2{
                    font-size: 12px;
                    line-height: 32px;
                }
            }
            .item{
                width: 21%;
                height: 64px;
                display: flex;
                .col{
                    flex: 1;
                    .row1, .row2{
                        font-size: 12px;
                        line-height: 32px;
                        text-align: center;
                    }
                }
            }
        }
    }
    .chart{
        flex: 6;
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        .content{
            flex: 1;
        }
    }
    .table{
        // flex: 4;
    }
}
</style>