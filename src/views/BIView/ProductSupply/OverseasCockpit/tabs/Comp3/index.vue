<!--
 * @Author: 黄浩
 * @Date: 2022-01-06 16:54:48
 * @LastEditTime: 2022-02-28 18:18:47
 * @LastEditors: Please set LastEditors
 * @Descripttion: 访客分析
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp3\index.vue
-->
<template>
    <div class="Comp3">
        <div class="titleBox" style="display: flex;align-items: center;">
            <Title :label="'访客分析'" :ps="'备注：因平台数据存在滞后，数据截止至前天'"/>
            <div style="flex: 1"></div>
            <Radio v-bind.sync="titleBox.radio"/>
            <a-month-picker v-if="titleBox.radio.model === '当月'" class="ml10" style="width: 150px" v-model="titleBox.month" :allowClear="false" valueFormat="YYYYMM"/>
            <YearPicker v-if="titleBox.radio.model === '月度'" class="ml10" :year.sync="titleBox.year"/>
        </div>
        <div style="width: calc(100% + 40px);height: 1px;background: #ccc;margin: 9.5px 0;transform: translateX(-20px)"></div>
<!--        <div class="select">-->
<!--            <div></div>-->
<!--&lt;!&ndash;            <div style="color: #888e99;line-height: 32px;font-size: 12px">备注：因平台数据存在滞后，数据截止至前天</div>&ndash;&gt;-->
<!--            <DatepickerV2 v-bind="dateV2"-->
<!--            :dayOrMonth.sync="dateV2.dayOrMonth"-->
<!--            :day2.sync="dateV2.day2"-->
<!--            :month1.sync="dateV2.month1"-->
<!--            :month2.sync="dateV2.month2"-->
<!--            />-->
<!--        </div>-->
        <Panels @clickPanel="clickPanel" :dateV2="dateV2"/>
        <!-- 按天 -->
        <div v-if="dateV2.dayOrMonth === 1" class="dayTab">
<!--            <div class="header">-->
<!--                <div class="left">-->
<!--                    &lt;!&ndash; echart &ndash;&gt;-->
<!--                    <div class="col1">-->
<!--                        <div class="row1">访客量</div>-->
<!--                        &lt;!&ndash; <div id="row2" class="row2"></div> &ndash;&gt;-->
<!--                        <v-chart class="row2" style="width: 102px;flex: 1" :options="chart1" autoresize></v-chart>-->
<!--                    </div>-->
<!--                    <Panel v-bind="panel1"/>-->
<!--                </div>-->
<!--                <Border style="margin: 0 60px"/>-->
<!--                <div class="middle">-->
<!--                    <div class="col1">-->
<!--                        <div class="row1">销量</div>-->
<!--                        &lt;!&ndash; <div id="row3" class="row2"></div> &ndash;&gt;-->
<!--                        <v-chart class="row2" style="width: 102px;flex: 1" :options="chart2" autoresize></v-chart>-->
<!--                    </div>-->
<!--                    <Panel v-bind="panel2"/>-->
<!--                </div>-->
<!--                <Border style="margin: 0 60px"/>-->
<!--                <div class="right">-->
<!--                    <div class="col1">-->
<!--                        <div class="row1" style="padding-left: 0;text-align: left">销售转化率</div>-->
<!--                        <div @contextmenu.prevent="openMenu($event)" :class="['row2', panel3Color]" style="text-align: left;width: auto;cursor: text">{{panel3Value}}</div>-->
<!--                    </div>-->
<!--                    <Panel class="panel" v-bind="panel3"/>-->
<!--                    <CopyBoard ref="CopyBoard"/>-->
<!--                </div>-->
<!--            </div>-->
            <!-- <v-tabs :value.sync="currentTab" :tabs="TabArr" class="tabs"/> -->
<!--            <div style="display: flex;justify-content: space-between">-->
<!--                <div style="line-height: 24px">访客量趋势</div>-->
<!--                <a-radio-group v-model="currentTab" size="small">-->
<!--                    <a-radio-button :value="item" v-for="(item,index) in TabArr" :key="index">-->
<!--                    {{item}}-->
<!--                    </a-radio-button>-->
<!--                </a-radio-group>-->
<!--            </div>-->
            <ContentDay :currentTab="currentTab" :TabArr="TabArr" :dateV2="dateV2"/>
        </div>
        <!-- 按月 -->
        <div v-else class="momentTab">
            <!-- <div>访客月概览</div> -->
            <ContentMonth :dateV2="dateV2" :currentTab="currentTab" style="height: calc(100%)"/>
            <!-- style="flex: 1" -->
        </div>
    </div>
</template>

<script>
import base from '../../utils/base.js'
import CopyBoard from "../../components/CopyBoard";
import Title from '../../components/Title'
// import DatepickerV2 from '../../components/DatepickerV2.vue'
import moment from 'moment'
import Border from '../../components/Border.vue'
import * as echarts from 'echarts5'
import _ from 'lodash'
import Panel from './components/Panel.vue'
// import VTabs from '@/views/BIView/components/VTabs/VTabs'
import ContentDay from './components/ContentDay.vue'
import ContentMonth from './components/ContentMonth.vue'
import graphic from 'echarts/lib/util/graphic'
import YearPicker from "@/views/BIView/ProductSupply/OverseasCockpit/components/YearPicker";
import Radio from "@/views/BIView/ProductSupply/OverseasCockpit/components/Radio";
import Panels from './components/Panels'
export default {
    mixins: [ base ],
    components: {
        // DatepickerV2,
        // Border,
        // Panel,
        // VTabs,
        ContentDay,
        ContentMonth,
        Title,
        // CopyBoard,
        YearPicker,
        Radio,
        Panels,
    },
    watch: {
        'titleBox.radio.model': {
            handler(val){
                if(val === '当月') this.dateV2.dayOrMonth = 1
                else if(val === '月度') this.dateV2.dayOrMonth = 2
            }
        },
        'titleBox.month': {
            handler(val){
                this.dateV2.day2 = val
            }
        },
        'titleBox.year': {
            handler(val){
                this.dateV2.month2 = val
            }
        },
        // 'dateV2.day2': {
        //     handler() {
        //         this.getOvData()
        //     }
        // },
        'dateV2.dayOrMonth': {
            handler() {
                this.currentTab = '访客转化率'
            }
        }
    },
    created() {
        this.chart1 = _.cloneDeep(this.echartModel1)
        this.chart2 = _.cloneDeep(this.echartModel1)
        // this.getOvData()
    },
    beforeDestroy() {
        if(this.chart1 !== null) this.chart1 = null
        if(this.chart2 !== null) this.chart2 = null
    },
    data() {
        return {
            titleBox: {
                radio: {
                    name: '',
                    arr: [
                        { label: '当月', value: '当月' },
                        { label: '月度', value: '月度' },
                    ],
                    model: '月度'
                },
                month: moment().format('YYYYMM'),
                year: moment().format('YYYY')
            },
            dateV2: {
                dayOrMonth: 2,
                day2: moment(new Date()).format('YYYYMM'),
                // month1: moment(new Date()).format('YYYY') + '01',
                month2: moment(new Date()).format('YYYY'),
                monthType: 3
            },
            // model: {
            //     series: [
            //         {
            //         type: 'gauge',
            //         center: ['50%','55%'],
            //         radius: '95%',
            //         startAngle: 180,
            //         endAngle: 0,
            //         min: 0,
            //         max: 240,
            //         splitNumber: 12,
            //         // 指针颜色
            //         itemStyle: {
            //             color: '#d6644d',
            //         },
            //         progress: {
            //             show: true,
            //             roundCap: true,
            //             width: 7,
            //             itemStyle: {
            //                 // 进度条颜色
            //                 color: {
            //                     type: 'linear',
            //                     x: 0,
            //                     y: 0,
            //                     x2: 0,
            //                     y2: 1,
            //                     colorStops: [{
            //                         offset: 0, color: '#1373fb' // 0% 处的颜色
            //                     }, {
            //                         offset: 1, color: '#75a5ec' // 100% 处的颜色
            //                     }],
            //                     global: false // 缺省为 false
            //                 }
            //             }
            //         },
            //         // 指针样式
            //         pointer: {
            //             icon: 'triangle',
            //             length: '70%',
            //             width: 5,
            //             offsetCenter: [0, '5%']
            //         },
            //         axisLine: {
            //             roundCap: true,
            //             lineStyle: {
            //                 width: 7,
            //                 color: [[1, '#dcdddd']]
            //             }
            //         },
            //         axisTick: {
            //             show: false,
            //         },
            //         splitLine: {
            //             show: false,
            //         },
            //         axisLabel: {
            //             show: false,
            //         },
            //         title: {
            //             show: false
            //         },
            //         detail: {
            //             show: true,
            //             fontSize: 16,
            //             offsetCenter: ['-5%', '50%'],
            //         },
            //         data: [
            //             {
            //             value: 100
            //             }
            //         ]
            //         }
            //     ]
            // },
            // row2: null,
            // echartModel1: {
            //     // color: ['#fd84b6', '#5b8ff9', '#2ebfbe', '#6d88b6', '#f6bd16', '#6dc8ec'],
            //     tooltip: {
            //         trigger: 'none',
            //         // backgroundColor: '#fff',
            //         // textStyle: {
            //         //     color: 'rgba(0,0,0,0.65)'
            //         // },
            //         // borderWidth: 1,
            //         // // borderColor: 'rgba(0,0,0,0.65)'
            //         // borderColor: '#ccc'
            //     },
            //     legend: {
            //         show: false,
            //         // top: '25%',
            //         // // left: 'right',
            //         // right: '5%',
            //         // orient: 'vertical',
            //         // align: 'left',
            //         // itemWidth: 13,
            //         // itemHeight: 13,
            //         // itemStyle: {
            //         //     color: ''
            //         // }
            //     },
            //     series: [
            //         {
            //         z: 2,
            //         color: ['blue','#dcdddd'],
            //         name: 'Access From',
            //         type: 'pie',
            //         center: ['40%', '45%'],
            //         radius: ['40%', '70%'],
            //         avoidLabelOverlap: false,
            //         label: {
            //             show: true,
            //             position: 'center',
            //             formatter: (params) => {
            //                 // return params.value
            //                 return '134'
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
            //             { value: 20, name: '汪汪汪2' },
            //             { value: 80, name: '1234'}
            //             // { value: 580, name: '汪汪汪' },
            //             // { value: 484, name: '汪汪汪' },
            //             // { value: 300, name: '汪汪汪' }
            //         ]
            //         },
            //         {
            //         z: 1,
            //         color: ['#dcdddd'],
            //         name: 'Access From',
            //         type: 'pie',
            //         center: ['40%', '45%'],
            //         radius: ['40%', '70%'],
            //         avoidLabelOverlap: false,
            //         label: {
            //             show: true,
            //             position: 'center',
            //             formatter: (params) => {
            //                 // return params.value
            //                 return '134'
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
            //             { value: 100, name: '汪汪汪3' },
            //             // { value: 80, name: '汪汪汪1' },
            //             // { value: 580, name: '汪汪汪' },
            //             // { value: 484, name: '汪汪汪' },
            //             // { value: 300, name: '汪汪汪' }
            //         ]
            //         },
            //     ]
            // },
            echartModel1: {
                grid: {
                    left: 'center',
                    top: 'center'
                },
                title: {
                    text: '',
                    subtext: '达成',
                    textStyle: {
                        color: 'grey',
                        fontSize: 14
                    },
                    itemGap: 4,
                    left: 'center',
                    top: 'center'
                },
                angleAxis: {
                    max: 100,
                    clockwise: true,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                radiusAxis: {
                type: 'category',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false
                }
                },
                polar: {
                center: ['50%', '50%'],
                radius: 70 //图形大小
                },
                series: [
                    {
                        type: 'bar',
                        data: [
                            {
                                value: 0,
                                itemStyle: {
                                    normal: {
                                    color: new graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#1ac5fc'
                                    }, {
                                        offset: 1,
                                        color: '#2680eb'
                                    }])
                                    }
                                },
                            }
                        ],
                        coordinateSystem: 'polar',
                        roundCap: true,
                        barWidth: 6,
                        barGap: '-100%', // 两环重叠
                        z: 2,
                    },
                    { // 灰色环
                        type: 'bar',
                        silent: true,
                        data: [{
                        value: 100,
                        itemStyle: {
                            color: '#dcdddd',
                            shadowColor: 'rgba(0, 0, 0, 0.2)',
                            shadowBlur: 2,
                            shadowOffsetY: 1
                        }
                        }],
                        coordinateSystem: 'polar',
                        roundCap: true,
                        barWidth: 6,
                        barGap: '-100%',
                        z: 1
                    }
                ]
            },
            chart1: null,
            chart2: null,
            panel1: {
                l1: '访客量',
                v1: '',
                l2: '目标',
                v2: '',
                l3: '本月差值',
                v3: '',
                l4: '上期访客量',
                v4: '',
                l5: '环比',
                v5: '',
                l6: '上期差值',
                v6: '',
            },
            panel2: {
                l1: '销量',
                v1: '',
                l2: '目标',
                v2: '',
                l3: '本月差值',
                v3: '',
                l4: '上期销量',
                v4: '',
                l5: '环比',
                v5: '',
                l6: '上期差值',
                v6: '',
            },
            panel3: {
                l1: '目标',
                v1: '',
                l2: '本月差值',
                v2: '',
                l3: '占位占位',
                v3: '',
                l4: '上期销售转化率',
                v4: '',
                l5: '环比',
                v5: '',
                l6: '上期差值',
                v6: '',
            },
            panel3Value: '',
            panel3Color: '',
            // TabArr: ['访客量','销量','销售转化率','人员销售转化率'],
            TabArr: ['访客转化率', '访客量','销量'],
            currentTab: '访客转化率',
        }
    },
    methods: {
        clickPanel(val){
            this.currentTab = val
        },
        async getOvData() {
            // 清除
            this.chart1.title.textStyle.color = 'grey'
            this.chart1.series[0].data[0].value = '--'
            this.chart1.title.text = '--'
            this.chart2.title.textStyle.color = 'grey'
            this.chart2.series[0].data[0].value = '--'
            this.chart2.title.text = '--'
            this.panel3Value = '--'
            this.panel3Color = ''
            let query = {
                MDATE: this.dateV2.day2
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_visitor_anal_ov',query)
            let {data} = {...res}
            if(data.length === 0) {
                let arr = ['panel1', 'panel2', 'panel3']
                arr.forEach(item => {
                    for(let i = 0; i < 6; i++) {
                        this[item]['v' + (i + 1)] = item === 'panel3' && i === 2 ? '' : '--'
                    }
                })
                return
            }
            let arr = {
                panel1: [
                    // 访客量
                    'PTD_VISITOR_CNT',
                    // 目标
                    'PTD_VISITOR_TGT',
                    // 本月差值
                    'PTD_VISITOR_DIFF',
                    // 上期访客量
                    'LAST_VISITOR_CNT',
                    // 环比
                    'LAST_VISITOR_RATE',
                    // 上期差值
                    'LAST_VISITOR_DIFF'
                ],
                panel2: [
                    // 销量
                    'PTD_SALES_AMT',
                    // 目标
                    'PTD_SALES_TGT',
                    // 本月差值
                    'PTD_SALES_DIFF',
                    // 上期销量
                    'LAST_SALES_AMT',
                    // 环比
                    'LAST_SALES_RATE',
                    // 上期差值
                    'LAST_SALES_DIFF'
                ],
                panel3: [
                    // 目标
                    'PTD_PAY_RATE_TGT',
                    // 本月差值
                    'PTD_PAY_RATE_DIFF',
                    // 占位用
                    'LAST_PAY_RATE_DIFF',
                    // 上期销售转化率
                    'LAST_PAY_RATE',
                    // 环比
                    'LAST_PAY_RATE_TOT',
                    // 上期差值
                    'LAST_PAY_RATE_DIFF'
                ]
            }
            for(let key in arr) {
                if(key !== 'panel3') {
                    arr[key].forEach((item,index) => {
                        if(index === 4) {
                            this[key]['v' + (index + 1)] = (data[0][item] * 100).toFixed(2) + '%'
                        }else if(index === 0 || index === 1 || index === 3 ) this[key]['v' + (index + 1)] = data[0][item] === undefined || data[0][item] === 0 ? '--' : parseInt(data[0][item]).toLocaleString()
                        else this[key]['v' + (index + 1)] = data[0][item] === undefined ? '--' : parseInt(data[0][item]).toLocaleString()
                    })
                }else if(key === 'panel3') {
                    arr[key].forEach((item,index) => {
                        if(index === 0 || index === 3) {
                            this[key]['v' + (index + 1)] = data[0][item] === 0 ? '--' : (data[0][item] * 100).toFixed(2) + '%'
                        }else if(index !== 2) {
                            this[key]['v' + (index + 1)] = (data[0][item] * 100).toFixed(2) + '%'
                        }
                    })
                }
            }
            this.chart1.series[0].data[0].value = data[0].PTD_VISITOR_RATE * 100
            this.chart1.title.text = (data[0].PTD_VISITOR_RATE * 100).toFixed(2) + '%'
            if(data[0].PTD_VISITOR_RATE >= 1) this.chart1.title.textStyle.color = '#ff5953'
            else this.chart1.title.textStyle.color = '#00a854'
            this.chart2.series[0].data[0].value = data[0].PTD_SALES_RATE * 100
            this.chart2.title.text = (data[0].PTD_SALES_RATE * 100).toFixed(2) + '%'
            if(data[0].PTD_SALES_RATE >= 1) this.chart2.title.textStyle.color = '#ff5953'
            else this.chart2.title.textStyle.color = '#00a854'
            this.panel3Value = (data[0].PTD_PAY_RATE * 100).toFixed(2) + '%'
            if(data[0].PTD_PAY_RATE === 0 || data[0].PTD_PAY_RATE === null) this.panel3Color = ''
            else {
                if(data[0].PTD_PAY_RATE_DIFF <= 0) this.panel3Color = 'red'
                else this.panel3Color = 'green'
            }
            console.log(this.chart1.series[0].data[0]);
        },
    }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/styles/common.scss';
@import '../../assets/styles.scss';
/deep/ .ant-radio-button-wrapper-checked{
    color: #fff;
    background: #46BCA0
}
.Comp3{
    //display: flex;
    flex: 1;
    //flex-direction: column;
    padding: 10px 20px;
    .select{
        display: flex;
        justify-content: space-between;
    }
    .dayTab{
        // flex: 1;
        position: relative;
        margin-top: 10px;
        height: calc(100% - 183px);
        // display: flex;
        // flex-direction: column;
        .header{
            height: 100px;
            // overflow: hidden;
            display: flex;
            justify-content: space-between;
            padding: 0 60px 0 0;
            .left, .middle, .right{
                width: 33%;
                display: flex;
                .col1{
                    margin-right: 40px;
                    display: flex;
                    flex-direction: column;
                    .row1{
                        line-height: 18px;
                        font-size: 12px;
                        //padding-left: 10px;
                    }
                    .row2{
                        flex: 1;
                        width: 102px;
                    }
                    .red{
                        color: $red
                    }
                    .green{
                        color: $green
                    }
                }
                .col2{
                    flex: 1;
                    margin-top: 18px;
                    line-height: 20px;
                    font-size: 12px;
                    .line1{
                        display: flex;
                        .block{
                            width: 30%;
                        }
                        .block:nth-child(1) {
                            width: 40%;
                        }
                    }
                }
            }
            
            .right{
                width: 33%;
                .row1{
                    padding-left: 0;
                    text-align: center;
                }
                .row2{
                    text-align: center;
                    margin-top: 20px;
                    font-size: 18px;
                    font-weight: bold;
                }
                .panel /deep/ .line1:nth-child(1) .block:nth-last-child(1) {
                    opacity: 0;
                }
            }
        }
        .tabs {
            height: 32px;
            /deep/ .active{
                color: $theme !important;
                &:before{
                    background: $theme !important;
                }
            }
        }
    }
    .momentTab{
        margin-top: 10px;
        height: calc(100% - 183px);
        //display: flex;
        //flex-direction: column;
    }
}
</style>