<!--
 * @Author: 黄浩
 * @Date: 2022-01-10 09:06:46
 * @LastEditTime: 2022-02-11 16:50:19
 * @LastEditors: Please set LastEditors
 * @Descripttion: 仓储费用
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp8\index.vue
-->
<template>
    <div class="Comp8">
        <div class="select">
            <div class="ps">备注：①数据更新频率改为周更新，跟新节点为每周三；②仓储费暂只设定总目标；</div>
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
                    <div class="l1">总仓储费</div>
                    <div class="l2">实际占比</div>
                    <div class="l3" @contextmenu.prevent="openMenu($event)" :style="[{'font-weight': 'bold', color: computeColor(panel1.v1)}]">{{this.computeNum(0, panel1.v1)}}</div>
                </div>
                <!-- <Border style="padding: 5px 30px;flex: 1"/> -->
                <Border style="padding: 5px 0px;flex: 1"/>
                <div class="right" style="flex: 2">
                    <div class="row">
                        <div class="col">
                            <div>占比目标</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(2, panel1.v2)}}</div>
                        </div>
                        <div class="col">
                            <div>仓储费用</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel1.v3)}}</div>
                        </div>
                        <div class="col">
                            <div>本月差值</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(2, panel1.v4)}}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div>上月占比</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(2, panel1.v5)}}</div>
                        </div>
                        <div class="col">
                            <div>上期费用</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel1.v6)}}</div>
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
            <div class="item" style="margin: 0 40px">
                <div class="icon">
                    <div class="row"></div>
                    <div class="col"></div>
                    <div class="row"></div>
                </div>
                <div class="left">
                    <div class="l1">FBA仓储费</div>
                    <div class="l2">FBA实际占比</div>
                    <div class="l3" @contextmenu.prevent="openMenu($event)" style="font-weight: bold">{{this.computeNum(1, panel2.v1)}}</div>
                </div>
                <Border style="padding: 5px 0px;flex: 1"/>
                <div class="right" style="flex: 1">
                    <div class="row">
                        <div class="col">
                            <div>仓储费用</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel2.v2)}}</div>
                        </div>
                        <div class="col">
                            <div>上期费用</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel2.v3)}}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div>上月占比</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(2, panel2.v4)}}</div>
                        </div>
                        <div class="col">
                            <div>上期差值</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel2.v5)}}</div>
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
                    <div class="l1">FBM仓储费</div>
                    <div class="l2">FBM实际占比</div>
                    <div class="l3" @contextmenu.prevent="openMenu($event)" style="font-weight: bold">{{this.computeNum(2, panel3.v1)}}</div>
                </div>
                <Border style="padding: 5px 0px;flex: 1"/>
                <div class="right" style="flex: 1">
                    <div class="row">
                        <div class="col">
                            <div>仓储费用</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel3.v2)}}</div>
                        </div>
                        <div class="col">
                            <div>上期费用</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel3.v3)}}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div>上月占比</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(2, panel3.v4)}}</div>
                        </div>
                        <div class="col">
                            <div>上期差值</div>
                            <div @contextmenu.prevent="openMenu($event)">{{this.handleNum(1, panel3.v5)}}</div>
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
                <div>仓储费情况</div>
                <Radio v-bind="radio" :model.sync="radio.model"/>
            </div> 
            <v-chart ref="chart1" style="height: calc(100% - 41px)" class="content" :options="echart1" autoresize></v-chart>
        </div>
        <Table class="table" v-bind="table"/>
    </div>
</template>

<script>

import moment from 'moment'
import Border from '../../components/Border'
import Radio from '../../components/Radio'
import _ from 'lodash'
import Table from '../../components/Table'
import DatepickerV3 from '../../components/DatepickerV3'
import base from '../../utils/base.js'
import CopyBoard from '../../components/CopyBoard.vue'
export default {
    mixins: [ base ],
    components: {
        Border,
        Radio,
        Table,
        DatepickerV3,
        CopyBoard,
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
            handler() {
                this.handleData(2, this.tableData)
                this.handleData(3, this.tableData)
            }
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
            date: moment(new Date()),
            radio: {
                name: '类型',
                arr: [
                    { label: '总仓储费', value: 1 },
                    { label: 'FBA仓储费', value: 2 },
                    { label: 'FBM仓储费', value: 3 },
                ],
                model: 1
            },
            echartModel: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: function(params) {
                        let str = `统计年月：${params[0].data[0]}<br/>${that.radio.model === 1 ? '总' : that.radio.model === 2 ? 'FBA' : 'FBM'}仓储费用：${that.handleNum(1, params[0].data[1])}<br/>实际占比：${that.handleNum(2, params[1].data[1])}`
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
                        barWidth: 20,
                        type: 'bar',
                        smooth: true,
                        yAxisIndex: 0,
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
                index: 7,
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
            },
            panel3: {
                v1: null,
                v2: null,
                v3: null,
                v4: null,
                v5: null,
            },
            dateV2: {
                options: ['核心指标', '趋势明细'],
                dayOrMonth: 1,
                day2: moment(new Date()).format('YYYYMM'),
                monthType: 2,
                month1: moment(new Date()).subtract(1, 'y').format('YYYYMM'),
                month2: moment(new Date()).format('YYYYMM'),
            },
            currentData: [],
            tableData: []
        }
    },
    methods: {
        computeNum(p, value) {
            if(p === 0) {
                if(value === 0 || value === null || value === undefined) return '--'
                return this.handleNum(2, value)
            }else if(p === 1 || p === 2) {
                if(value === 0 || value === null || value === undefined) return '--'
                return this.handleNum(2, value)
            }
        },
        computeColor(value) {
            if(value === 0 || value === null || this.panel1.v2 === null) return
            if(value - this.panel1.v2 < 0) return '#ff5953'
            else if(value - this.panel1.v2 > 0) return '#00a854'
        },
        async getCurrent() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2  + '01',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_warehouse_fee', query)
            this.currentData = res.data.concat()
            this.handleData(1, this.currentData)
        },
        async getData() {
            let query = {
                START_TIME: this.dateV2.month1 + '01',
                END_TIME: this.dateV2.month2  + '01',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_warehouse_fee', query)
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
                let keys1= ['RATE', 'STORAGE_TARGET', 'AMOUNT', '', 'LAST_RATE', 'LAST_AMOUNT', '']
                // FBA仓储费
                let keys2 = ['FBA_RATE', 'FBA_AMOUNT', 'LAST_FBA_AMOUNT', 'LAST_FBA_RATE', '']
                // FBM仓储
                let keys3 = ['FBM_RATE', 'FBM_AMOUNT', 'LAST_FBM_AMOUNT', 'LAST_FBM_RATE', '']
                // 需要算出差值
                keys1.forEach((key, index) => {
                    if(index !== 3 && index !== 6) {
                        this.panel1['v' + (index + 1)] = source[0][key]
                    }else if(index === 3) {
                        this.panel1['v' + (index + 1)] = (source[0][keys1[0]] === null || source[0][keys1[1]] === null) ? '--' : source[0][keys1[0]] - source[0][keys1[1]]
                    }else if(index === 6) {
                        // 本期费用 - 上期费用
                        this.panel1['v' + (index + 1)] = (source[0][keys1[2]] === null || source[0][keys1[5]] === null || source[0][keys1[2]] === undefined || source[0][keys1[5]] === undefined ) ? '--' : source[0][keys1[2]] - source[0][keys1[5]]
                    }
                })
                keys2.forEach((key, index) => {
                    if(index !== 4) this.panel2['v' + (index + 1)] = source[0][key]
                    else if(index === 4) {
                        this.panel2['v' + (index + 1)] = (source[0][keys2[1]] === null || source[0][keys2[2]] === null || source[0][keys2[1]] === undefined || source[0][keys2[2]] === undefined ) ? '--' : source[0][keys2[1]] - source[0][keys2[2]]
                    }
                })
                keys3.forEach((key, index) => {
                    if(index !== 4) this.panel3['v' + (index + 1)] = source[0][key]
                    else if(index === 4) {
                        this.panel3['v' + (index + 1)] = (source[0][keys3[1]] === null || source[0][keys3[2]] === null || source[0][keys3[1]] === undefined || source[0][keys3[2]] === undefined ) ? '--' : source[0][keys3[1]] - source[0][keys3[2]]
                    }
                })
                console.log(this.panel3);
            }else if(type === 2) {
            // table数据
                if(!source.length) {
                    this.table.tableData = []
                    this.table.tableData.push(['--', '--', '--', '--', '--'])
                    return
                }
                // 总费用
                let keys1 = ['TDATE', 'RATE', 'STORAGE_TARGET', 'AMOUNT', 'DLVR_AMT']
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
                console.log(this.table);
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
                        if(index === 0) return moment(item[key]).format('YYYY-MM')
                        else if(index === 1) return item[key]
                    })
                })
                // line 占比
                let keys1 = ['TDATE', this.radio.model === 1 ? 'RATE' : this.radio.model === 2 ? 'FBA_RATE' : 'FBM_RATE']
                this.echart1.series[1].data = arr.map((item) => {
                    return keys1.map((key, index) => {
                        if(index === 0) return moment(item[key]).format('YYYY-MM')
                        else if(index === 1) return item[key]
                    })
                })
            }
        }
    }
}
</script>

<style lang='scss' scoped>
/deep/ .ant-radio-wrapper{
    width: 100px!important;
}
.Comp8{
    flex: 1;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    .select{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .ps{
            color: #ff261d;
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
                margin-left: 40px;
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
                }
            }
            .right{
                margin-right: 40px;
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
                        text-align: center;
                    }
                    .col:nth-child(1) {
                        text-align: left;
                    }
                    .col:nth-last-child(1) {
                        text-align: right;
                    }
                }
            }
        }
    }
    .chart{
        // flex: 1;
        height: calc(100% - 277px);
        .select{
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
        }
    }
    .table{
        margin: 10px 0;
        // flex: 1;
        /deep/ .row{
            height: 25px;
            line-height: 25px;
        }
    }
}
</style>