<!--
 * @Author: 黄浩
 * @Date: 2022-01-10 11:44:36
 * @LastEditTime: 2022-02-18 10:57:50
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp12\index.vue
-->
<template>
    <div class="Comp12">
        <!-- <a-month-picker v-model="date" format="年月(YYYY-MM)" valueFormat="YYYYMM" :allowClear="false" suffixIcon=" " style="width: 150px;position: absolute;right: 20px"/> -->
        <DatepickerV3 v-bind="dateV2" 
        style="position: absolute;right: 20px;z-index: 2"
        :dayOrMonth.sync="dateV2.dayOrMonth"
        :day2.sync="dateV2.day2"
        :month1.sync="dateV2.month1"
        :month2.sync="dateV2.month2"
        />
        <div class="left" style="margin-right: 60px">
            <div style="line-height: 32px">海外视角</div>
            <div class="panel" style="position: relative">
                <div class="c1">
                    <div>月累计定价毛利率</div>
                    <div class="line">
                        <div class="b1" @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(panel.v1)}]">{{(panel.v1 === 0 || panel.v1 === null) ? '--' : handleNum(2, panel.v1)}}</div>
                        <div class="b2">
                            <div class="l">
                                <div>目标</div>
                                <div @contextmenu.prevent="openMenu($event)" >{{handleNum(2, panel.v2)}}</div>
                            </div>
                            <div class="l">
                                <div>差值</div>
                                <div @contextmenu.prevent="openMenu($event)" >{{handleNum(2, panel.v3)}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="c2">
                    <div>月累计定价毛利额</div>
                    <div @contextmenu.prevent="openMenu($event)" >{{handleNum(1, panel.v4)}}</div>
                </div>
                <CopyBoard ref="CopyBoard"/>
            </div>
            <div style="width: 100%;padding: 10px 40px">
                <div style="height: 1px;width: 100%;background: #f3f3f3"></div>
            </div>
            <div class="chart">
                <div>海外定价毛利率月趋势</div>
                <v-chart ref="echart1" style="flex: 1" :options="echart1" autoresize></v-chart>
            </div>
        </div>
        <div class="right">
            <div style="line-height: 32px;">人员视角</div>
            <virtual-select style="width: 150px;margin-right: 0;position: absolute; right: 0px;top: 45px"
                v-model="people"
                :options="peopleArr.map((_) => ({ label: _ }))"
                label="人员"
            ></virtual-select>
            <y-table
            style="width: 100%;flex: 1;margin-top: 100px"
            class="text-black"
            @change="handleChange"
            :options="{ ...table, columns: tableColumns, rowClassName: (record,index) => index === 0 ? 'blod grey' : index % 2 === 0 ? 'grey' : ''}"
            rowKey="STAFF_NAME"
            :loading="table.loading"
            ></y-table>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import YTable from '@/views/BIView/components/YTable/YTable2'
import DatepickerV3 from '../../components/DatepickerV3'
import base from '../../utils/base.js'
import CopyBoard from '../../components/CopyBoard.vue'
export default {
    mixins: [ base ],
    components: {
        VirtualSelect,
        YTable,
        DatepickerV3,
        CopyBoard,
    },
    computed: {
        tableColumns() {
            return [
                { title: '人员', dataIndex: 'STAFF_NAME', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '定价毛利率目标', dataIndex: 'GRS_PRFT_TG_MON', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(2, text)}</div>
                    }
                },
                { title: '定价毛利率', dataIndex: 'GRS_PRFT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(2, text)}</div>
                    }
                },
                { title: '定价毛利额', dataIndex: 'GRS_AMT', width: 100, ellipsis: true, sorter: false,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{this.handleNum(1, text)}</div>
                    }
                },
            ]
        },
        month() {
            return this.dateV2.month1 + this.dateV2.month2
        },
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel1)
        this.getDataOneMonth()
        this.getData()
        this.getPeople()
    },
    watch: {
        'dateV2.day2': {
            handler() {
                this.getDataOneMonth()
                this.getPeople()
            }
        },
        people: {
            handler() {
                this.handleData(3, this.tableData)
            }
        },
        month: {
            handler() {
                this.getData()
            }
        },
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
    },
    data() {
        let that = this
        return {
            panel: {
                v1: '--',
                v2: '--',
                v3: '--',
                v4: '--'
            },
            echartModel1: {
                // legend: {
                //     top: '25%',
                //     right: '0%',
                //     orient: 'vertical',
                //     align: 'left',
                //     itemWidth: 13,
                //     itemHeight: 13,
                //     data: ['name1','name2'],
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: function(params) {
                        let str = `统计年月：${params[0].data[0]}<br/>定价毛利率：${that.handleNum(2, params[0].data[1])}`
                        return str
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)'
                    },
                    borderWidth: 1,
                    borderColor: '#ccc'
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
                        formatter: (value) => {
                            return that.handleNum(2, value)
                        }
                    }
                },
                series: [
                    {
                    symbolSize: 8,
                    name: 'name1',
                    data: [],
                    type: 'line',
                    smooth: true
                    }
                ]
            },
            echart1: null,
            people: [],
            peopleArr: [],
            table: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 8
                },
                data: [
                    { STAFF_NAME: '合计', GRS_PRFT_TG_MON: '--', GRS_PRFT: '--', GRS_AMT: '--'}
                ],
                needPaging: true
            },
            dateV2: {
                options: ['核心指标', '趋势明细'],
                dayOrMonth: 1,
                day2: moment(new Date()).format('YYYYMM'),
                monthType: 2,
                month1: moment(new Date()).subtract(1, 'y').format('YYYYMM'),
                month2: moment(new Date()).format('YYYYMM'),
            },
            tableData: []
        }
    },
    methods: {
        computeColor(value) {
            if(value === 0 || value === null || value === '--') return
            if(this.panel.v3 <= 0) return '#ff5953'
            else return '#00a854'
        },
        handleChange() {
            
        },
        // 左上角数据
        async getDataOneMonth() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + moment(this.dateV2.day2).daysInMonth(),
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_stand_profit', query)
            this.handleData(1, res.data)
        },
        // 左边月趋势图
        async getData() {
            let query = {
                START_TIME: this.dateV2.month1 + '01',
                END_TIME: this.dateV2.month2 + moment(this.dateV2.month2).daysInMonth(),
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_stand_profit', query)
            res.data.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
            console.log(res.data);
            this.handleData(2, res.data)
        },
        async getPeople() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + moment(this.dateV2.day2).daysInMonth(),
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_stand_profit_stf', query)
            res.data.sort((a, b) => moment(a.MDATE).format('x') - moment(b.MDATE).format('x'))
            this.peopleArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.STAFF_NAME))))
            this.tableData = res.data.concat()
            this.handleData(3, res.data)
        },
        // 1 左上角 2echart 3table
        handleData(type, source) {
            if(type === 1) {
                for(let key in this.panel) this.panel[key] = '--'
                if(!source.length) return
                let keys = ['GRS_PRFT', 'GRS_PRFT_TG_MON', 'DIFF', 'GRS_AMT']
                keys.forEach((key, index) => {
                    this.panel['v' + (index + 1)] = source[0][key]
                })
            }else if(type === 2) {
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel1)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                if(!source.length) return
                // 轴
                this.echart1.xAxis.data = Object.freeze(Array.from(new Set(source.map(_ => moment(_.MDATE).format('YYYY-MM')))))
                // line
                this.echart1.series[0].data = this.echart1.xAxis.data.map(month => {
                    return source.filter(_ => month.indexOf(moment(_.MDATE).format('YYYY-MM')) > -1)[0]
                }).map(item => {
                    return [
                        moment(item.MDATE).format('YYYY-MM'),
                        item.GRS_PRFT
                    ]
                })
                console.log(this.echart1.series[0].data);
            }else if(type === 3) {
                this.table.data = this.table.data.filter(_ => _.STAFF_NAME === '合计')
                this.table.pagination.page = 1
                this.table.pagination.total = 0
                if(!source.length) return
                // 获取合计
                let query = {
                    START_TIME: this.dateV2.day2 + '01',
                    END_TIME: this.dateV2.day2 + moment(this.dateV2.day2).daysInMonth(),
                }
                this.people.length ? query.STAFF_NAME = this.people.toString() : ''
                this.$fetchSql('oversea_cockpit', 'oversea_stand_profit_stf_s', query).then(res => {
                    if(res.data.length) {
                        this.table.data[0].GRS_PRFT_TG_MON = res.data[0].GRS_PRFT_TG_MON
                        this.table.data[0].GRS_PRFT = res.data[0].GRS_PRFT
                        this.table.data[0].GRS_AMT = res.data[0].GRS_AMT
                    }
                })
                let people = !this.people.length ? this.peopleArr : this.people
                this.table.data = this.table.data.concat(source.filter(_ => people.indexOf(_.STAFF_NAME) > -1).map(item => {
                    return {
                        STAFF_NAME: item.STAFF_NAME,
                        GRS_PRFT_TG_MON: item.GRS_PRFT_TG_MON,
                        GRS_PRFT: item.GRS_PRFT,
                        GRS_AMT: item.GRS_AMT
                    }
                }))
                this.table.pagination.total = source.length + 1
                console.log(this.table.data);
            }
        }
    }
}
</script>

<style lang='scss' scoped>
@import '../../assets/styles.scss';
.Comp12{
    flex: 1;
    padding: 10px 20px;
    position: relative;
    display: flex;
    .left{
        flex: 55;
        display: flex;
        flex-direction: column;
        .panel{
            display: flex;
            .c1{
                flex: 2;
                .line{
                    display: flex;
                    .b1{
                        flex: 2;
                        font-size: 20px;
                        line-height: 150px;
                        font-weight: bold;
                    }
                    .b2{
                        flex: 3;
                        display: flex;
                        flex-direction: column;
                        .l{
                            flex: 1;
                            display: flex;
                            div{
                                flex: 1;
                                font-size: 12px;
                                line-height: 75px;
                            }
                        }   
                    }
                }
            }
            .c2{
                flex: 3;
                div:nth-child(2) {
                    font-size: 20px;
                    line-height: 150px;
                    font-weight: bold;
                }
            }
        }
        .chart{
            // flex: 1;
            height: calc(100% - 192px);
            display: flex;
            flex-direction: column;
        }
    }
    .right{
        flex: 45;
        position: relative;
        display: flex;
        flex-direction: column;
        /deep/ td{
            height: 45px;
            line-height: 45px;
        }
    }
}
</style>