<!--
 * @Author: 黄浩
 * @Date: 2022-01-10 09:53:53
 * @LastEditTime: 2022-02-17 15:05:16
 * @LastEditors: Please set LastEditors
 * @Descripttion: 退款率
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp10\index.vue
-->
<template>
    <div class="Comp10">
        <div class="select">
            <div class="ps" style="color: rgb(136, 142, 153);font-size: 12px">备注：因平台数据存在滞后，数据截止至前天。</div>
            <div class="right">
                <Radio v-bind="radio" :model.sync="radio.model"/>
                <Border style="padding: 2px 20px;height: 32px"/>
                <!-- <Radio v-bind="radio1" :model.sync="radio1.model"/> -->
                <!-- <Border style="padding: 2px 20px;height: 32px"/> -->
                <!-- <a-month-picker v-model="date" format="年月(YYYY-MM)" valueFormat="YYYYMM" :allowClear="false" suffixIcon=" " style="width: 150px"/> -->
                <DatepickerV3 v-bind="dateV2" 
                :dayOrMonth.sync="dateV2.dayOrMonth"
                :day2.sync="dateV2.day2"
                :month1.sync="dateV2.month1"
                :month2.sync="dateV2.month2"
                />
            </div>
        </div>
        <Day v-if="dateV2.dayOrMonth === 1" :dateV2="dateV2" :radioModel="radio.model" style="height: calc(100% - 32px)"/>
        <Month v-if="dateV2.dayOrMonth === 2" :dateV2="dateV2" :radioModel="radio.model" style="height: calc(100% - 32px)"/>
        <!-- <div class="header">
            <div class="left">
                <div class="item">
                    <div>退款-当天</div>
                    <div class="panel">
                        <div class="col">
                            <div class="row">退款率</div>
                            <div class="row">1234</div>
                        </div>
                        <div class="col">
                            <div class="row">目标占比</div>
                            <div class="row">1234</div>
                        </div>
                        <div class="col">
                            <div class="row">本日差值</div>
                            <div class="row">1234</div>
                        </div>
                        <div class="col">
                            <div class="row">退款金额</div>
                            <div class="row">1234</div>
                        </div>
                    </div>
                </div>
                <div style="width: 100%;padding: 10px 5px">
                    <div style="width: 100%;height: 1px;background: #f5f5f5;"></div>
                </div>
                <div class="item">
                    <div>退款-累计本月</div>
                    <div class="panel">
                        <div class="col">
                            <div class="row">退款率</div>
                            <div class="row">1234</div>
                        </div>
                        <div class="col">
                            <div class="row">目标占比</div>
                            <div class="row">1234</div>
                        </div>
                        <div class="col">
                            <div class="row">本月差值</div>
                            <div class="row">1234</div>
                        </div>
                        <div class="col">
                            <div class="row">退款金额</div>
                            <div class="row">1234</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div>当月退款趋势</div>
                <v-chart style="height: calc(100% - 21px)" :options="echart1" autoresize></v-chart>
            </div>
        </div>
        <div class="footer">
            <div class="left">
                <div style="line-height: 32px">退款占比-业务员分布</div>
                <v-chart style="flex: 1" id="chart2" class="chart2" :options="echart2" autoresize></v-chart>
            </div>
            <div class="right">
                <div class="select">
                    <div>退款率月趋势-人员视角</div>
                    <div style="display: flex;">
                        <Radio v-bind="radio2" :model.sync="radio2.model"/>
                        <Border style="padding: 2px 10px;height: 32px"/>
                        <virtual-select style="width: 150px;margin-right: 0"
                            v-model="people"
                            :options="peopleArr.map((_) => ({ label: _ }))"
                            label="人员"
                        ></virtual-select>
                    </div>
                </div>
                <v-chart v-if="radio2.model === 1" class="chart" :options="echart3" autoresize></v-chart>
                <y-table
                v-else
                style="width: 100%"
                class="text-black"
                @change="handleChange"
                :options="{ ...table, columns: tableColumns, rowClassName: (record,index) => {return rowClass(record, index)}}"
                rowKey="TID"
                :loading="table.loading"
                ></y-table>
            </div>
        </div> -->
    </div>
</template>

<script>
import Radio from '../../components/Radio'
import Border from '../../components/Border'
import moment from 'moment'
import _ from 'lodash'
// import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
// import YTable from '@/views/BIView/components/YTable/YTable2'
import DatepickerV3 from '../../components/DatepickerV3'
import Day from './components/DayV2'
import Month from './components/MonthV2'
export default {
    components: {
        Radio,
        Border,
        // VirtualSelect,
        // YTable,
        DatepickerV3,
        Day,
        Month
    },
    computed: {
        tableColumns() {
            return [
                { title: '销售单号', dataIndex: 'SYS_TRADE_NO', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
            ]
        }
    },
    created() {
        // this.echart1 = _.cloneDeep(this.echartModel1)
        // this.echart2 = _.cloneDeep(this.echartModel2)
        // this.echart3 = _.cloneDeep(this.echartModel1)
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
        if(this.echart2 !== null) this.echart2 = null
        if(this.echart3 !== null) this.echart3 = null
    },
    data() {
        return {
            dateV2: {
                dayOrMonth: 1,
                day2: moment(new Date()).format('YYYYMM'),
                monthType: 3,
                // month1: moment(new Date()).format('YYYY') + '01',
                month2: moment(new Date()).format('YYYY'),
            },
            radio: {
                name: '口径',
                arr: [
                    { label: '金额', value: 1 },
                    { label: '数量', value: 2 },
                ],
                model: 1
            },
            // radio1: {
            //     name: '时间',
            //     arr: [
            //         { label: '日度', value: 1 },
            //         { label: '月度', value: 2 },
            //     ],
            //     model: 1
            // },
            // date: moment(new Date()).format('YYYYMM'),
            // echartModel1: {
            //     // legend: {
            //     //     top: '25%',
            //     //     right: '0%',
            //     //     orient: 'vertical',
            //     //     align: 'left',
            //     //     itemWidth: 13,
            //     //     itemHeight: 13,
            //     //     data: ['name1','name2'],
            //     // },
            //     color: ['#6c9bf9'],
            //     grid: {
            //         left: '0%',
            //         right: '0%',
            //         top: '8%',
            //         bottom: '10%',
            //         containLabel: true
            //     },
            //     xAxis: {
            //         type: 'category',
            //         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            //         axisLine: {
            //             show: false
            //         },
            //         axisTick: {
            //             show: false
            //         }
            //     },
            //     yAxis: {
            //         type: 'value',
            //         splitLine: {
            //             show: true,
            //             lineStyle: {
            //                 color: '#f6f6f6'
            //             }
            //         },
            //         axisLine: {
            //             show: false,
            //         },
            //         axisTick: {
            //             show: false
            //         }
            //     },
            //     series: [
            //         {
            //         symbolSize: 8,
            //         name: 'name1',
            //         data: [30000, 932, 901, 934, 1290, 1330, 120000],
            //         type: 'line',
            //         smooth: true
            //         }
            //     ]
            // },
            // echart1: null,
            // echartModel2: {
            //     color: ['#fd84b6', '#5b8ff9', '#2ebfbe', '#6d88b6', '#f6bd16', '#6dc8ec'],
            //     tooltip: {
            //         trigger: 'item',
            //         backgroundColor: '#fff',
            //         textStyle: {
            //             color: 'rgba(0,0,0,0.65)'
            //         },
            //         borderWidth: 1,
            //         // borderColor: 'rgba(0,0,0,0.65)'
            //         borderColor: '#ccc'
            //     },
            //     legend: {
            //         top: '25%',
            //         // left: 'right',
            //         right: '5%',
            //         orient: 'vertical',
            //         align: 'left',
            //         itemWidth: 13,
            //         itemHeight: 13,
            //         // itemStyle: {
            //         //     color: ''
            //         // }
            //     },
            //     series: [
            //         {
            //         name: 'Access From',
            //         type: 'pie',
            //         center: ['40%', '50%'],
            //         radius: ['40%', '70%'],
            //         avoidLabelOverlap: false,
            //         label: {
            //             show: true,
            //             position: 'outside',
            //             formatter: (params) => {
            //                 return params.value
            //             }
            //         },
            //         labelLine: {
            //             show: false,
            //             length: 4,
            //             length2: 0,  
            //         },
            //         hoverAnimation: false,
            //         emphasis: {
            //             focus: 'none',
            //             scale: false,
            //             scaleSize: 0,
            //             // label: {
            //             // show: true,
            //             // fontSize: '40',
            //             // fontWeight: 'bold'
            //             // }
            //         },
            //         data: [
            //             { value: 1048, name: '汪汪汪' },
            //             { value: 735, name: '汪汪汪1' },
            //             { value: 580, name: '汪汪汪2' },
            //             { value: 484, name: '汪汪汪3' },
            //             { value: 300, name: '汪汪汪4' }
            //         ]
            //         }
            //     ]
            // },
            // echart2: null,
            // radio2: {
            //     name: '选项',
            //     arr: [
            //         { label: '趋势', value: 1 },
            //         { label: '明细', value: 2 },
            //     ],
            //     model: 1
            // },
            // people: [],
            // peopleArr: ['1234'],
            // echart3: null,
            // table: {
            //     loading: false,
            //     pagination: {
            //         total: 0,
            //         page: 1,
            //         pageSize: 12
            //     },
            //     data: [],
            //     needPaging: true
            // },
            
        }
    },
    methods: {
        handleChange() {
            
        },
    }
}
</script>

<style lang='scss' scoped>
.Comp10{
    flex: 1;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    .select{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .right{
            display: flex;
            align-items: center;
        }
    }
    .header{
        // flex: 45;
        height: calc(45% - 16px);
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        .left{
            width: 30%;
            display: flex;
            flex-direction: column;
            .item{
                flex: 1;
                display: flex;
                flex-direction: column;
                .panel{
                    flex: 1;
                    display: flex;
                    .col{
                        flex: 1;
                        .row{
                            font-size: 12px;
                            line-height: 32px;
                        }
                    }
                }
            }
        }
        .right{
            flex: 1;
        }
    }
    .footer{
        margin-top: 10px;
        // flex: 55;
        height: calc(55% - 16px);
        display: flex;
        .left{
            flex: 3;
            display: flex;
            flex-direction: column;
            .chart2{
                flex: 1;
            }
        }
        .right{
            flex: 7;
            align-items: center;
            display: flex;
            flex-direction: column;
            .select{
                width: 100%;
                display: flex;
                justify-content: space-between;
            }
            .chart{
                flex: 1;
            }
        }
    }
}
</style>