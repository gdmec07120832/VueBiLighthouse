<!--
 * @Author: 黄浩
 * @Date: 2022-01-07 17:12:22
 * @LastEditTime: 2022-02-16 14:52:15
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OverseasCockpit\tabs\Comp6\components\type1.vue
-->
<template>
    <div class="Type1">
        <div class="header">
            <div class="left">
                <div class="r1">当月采购成本</div>
                <!-- <div class="r2">{{handleNum(4, panel.v1) + (panel.v1 !== '--' ? '万': '')}}</div> -->
                <div class="r2" @contextmenu.prevent="openMenu($event)">{{computeNum(0, panel.v1)}}</div>
                <div class="r3">
                    <div class="item">
                        <div class="c1">上月采购成本</div>
                        <div class="c2" @contextmenu.prevent="openMenu($event)">{{handleNum(4, panel.v2) + (panel.v2 !== '--' ? '万': '')}}</div>
                    </div>
                    <div class="item">
                        <div class="c1">与上月差值</div>
                        <div class="c2" @contextmenu.prevent="openMenu($event)">{{handleNum(1, panel.v3)}}</div>
                    </div>
                    <div class="item">
                        <div class="c1">环比</div>
                        <div class="c2" @contextmenu.prevent="openMenu($event)" :style="[{color: computeColor(0, panel.v4)}]">{{handleNum(2, panel.v4)}}</div>
                    </div>
                </div>
            </div>
            <CopyBoard ref="CopyBoard"/>
            <Border style="padding: 40px 0"/>
            <div class="right">
                <div>采购环比趋势</div>
                <div style="margin-top: 20px;color: rgb(136, 142, 153)">备注：当月采购成本=上月发货量*当月平均采购价；上月采购成本=上月发货量*上月平均采购价。</div>
                <v-chart ref="echart1" class="chart" style="flex: 1" :options="echart1" autoresize></v-chart>
            </div>
        </div>
        <div class="bottom">
            <virtual-select style="width: 200px;position: absolute;right: -20px;top: 10px"
                v-model="people"
                :options="peopleArr.map((_) => ({ label: _ }))"
                label="人员"
            ></virtual-select>
            <div style="line-height: 32px;margin-top: 10px">人员采购月情况</div>
            <v-chart ref="echart2" class="chart" style="flex: 1" :options="echart2" autoresize></v-chart>
        </div>
    </div>
</template>

<script>
import Border from '../../../components/Border'
import _ from 'lodash'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import base from '../../../utils/base.js'
import moment from 'moment'
import { arrayMove } from 'vue-slicksort'
import CopyBoard from '../../../components/CopyBoard.vue'
export default {
    mixins: [ base ],
    props: {
        dateV2: {
            type: Object,
        },
    },
    components: {
        Border,
        VirtualSelect,
        CopyBoard,
    },
    created() {
        this.echart1 = _.cloneDeep(this.echartModel1)
        this.echart2 = _.cloneDeep(this.echartModel2)
        this.getCurrent()
        this.getData()
        this.getPeople()
        this.getPeopleArr()
    },
    beforeDestroy() {
        if(this.echart1 !== null) this.echart1 = null
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
                this.getPeople()
                this.getPeopleArr()
            }
        },
        people: {
            handler() {
                this.handleData(2, this.echart2Data)
            }
        }
    },
    computed: {
        month() {
            return this.dateV2.month1 + this.dateV2.month2
        }
    },
    data() {
        let that = this
        return {
            echartModel1: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: function(params) {
                        let str = `统计年月：${params[0].data[0]}<br/>采购成本环比：${that.handleNum(2, params[0].data[1])}`
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
                    name: '采购环比趋势',
                    data: [],
                    type: 'line',
                    smooth: true
                    }
                ]
            },
            echart1: null,
            people: [],
            peopleArr: [],
            echart2: null,
            echartModel2: {
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: function(params) {
                        let str = `统计年月：${params.data[0]}<br/>人员：${params.seriesName}<br/>采购成本环比：${that.handleNum(2, params.data[1])}`
                        return str
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)'
                    },
                    borderWidth: 1,
                    borderColor: '#ccc'
                },
                color: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#D47F00', '#00FFFF', '#D4FF55', '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#7FBF55','#a5c2d5', '#cbab4f', '#76a871', '#a56f8f', '#c12c44', '#9f7961', '#76a871', '#6f83a5', '0f4fb8', '106dcf', '#b3d74c', '#74aae3', '#5cdec6', '#3526de', '#9d65ee', '#a8b3e3', '#6bc1b7', '549ee2', '#6e98d6'],
                legend: {
                    top: '25%',
                    right: '0%',
                    orient: 'vertical',
                    align: 'left',
                    itemWidth: 13,
                    itemHeight: 13,
                    icon: 'rect'
                    // data: [],
                },
                // color: ['#6c9bf9'],
                grid: {
                    left: '0%',
                    right: '3%',
                    top: '15%',
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
                    name: '',
                    data: [],
                    type: 'line',
                    smooth: true
                    }
                ]
            },
            panel: {
                v1: '--',
                v2: '--',
                v3: '--',
                v4: '--',
            },
            echart2Data: []
        }
    },
    methods: {
        openMenu(e) {
            this.$refs.CopyBoard.openMenu(e, e.target.innerText)
        },
        computeNum(p, value) {
            if(p === 0) {
                if(value === 0 || value === null || value === '--') return '--'
                return this.handleNum(4, this.panel.v1) + '万'
            }else if(p === 0) {
                if(value === 0 || value === null || value === '--') return '--'
                return this.handleNum(4, this.panel.v2) + '万'
            }
        },
        computeColor(p, value) {
            if(p === 0) {
                if(value === 0 || value === null || value === '--') return
                if(value > 0) return 'red'
                else if(value < 0) return 'green'
            }  
        },
        async getCurrent() {
            let query = {
                START_TIME: this.dateV2.day2 + '01',
                END_TIME: this.dateV2.day2 + '01',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_purchase_cost', query)
            let {data} = {...res}
            console.log(data);
            if(!data.length) {
                this.panel.v1 = '--'
                this.panel.v2 = '--'
                this.panel.v3 = '--'
                this.panel.v4 = '--'
                return
            }
            this.panel.v1 = data[0].PUR_AMT
            this.panel.v2 = data[0].LAST_PUR_AMT
            this.panel.v3 = data[0].DIFF
            this.panel.v4 = data[0].RATE
        },
        async getPeopleArr() {
            let query = {
                START_TIME: this.dateV2.month1 + '01',
                END_TIME: this.dateV2.month2 + '01',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_purchase_cost_stf', query)
            this.peopleArr = Object.freeze(Array.from(new Set(res.data.map(_ => _.STAFF_NAME))))
        },
        async getData() {
            let query = {
                START_TIME: this.dateV2.month1 + '01',
                END_TIME: this.dateV2.month2 + '01',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_purchase_cost', query)
            res.data.sort((a, b) => moment(a.MDATE).toDate().getTime() - moment(b.MDATE).toDate().getTime())
            this.handleData(1, res.data)
            // this.handleData(3, res.data)
        },
        async getPeople() {
            let query = {
                START_TIME: this.dateV2.month1 + '01',
                END_TIME: this.dateV2.month2 + '01',
            }
            let res =  await this.$fetchSql('oversea_cockpit', 'oversea_purchase_cost_stf', query)
            res.data.sort((a, b) => moment(a.MDATE).toDate().getTime() - moment(b.MDATE).toDate().getTime())
            this.echart2Data = res.data.concat()
            this.handleData(2, res.data)
        },
        // 1chart 2chart
        handleData(type, source) {
            if(type === 1) {
                this.$refs?.echart1?.$refs?.echarts?.clear()
                this.echart1 = _.cloneDeep(this.echartModel1)
                this.echart1.xAxis.data = []
                this.echart1.series[0].data = []
                if(!source.length) return
                let arr = source.concat()
                // x轴
                this.echart1.xAxis.data = arr.map(_ => moment(_.MDATE).format('YYYY-MM'))
                // line
                let keys = ['MDATE', 'RATE']
                this.echart1.series[0].data = arr.map(item => {
                    return keys.map((key, index) => {
                        if(index === 0) return moment(item[key]).format('YYYY-MM')
                        else if(index === 1) return item[key]
                    })
                })
            }else if(type === 2) {
                this.$refs?.echart2?.$refs?.echarts?.clear()
                this.echart2 = _.cloneDeep(this.echartModel2)
                this.echart2.xAxis.data = []
                this.echart2.series = []
                if(!source.length) return
                let arr = source.concat()
                // x轴
                this.echart2.xAxis.data = Object.freeze(Array.from(new Set(arr.map(_ => moment(_.MDATE).format('YYYY-MM')))))
                // line
                let people = !this.people.length ? Array.from(new Set(arr.map(_ => _.STAFF_NAME))) : this.people
                this.echart2.series = people.map(name => {
                    return {
                        symbolSize: 8,
                        name: name,
                        data: arr.filter(_ => name.indexOf(_.STAFF_NAME) > -1).map(item => {
                            return [
                                moment(item.MDATE).format('YYYY-MM'),
                                item.LAST_RATE
                            ]
                        }),
                        type: 'line',
                        smooth: true
                    }
                })
                console.log(this.echart2);
            }
        }
    }
}
</script>

<style lang='scss' scoped>
@import '../../../assets/styles.scss';
.Type1{
    display: flex;
    flex-direction: column;
    .header{
        height: 50%;
        display: flex;
        border-bottom: 1px solid #f2f2f2;
        .left{
            .r1{

            }
            .r2{
                margin: 10px 0;
                line-height: 32px;
                font-size: 18px;
                font-weight: bold;
            }
            .r3{
                .item{
                    display: flex;
                    width: 200px;
                    .c1, .c2{
                        width: 50%;
                        font-size: 12px;
                        line-height: 32px;
                    }
                }
            }
        }
        .right{
            flex: 1;
            margin-left: 20px;
            display: flex;
            flex-direction: column;
        }
    }
    .bottom{
        height: 50%;
        position: relative;
        display: flex;
        flex-direction: column;

    }
}
</style>