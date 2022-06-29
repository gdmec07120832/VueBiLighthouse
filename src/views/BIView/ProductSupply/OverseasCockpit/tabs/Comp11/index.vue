<!--
 * @Author: 黄浩
 * @Date: 2022-01-10 11:00:23
 * @LastEditTime: 2022-02-18 11:00:35
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp11\index.vue
-->
<template>
    <div class="Comp11">
        <div class="select">
            <Radio v-bind="radio" :model.sync="radio.model"/>
            <!-- <a-month-picker v-model="date" format="年月(YYYY-MM)" valueFormat="YYYYMM" :allowClear="false" suffixIcon=" " style="width: 150px"/> -->
            <!-- <Datepicker :date1.sync="month1" :date2.sync="month2" :size="'default'"/> -->
            <DatepickerV3 v-bind="dateV2" 
            :dayOrMonth.sync="dateV2.dayOrMonth"
            :day2.sync="dateV2.day2"
            :month1.sync="dateV2.month1"
            :month2.sync="dateV2.month2"
            />
        </div>
        <div class="ps">
            <div style="color: rgb(136, 142, 153);line-height: 14px;margin: 9px 0 0">备注：</div>
            <div style="color: rgb(136, 142, 153)">【1】当月：年化周转率（金额）=累计发出/((期初含压货+期末含压货)/2)*当年总天数/当前天数；</div>
            <div style="color: rgb(136, 142, 153)">【2】历史：年化周转率(金额)=累计发出/((期初含压货+期末含压货)/2)*12/当前月份。</div>
        </div>
        <div class="content">
            <div class="left" style="position: relative">
                <div class="item">
                    <div>海外全链路</div>
                    <div class="footer1">
                        <div class="c1">
                            <div class="row">周转率</div>
                            <div class="row" @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(0, panel1.v1)}]">{{panel1.v1 === 0 ? '--' : handleNum(3, panel1.v1)}}</div>
                        </div>
                        <div class="c2">
                            <div class="row1">
                                <div class="col">同比</div>
                                <div class="col" @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(1, panel1.v2)}]">{{handleNum(2, panel1.v2)}}</div>
                            </div>
                            <div class="row1">
                                <div class="col">环比</div>
                                <div class="col" @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(2, panel1.v3)}]">{{handleNum(2, panel1.v3)}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div>海外链路(海外仓模块+亚马逊仓模块)</div>
                    <div class="footer1">
                        <div class="c1">
                            <div class="row">周转率</div>
                            <div class="row" @contextmenu.prevent="openMenu($event)" >{{panel2.v1 === 0 ? '--' : handleNum(3, panel2.v1)}}</div>
                        </div>
                        <div class="c2">
                            <div class="row1">
                                <div class="col">同比</div>
                                <div class="col" @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(3, panel2.v2)}]">{{handleNum(2, panel2.v2)}}</div>
                            </div>
                            <div class="row1">
                                <div class="col">环比</div>
                                <div class="col" @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(4, panel2.v3)}]">{{handleNum(2, panel2.v3)}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <CopyBoard ref="CopyBoard"/>
            </div>
            <Border style="padding: 10px 20px"/>
            <v-chart ref="echart1" class="chart" :options="echart1" autoresize></v-chart>
        </div>
        <div class="footer">
            <div class="left">
                <div>人员周转</div>
                <v-chart ref="echart2" class="chart" :options="echart2" autoresize></v-chart>
            </div>
            <Border style="padding: 10px 20px"/>
            <div class="right">
                <virtual-select style="width: 150px;margin-right: 0;position: absolute; right: 0px"
                    v-model="people"
                    :options="peopleArr.map((_) => ({ label: _ }))"
                    label="人员"
                ></virtual-select>
                <Table class="table" v-bind="table"/>
            </div>
        </div>
    </div>
</template>

<script>
import DatepickerV3 from '../../components/DatepickerV3'
import Radio from '../../components/Radio'
import moment from 'moment'
import Border from '../../components/Border'
import _ from 'lodash'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import Table from '../../components/Table'
// import Datepicker from '../../components/Datepicker.vue'
import base from '../../utils/base.js'
import CopyBoard from '../../components/CopyBoard.vue'
export default {
    mixins:[ base ],
    components: {
        Radio,
        Border,
        VirtualSelect,
        Table,
        // Datepicker,
        DatepickerV3,
        CopyBoard,
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel1)
        this.echart2 = _.cloneDeep(this.echartModel2)
        this.getData()
        this.getPeople()
        this.getDataByOneMonth()
        this.getPeopleByOneMonth()
        let arr = [{name: 'a'}, {name: 'b'}]
        console.log(arr.filter(_ => 'a'.indexOf(_.name) > -1));
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
        if(this.echart2 !== null) this.echart2 = null
    },
    computed: {
        month() {
            return this.dateV2.month1 + this.dateV2.month2
        }
    },
    watch: {
        'radio.model': {
            handler() {
                this.handleData(2, this.echart1Data)
                this.handleData(4, this.tableData)
                this.handleData(3, this.ecahrt2Data)
            }
        },
        month: {
            handler() {
                this.getData()
                this.getPeople()
            }
        },
        'dateV2.day2': {
            handler() {
                this.getDataByOneMonth()
                this.getPeopleByOneMonth() 
            }
        },
        people: {
            handler() {
                this.handleData(4, this.tableData)
            }
        }
    },
    data() {
        let that = this
        return {
            // 海外全链路
            panel1: {
                v1: '--',
                v2: '--',
                v3: '--'
            },
            // 海外链路
            panel2: {
                v1: '--',
                v2: '--',
                v3: '--'
            },
            dateV2: {
                options: ['核心指标', '趋势明细'],
                dayOrMonth: 1,
                day2: moment(new Date()).format('YYYYMM'),
                monthType: 2,
                month1: moment(new Date()).subtract(1, 'y').format('YYYYMM'),
                month2: moment(new Date()).format('YYYYMM'),
            },
            radio: {
                name: '链路类型',
                arr: [
                    { label: '海外全链路', value: 1 },
                    { label: '海外链路', value: 2 },
                ],
                model: 1
            },
            // date: moment(new Date()).format('YYYYMM'),
            // month1: moment(new Date()).format('YYYYMM') - 100 + '',
            // month2: moment(new Date()).format('YYYYMM'),
            echartModel1: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: function(params) {
                        let str = `统计年月：${params[0].data[0]}<br/>周转率：${that.handleNum(2, params[0].data[1])}`
                        return str
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)'
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
                    }
                },
                series: [
                    {
                    symbolSize: 8,
                    name: '采购环比趋势',
                    data: [],
                    type: 'line',
                    smooth: true
                    }
                ]
            },
            echart1: null,
            echart1Data: [],
            echartModel2: {
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: function(params) {
                        let str = `人员：${params.data[0]}<br/>周转率：${that.handleNum(3, params.data[1])}`
                        return str
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)'
                    },
                    borderWidth: 1,
                    borderColor: '#ccc'
                },
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: '5%',
                    top: '9%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisTick: {
                            show: false,
                            alignWithLabel: true
                        },
                        axisLine: {
                            show: false,
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#f7f7f7'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '统计年月',
                        type: 'bar',
                        barWidth: '30%',
                        data: [],
                        itemStyle: {
                            // color: function(params) {
                            //     let color = ['#ff5953', '#00a854']
                            //     return color[params.dataIndex % 2 === 0 ? '0' : '1']
                            // }
                            color: ['#6395f9']
                        },
                        label: {
                            show: false,
                            position: 'top'
                        },
                        z: 2
                    }
                ]
            },
            echart2: null,
            ecahrt2Data: [],
            people: [],
            peopleArr: [],
            table: {
                type: 2,
                index: 10,
                labelData: ['统计年月', '周转目标', '实际周转', '差值', '上期周转', '与上期差值'],
                tableData: []
            },
            tableData: [],
        }
    },
    methods: {
        computeColor(p, value) {
            if(p === 0) {
                if(value === 0 || value === null || value === '--') return
                if(this.panel1.v4 <= 0) return '#ff5953'
                else return '#00a854'
            }else if(p === 1 || p === 2 || p === 3 || p === 4) {
                if(value > 0) return '#ff5953'
                else if(value < 0) return '#00a854'
            }
        },
        // 月-范围
        async getData() {
            let query = {
                START_TIME: this.dateV2.month1 + '01',
                END_TIME: this.dateV2.month2 + moment(this.dateV2.month2).daysInMonth(),
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_annual_turnover', query)
            res.data.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
            this.echart1Data = res.data.concat()
            this.handleData(2, res.data)
        },
        // 月-范围
        async getPeople() {
            let query = {
                START_TIME: this.dateV2.month1 + '01',
                END_TIME: this.dateV2.month2 + moment(this.dateV2.month2).daysInMonth(),
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_annual_turnover_stf', query)
            this.peopleArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.STAFF_NAME))))
            res.data.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
            this.tableData = res.data.concat()
            this.handleData(4, this.tableData)
        },
        // 单月
        async getDataByOneMonth() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + moment(this.dateV2.day).daysInMonth(),
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_annual_turnover', query)
            res.data.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
            this.echart1Data = res.data.concat()
            this.handleData(1, res.data)
        },
        async getPeopleByOneMonth() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + moment(this.dateV2.day2).daysInMonth(),
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_annual_turnover_stf', query)
            // this.peopleArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.STAFF_NAME))))
            res.data.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
            this.ecahrt2Data = res.data.concat()
            this.handleData(3, res.data)
        },
        // 1处理左上角 2处理周转率月趋势 3人员周转 4table
        handleData(type, source) {
            if(type === 1) {
                console.log(1);
                for(let key in this.panel1) this.panel1[key] = '--'
                for(let key in this.panel2) this.panel2[key] = '--'
                if(!source.length) return
                let keys = [
                    ['ALL_TRNVR_RATE', 'ALL_AGO_TRNVR_RATE', 'ALL_LAST_TRNVR_RATE'],
                    ['TRNVR_RATE', 'AGO_TRNVR_RATE', 'LAST_TRNVR_RATE'],
                ]
                keys.forEach((item, index) => {
                    item.forEach((key, index1) => this['panel' + (index + 1)]['v' + (index1 + 1)] = source[0][key])
                })
                this.panel1.v4 = source[0].ALL_AGO_TRNVR_DIFF
                console.log(this.panel1,this.panel2);
            }else if(type === 2) {
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel1)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                if(!source.length) return
                let arr = source.concat()
                // x轴
                this.echart1.xAxis.data = arr.map(_ => moment(_.MDATE).format('YYYY-MM'))
                // line
                let keys = this.radio.model === 1 ? ['MDATE', 'ALL_TRNVR_RATE'] : ['MDATE', 'TRNVR_RATE']
                this.echart1.series[0].data = arr.map(item => {
                    return keys.map((key, index) => {
                        if(index === 0) return moment(item[key]).format('YYYY-MM')
                        else if(index === 1) return item[key]
                    })
                })
            }else if(type === 3) {
                this.$refs?.echart2?.$refs?.echarts?.clear()
                this.echart2 = _.cloneDeep(this.echartModel2)
                this.echart2.xAxis.data = []
                this.echart2.series[0].data = []
                if(!source.length) return
                // 轴
                this.echart2.xAxis[0].data = Object.freeze(Array.from(new Set(source.map(_ => _.STAFF_NAME))))
                // bar
                // let keys = this.radio.model === 1 ? ['STAFF_NAME', 'ALL_TRNVR_RATE'] : ['STAFF_NAME', 'TRNVR_RATE']
                this.echart2.series[0].data = this.echart2.xAxis[0].data.map(name => {
                    let key = this.radio.model === 1 ? 'ALL_TRNVR_RATE' : 'TRNVR_RATE'
                    console.log(source.filter(item => name.indexOf(item.STAFF_NAME) > -1));
                    return [
                        name,
                        source.filter(item => name.indexOf(item.STAFF_NAME) > -1)[0][key]
                    ]
                })
                // console.log(this.echart2.series[0].data, source);
            }else if(type === 4) {
                this.table.tableData = []
                if(!source.length) {
                    this.table.tableData.push(['--', '--', '--', '--', '--','--'])
                    return
                }
                let keys = this.radio.model === 1 ? ['MDATE', '', 'ALL_TRNVR_RATE', '', 'ALL_LAST_TRNVR_RATE', ''] : ['MDATE', '', 'TRNVR_RATE', '', 'LAST_TRNVR_RATE', '']
                let people = !this.people.length ? this.peopleArr.concat() : this.people.concat()
                let arr = Object.freeze(Array.from(new Set(source.map(_ => moment(_.MDATE).format('YYYY-MM')))))
                .map(date => {
                    return source.filter(_ => date === moment(_.MDATE).format('YYYY-MM'))
                })
                .map(_ => _.filter(item => people.indexOf(item.STAFF_NAME) > -1))
                arr = arr.map(month => {
                    return [
                        moment(month[0].MDATE).format('YYYY-MM'),
                        '--',
                        month.map(p => p[keys[2]]).reduce((a, b) => a + b),
                        '--',
                        month.map(p => p[keys[4]]).reduce((a, b) => a + b),
                        '--',
                    ]
                })
                // arr = arr.map(item => {
                //     let keys4 = this.radio.model === 1 ? keys1.concat() :  keys2.concat()
                //     return [
                //         item[keys4[0]],
                //         item[keys4[1]],
                //         item[keys4[2]],
                //         item[keys4[3]],
                //         item[keys4[4]],
                //         item[keys4[5]],
                //     ]
                // })
                // 还差合计
                this.table.tableData = arr.concat()
            }
        },
        
    }
}
</script>

<style lang='scss' scoped>
@import '../../assets/styles.scss';
.Comp11{
    flex: 1;
    position: relative;
    padding: 10px 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .select{
        position: absolute;
        right: 20px;
        display: flex;
        /deep/ .ant-radio-wrapper{
            width: 100px!important
        }
    }
    .ps{

    }
    .content{
        // flex: 1;
        height: calc(100% - 263px);
        display: flex;
        border-bottom: #f2f2f2;
        .left{
            width: 20%;
            display: flex;
            flex-direction: column;
            .item{
                flex: 1;
                display: flex;
                flex-direction: column;
                .footer1{
                    display: flex;
                    .c1{
                        width: 30%;
                        .row{
                            font-size: 12px;
                            line-height: 32px;
                            font-weight: bold;
                        }
                    }
                    .c2{
                        flex: 1;
                        .row1{
                            display: flex;
                            width: 100%;
                            .col{
                                width: 50%;
                                height: 50%;
                                font-size: 12px;
                                line-height: 32px;
                            }
                        }
                    }
                }
            }
        }
        .chart{
            flex: 1;
        }
    }
    .footer{
        // flex: 1;
        height: 200px;
        display: flex;
        .left{
            // flex: 1;
            width: calc(33% - 20.5px);
            display: flex;
            flex-direction: column;
            .chart{
                flex: 1;
            }
        }
        .right{
            // flex: 3;
            width: calc(67% - 20.5px);
            position: relative;
            .table{
                margin: 40px 0 0;
                width: 100%;
                // height: 80%;
                /deep/ .row{
                    font-size: 14px;
                    line-height: 25px;
                    height: 25px;
                }
            }
        }
    }
}
</style>