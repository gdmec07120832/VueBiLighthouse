<!--
 * @Author: 黄浩
 * @Date: 2022-01-10 09:06:46
 * @LastEditTime: 2022-02-28 14:04:38
 * @LastEditors: Please set LastEditors
 * @Descripttion: 配送费用
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp9\index.vue
-->
<template>
    <div class="Comp8">
<!--        <Title :label="'配送费用'" :ps="'备注：数据更新频率改为周更新，更新节点为每周三；'"/>-->
        <div class="titleBox" style="display: flex;align-items: center;">
            <Title :label="'配送费用'" :ps="'备注：数据更新频率改为周更新，更新节点为每周三；'"/>
            <div style="flex: 1"></div>
            <Radio v-bind.sync="titleBox.radio"/>
            <a-month-picker v-if="titleBox.radio.model === '指标'" class="ml10" style="width: 150px" v-model="titleBox.month" :allowClear="false" valueFormat="YYYYMM"/>
            <RangeMonthPicker v-if="titleBox.radio.model === '明细'" class="ml10" :value.sync="titleBox.rangeMonth" style="width: 200px"/>
        </div>
        <div style="width: calc(100% + 40px);height: 1px;background: #ccc;margin: 9.5px 0;transform: translateX(-20px)"></div>
        <div class="select" style="display: none">
            <div></div>
<!--            <div class="ps">备注：数据更新频率改为周更新，更新节点为每周三；</div>-->
            <!-- <a-month-picker v-model="date" format="年月(YYYY-MM)" valueFormat="YYYYMM" :allowClear="false" suffixIcon=" " style="width: 150px"/> -->
            <DatepickerV3 v-bind="dateV2" 
            :dayOrMonth.sync="dateV2.dayOrMonth"
            :day2.sync="dateV2.day2"
            :month1.sync="dateV2.month1"
            :month2.sync="dateV2.month2"
            />
        </div>
        <div class="panel" style="position: relative">
            <div class="item">
                <div class="icon">
                    <div class="row"></div>
                    <div class="col"></div>
                    <div class="row"></div>
                </div>
                <div class="left">
                    <div class="l1">总配送费</div>
                    <div class="l2">实际占比</div>
                    <div class="l3" @contextmenu.prevent="openMenu($event)" :style="[{'font-weight': 'bold',color: computeColor(0, panel1.v1)}]">{{panel1.va === 0 ? '--' : this.handleNum(2, panel1.v1)}}</div>
                </div>
                <Border style="padding: 5px 30px"/>
                <div class="right">
                    <div class="row">
                        <div class="col">
                            <div>占比目标</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(2, panel1.v2, true)}}</div>
                        </div>
                        <div class="col">
                            <div>配送费用</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel1.v3, true)}}</div>
                        </div>
                        <div class="col">
                            <div>本月差值</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(2, panel1.v4)}}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div>上期配送费</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel1.v5, true)}}</div>
                        </div>
                        <div class="col">
                            <div>环比</div>
                            <div @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(1, panel1.v6)}]">{{this.handleNum(2, panel1.v6)}}</div>
                        </div>
                        <div class="col">
                            <div>上期差值</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel1.v7)}}</div>
                        </div>
                    </div>
                </div>
                <div class="icon">
                    <div class="row"></div>
                    <div class="col"></div>
                    <div class="row"></div>
                </div>
            </div>
            <!-- <Border style="padding: 5px 40px;" /> -->
            <div class="item" style="margin: 0 80px">
                <div class="icon">
                    <div class="row"></div>
                    <div class="col"></div>
                    <div class="row"></div>
                </div>
                <div class="left">
                    <div class="l1">FBA配送费</div>
                    <div class="l2">FBA实际占比</div>
                    <div class="l3" @contextmenu.prevent="openMenu($event)" :style="[{'font-weight': 'bold',color: computeColor(2, panel2.v1)}]">{{panel2.v1 === 0 ? '--' : this.handleNum(2, panel2.v1)}}</div>
                </div>
                <Border style="padding: 5px 30px"/>
                <div class="right">
                    <div class="row">
                        <div class="col">
                            <div>占比目标</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(2, panel2.v2, true)}}</div>
                        </div>
                        <div class="col">
                            <div>配送费用</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel2.v3, true)}}</div>
                        </div>
                        <div class="col">
                            <div>本月差值</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(2, panel2.v4)}}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div>上期配送费</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel2.v5, true)}}</div>
                        </div>
                        <div class="col">
                            <div>环比</div>
                            <div @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(3, panel1.v6)}]">{{this.handleNum(2, panel2.v6)}}</div>
                        </div>
                        <div class="col">
                            <div>上期差值</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel2.v7)}}</div>
                        </div>
                    </div>
                </div>
                <div class="icon">
                    <div class="row"></div>
                    <div class="col"></div>
                    <div class="row"></div>
                </div>
            </div>
            <!-- <Border style="padding: 5px 40px;" /> -->
            <div class="item">
                <div class="icon">
                    <div class="row"></div>
                    <div class="col"></div>
                    <div class="row"></div>
                </div>
                <div class="left">
                    <div class="l1">FBM配送费</div>
                    <div class="l2">FBM实际占比</div>
                    <div class="l3" @contextmenu.prevent="openMenu($event)" :style="[{'font-weight': 'bold',color: computeColor(4, panel3.v1)}]">{{panel3.v1 === 0 ? '--' : this.handleNum(2, panel3.v1)}}</div>
                </div>
                <Border style="padding: 5px 30px"/>
                <div class="right">
                    <div class="row">
                        <div class="col">
                            <div>占比目标</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(2, panel3.v2, true)}}</div>
                        </div>
                        <div class="col">
                            <div>配送费用</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel3.v3, true)}}</div>
                        </div>
                        <div class="col">
                            <div>本月差值</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(2, panel3.v4)}}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div>上期配送费</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel3.v5, true)}}</div>
                        </div>
                        <div class="col">
                            <div>环比</div>
                            <div @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(5, panel1.v6)}]">{{this.handleNum(2, panel3.v6)}}</div>
                        </div>
                        <div class="col">
                            <div>上期差值</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel3.v7)}}</div>
                        </div>
                    </div>
                </div>
                <div class="icon">
                    <div class="row"></div>
                    <div class="col"></div>
                    <div class="row"></div>
                </div>
            </div>
            <CopyBoard ref="CopyBoard"/>
        </div>
        <div class="chart">
            <div class="select">
                <div>费用占比月趋势</div>
                <Radio v-bind="radio" :model.sync="radio.model"/>
            </div> 
            <v-chart ref="chart1" style="overflow: visible;height: calc(100% - 61px)" class="content" :options="echart1" autoresize></v-chart>
        </div>
        <Table class="table" v-bind="table"/>
    </div>
</template>

<script>

import Title from '../../components/Title'
import moment from 'moment'
import Border from '../../components/Border'
import Radio from '../../components/Radio'
import _ from 'lodash'
import Table from '../../components/Table'
import DatepickerV3 from '../../components/DatepickerV3'
import base from '../../utils/base.js'
import CopyBoard from '../../components/CopyBoard.vue'
import RangeMonthPicker from '../../components/RangeMonthPicker'
export default {
    mixins: [ base ],
    components: {
        Border,
        Radio,
        Table,
        DatepickerV3,
        CopyBoard,
        Title,
        RangeMonthPicker,
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel)
        this.getCurrent()
        this.getData()
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
            handler(val) {
                this.handleData(2, this.tableData)
                this.handleData(3, this.tableData)
                this.echart1.legend.data = ['实际占比', `${this.radio.arr[val - 1].label}`]
                this.echart1.series[0].name = val === 1 ? '总配送费' : val === 2 ? 'FBA配送费' : 'FBM配送费'
            }
        },
        'titleBox.radio.model': {
            handler(val){
                if(val === '指标')this.dateV2.dayOrMonth = 1
                else if(val === '明细')this.dateV2.dayOrMonth = 2
            }
        },
        'titleBox.month': {
            handler(val){
                this.dateV2.day2 = val
            }
        },
        'titleBox.rangeMonth': {
            handler(val){
                this.dateV2.month1 = val[0].format('YYYYMM')
                this.dateV2.month2 = val[1].format('YYYYMM')
            },
            deep: true
        }
    },
    computed: {
        month() {
            return this.dateV2.month1 + this.dateV2.month2
        }
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
    },
    data() {
        let that = this
        return {
            titleBox: {
                radio: {
                    name: '',
                    arr: [
                        {label: '指标', value: '指标'},
                        {label: '明细', value: '明细'},
                    ],
                    model: '指标'
                },
                month: moment().format('YYYYMM'),
                rangeMonth: [
                    moment().startOf('year'),
                    moment().endOf('year'),
                ],
            },
            date: moment(new Date()),
            radio: {
                name: '类型',
                arr: [
                    { label: '总配送费', value: 1 },
                    { label: 'FBA配送费', value: 2 },
                    { label: 'FBM配送费', value: 3 },
                ],
                model: 1
            },
            echartModel: {
                tooltip: {
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    formatter: function(params) {
                        let fun = (num) => {
                            let colors = ['#f6bd16', '#6395f9']
                            return `<div style="border-radius: 5px;width: 10px;height: 10px;background: ${colors[num]};display: inline-block;margin: 1px 5px 1px 0"></div>`
                        }
                        let div1 = fun(0), div2 = fun(1)
                        let flag = moment(params[0].data[0]).format('x') > moment(moment(new Date()).format('YYYYMM')).format('x')
                        let str = `统计年月：${params[0].data[0]}<br/>${div1}费用占比：${flag ? '--' : that.handleNum(2, params[1].data[1], true)}<br/>${div2}配送费用：${flag ? '--' : that.handleNum(1, params[0].data[1], true)}`
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
                //     top: '0%',
                //     left: 'center',
                //     orient: 'horizontal',
                //     align: 'left',
                //     itemWidth: 13,
                //     itemHeight: 13,
                    data: ['实际占比', '总配送费'],
                    icon: 'circle',
                    selectedMode: false
                },
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
                        name: '总配送费',
                        data: [],
                        barWidth: 20,
                        type: 'bar',
                        smooth: true,
                        yAxisIndex: 0,
                    },
                    {
                        name: '实际占比',
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
                index: 8,
                labelData: ['统计年月', '实际占比', '目标占比', '当期费用', '发货业绩'],
                tableData: []
            },
            panel1: {
                v1: null,
                v2: null,
                v3: null,
                v4: null,
                v5: null,
                v6: null,
                v7: null,
            },
            panel2: {
                v1: null,
                v2: null,
                v3: null,
                v4: null,
                v5: null,
                v6: null,
                v7: null,
            },
            panel3: {
                v1: null,
                v2: null,
                v3: null,
                v4: null,
                v5: null,
                v6: null,
                v7: null,
            },
            dateV2: {
                options: ['核心指标', '趋势明细'],
                dayOrMonth: 1,
                day2: moment(new Date()).format('YYYYMM'),
                monthType: 2,
                month1: moment(new Date()).format('YYYY') + '01',
                month2: moment(new Date()).format('YYYY') + '12',
            },
            currentData: [],
            tableData: []
        }
    },
    methods: {
        computeColor(p, value) {
            if(p === 0) {
                if(value === 0 || value === null || this.panel1.v2 === null) return
                if(value - this.panel1.v2 < 0) return '#ff5953'
                else if(value - this.panel1.v2 > 0) return '#00a854'
            }else if(p === 2 || p === 4) {
                if(value === 0 || value === null) return
                if(value < 0) return '#ff5953'
                else if(value > 0) return '#00a854'
            }else if(p === 1 || p === 3 || p === 5) {
                if(value === 0 || value === null) return
                if(value > 0) return '#ff5953'
                else if(value < 0) return '#00a854'
            }
        },
        async getCurrent() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2  + moment(this.dateV2.day2).daysInMonth(),
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_distribution_fee', query)
            this.currentData = res.data.concat()
            this.handleData(1, this.currentData)
        },
        async getData() {
            let query = {
                START_TIME: this.dateV2.month1 + '01',
                END_TIME: this.dateV2.month2  + moment(this.dateV2.month2).daysInMonth(),
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_distribution_fee', query)
            res.data.sort((a, b) => moment(a.TDATE).toDate().getTime() - moment(b.TDATE).toDate().getTime())
            this.tableData = res.data.concat()
            this.handleData(2, res.data)
            this.handleData(3, res.data)
        },
        handleData(type, source) {
            // panel数据
            if(type === 1) {
                if(!source.length){
                    for(let key in this.panel1) {
                        this.panel1[key] = '--'
                    }
                    for(let key in this.panel2) {
                        this.panel2[key] = '--'
                    }
                    for(let key in this.panel3) {
                        this.panel3[key] = '--'
                    }
                    return
                }
                // 总仓储费 
                let keys1= ['RATE', 'DELIVER_TARGET', 'AMOUNT', '', 'LAST_AMOUNT', 'LAST', '']
                // FBA仓储费
                let keys2 = ['FBA_RATE', '', 'FBA_AMOUNT', 'FBA_RATE', 'LAST_FBA_AMOUNT', 'LAST_FBA', '']
                // FBM仓储
                let keys3 = ['FBM_RATE', '', 'FBM_AMOUNT', 'FBM_RATE', 'LAST_FBM_AMOUNT', 'LAST_FBM', '']
                // 需要算出差值
                keys1.forEach((key, index) => {
                    if(index !== 3 && index !== 6) {
                        this.panel1['v' + (index + 1)] = source[0][key]
                    }else if(index === 3) {
                        this.panel1['v' + (index + 1)] = (source[0][keys1[0]] === null || source[0][keys1[1]] === null) ? '--' : source[0][keys1[0]] - source[0][keys1[1]]
                    }else if(index === 6) {
                        // 本期费用 - 上期费用
                        this.panel1['v' + (index + 1)] = (source[0][keys1[2]] === null || source[0][keys1[4]] === null) ? '--' : source[0][keys1[2]] - source[0][keys1[4]]
                    }
                })
                keys2.forEach((key, index) => {
                    if(index !== 1 && index !==6) this.panel2['v' + (index + 1)] = source[0][key]
                    // else if(index === 3) {
                    //     this.panel2['v' + (index + 1)] = (source[0][keys2[0]] === null || source[0][keys2[1]] === null) ? '--' : source[0][keys2[0]] - source[0][keys2[1]]
                    // }
                    else if(index === 6) {
                        this.panel2['v' + (index + 1)] = (source[0][keys2[2]] === null || source[0][keys2[4]] === null) ? '--' : source[0][keys2[2]] - source[0][keys2[4]]
                    }
                })
                console.log(this.panel2);
                keys3.forEach((key, index) => {
                    if(index !== 1 && index !==6) this.panel3['v' + (index + 1)] = source[0][key]
                    else if(index === 6) {
                        this.panel3['v' + (index + 1)] = (source[0][keys3[2]] === null || source[0][keys3[4]] === null) ? '--' : source[0][keys3[2]] - source[0][keys3[4]]
                    }
                })
            }else if(type === 2) {
            // table数据
                this.table.tableData = []
                if(!source.length) {
                    this.table.tableData.push(['/', '/', '/', '/', '/'])
                    return
                }
                // 总费用
                let keys1 = ['TDATE', 'RATE', 'DELIVER_TARGET', 'AMOUNT', 'DLVR_AMT']
                // FBA
                let keys2 = ['TDATE', 'FBA_RATE', '', 'FBA_AMOUNT', 'PTD_FBA_SEND_AMT']
                // FBM
                let keys3 = ['TDATE', 'FBM_RATE', '', 'FBM_AMOUNT', 'PTD_FBM_SEND_AMT']
                let arr = source.concat()
                arr = arr.map(item => {
                    let keys4 = this.radio.model === 1 ? keys1.concat() : this.radio.model === 2 ? keys2.concat() : keys3.concat()
                    return [
                        item[keys4[0]],
                        item[keys4[1]],
                        item[keys4[2]],
                        item[keys4[3]],
                        item[keys4[4]],
                    ]
                })
                // 还差合计
                // let sum = [
                //     '合计',
                //     0,
                //     0,
                //     0,
                //     0,
                // ]
                // arr.forEach(item => {
                //     sum[1] += item[1]
                //     sum[2] += item[2]
                // })
                // sum[3] = sum[1] - sum[2]
                // arr.unshift(sum)
                this.table.tableData = arr.concat()
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
                let keys = ['TDATE', this.radio.model === 1 ? 'AMOUNT' : this.radio.model === 2 ? 'FBA_AMOUNT' : 'FBM_AMOUNT']
                this.echart1.series[0].data = arr.map((item) => {
                    return keys.map((key, index) => {
                        if(moment(item[keys[0]]).format('x') <= moment(new Date()).format('x')) {
                            if(index === 0) return moment(item[key]).format('YYYY-MM')
                            else if(index === 1) return item[key]
                        }else return null
                    })
                })
                // line 占比
                let keys1 = ['TDATE', this.radio.model === 1 ? 'RATE' : this.radio.model === 2 ? 'FBA_RATE' : 'FBM_RATE']
                this.echart1.series[1].data = arr.map((item) => {
                    return keys1.map((key, index) => {
                        if(moment(item[keys[0]]).format('x') <= moment(new Date()).format('x')) {

                            if (index === 0) return moment(item[key]).format('YYYY-MM')
                            else if (index === 1) return item[key]
                        }else return null
                    })
                })
            }
        }
    }
}
</script>

<style lang='scss' scoped>

.Comp8{
    flex: 1;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    .select{
        /deep/ .ant-radio-wrapper{
            width: 100px!important;
        }
        display: flex;
        justify-content: space-between;
        align-items: center;
        .ps{
            color: #ff261d;
            font-size: 12px;
        }
    }
    .panel{
        display: flex;
        margin-top: 20px;
        .item{
            flex: 1;
            display: flex;
            .icon{
                display: flex;
                flex-direction: column;
                justify-content: center;
                .row{
                    width: 14px;
                    height: 5px;
                    background: #f3f3f3;
                }
                .col{
                    height: 60px;
                    width: 5px;
                    background: #f3f3f3;
                }
            }
            .icon:nth-last-child(1){
                transform: rotateY(180deg)
            }
            .left{
                margin-left: 20px;
                .l1{
                    font-size: 12px;
                    line-height: 24px;
                    font-weight: bold;
                    text-align: center;
                }
                .l2{
                    font-size: 12px;
                    line-height: 24px;
                    text-align: center;
                }
                .l3{
                    font-size: 16px;
                    line-height: 24px;
                    text-align: center;
                    cursor: text;
                }
            }
            .right{
                margin-right: 0px;
                flex: 1;
                display: flex;
                flex-direction: column;
                .row{
                    flex: 1;
                    display: flex;
                    .col{
                        flex: 1;
                        font-size: 12px;
                        line-height: 20px;
                        div:nth-child(2) {
                            cursor: text;
                        }
                    }
                }
            }
        }
    }
    .chart{
        // flex: 1;
        margin-bottom: 20px;
        height: calc(100% - 312px);
        .select{
            margin: 20px 0 10px;
            display: flex;
            justify-content: space-between;
        }
    }
    .table{
        margin: 0 0 10px;
        // flex: 1;
        /deep/ .row{
            height: 30px;
            line-height: 30px;
        }
    }
}
</style>