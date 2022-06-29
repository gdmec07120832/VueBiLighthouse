<template>
    <div class="CustomerUnitPrice">
        <div class="header">
            <Title class="title" :label="'客单价'"/>
            <span style="margin-right: 0px">（{{ radio }}）</span>
            <span>【融合店客单价与业务共创中，敬请期待】</span>
            <div></div>
            <!-- <a-radio-group v-model="radio">
                <a-radio value="成品店"> 成品店</a-radio>
                <a-radio value="融合店"> 融合店</a-radio>
            </a-radio-group> -->
            <span>
                统计月份
                <a-month-picker class="ml10" :disabledDate="disabledDate" v-model="month" :allowClear="false" valueFormat="YYYYMM"/>
            </span>
        </div>
        <div class="main">
            <div class="overView" v-if="radio === '成品店'">
                <div class="item">
                    <div class="panel">
                        <div>{{ overView1.label }}</div>
                        <div>{{ handleNum('round', overView1.price) }}</div>
                        <div>
                            <span>同期</span>
                            <span>{{ handleNum('round', overView1.value2) }}</span>
                        </div>
                        <div>
                            <span>同比</span>
                            <span :class="[computeColor(null, overView1.value3)]">{{ handleNum('percent', overView1.value3) }}</span>
                        </div>
                    </div>
                    <span class="bartitle">地区对比</span>
                    <v-chart ref="bar1" class="bar" :options="overView1.bar" autoresize></v-chart>
                </div>
                <div class="item">
                    <div class="panel">
                        <div>{{ overView2.label }}</div>
                        <div>{{ handleNum('round', overView2.num) }}</div>
                        <div>
                            <span>同期</span>
                            <span>{{ handleNum('round', overView2.value2) }}</span>
                        </div>
                        <div>
                            <span>同比</span>
                            <span :class="[computeColor(null, overView2.value3)]">{{ handleNum('percent', overView2.value3) }}</span>
                        </div>
                    </div>
                    <span class="bartitle">地区对比</span>
                    <v-chart ref="bar2" class="bar" :options="overView2.bar" autoresize></v-chart>
                </div>
            </div>
            <div class="overView1" v-if="radio === '融合店'">
                <div class="item">
                    <div class="panel">
                        <div class="col1">
                            <div>{{ overView3.label }}</div>
                            <div>{{ overView3.price }}</div>
                            <div>
                                <span>同期</span>
                                <span>{{ overView3.value2 }}</span>
                            </div>
                            <div>
                                <span>同比</span>
                                <span>{{ overView3.value3 }}</span>
                            </div>
                        </div>
                        <div class="col2">
                            <div>成品</div>
                            <div>
                                <span>同期</span>
                                <span>{{ overView3.value4 }}</span>
                            </div>
                            <div>
                                <span>同比</span>
                                <span>{{ overView3.value5 }}</span>
                            </div>
                        </div>
                        <div class="col2">
                            <div>定制</div>
                            <div>
                                <span>同期</span>
                                <span>{{ overView3.value6 }}</span>
                            </div>
                            <div>
                                <span>同比</span>
                                <span>{{ overView3.value7 }}</span>
                            </div>
                        </div>
                    </div>
                    <span class="bartitle">地区对比</span>
                    <v-chart ref="echart" class="bar" :options="overView1.bar" autoresize></v-chart>
                </div>
                <div class="item">
                    <div class="panel">
                        <div class="col1">
                            <div>{{ overView3.label }}</div>
                            <div>{{ overView3.price }}</div>
                            <div>
                                <span>同期</span>
                                <span>{{ overView3.value2 }}</span>
                            </div>
                            <div>
                                <span>同比</span>
                                <span>{{ overView3.value3 }}</span>
                            </div>
                        </div>
                        <div class="col2">
                            <div>成品</div>
                            <div>
                                <span>同期</span>
                                <span>{{ overView3.value4 }}</span>
                            </div>
                            <div>
                                <span>同比</span>
                                <span>{{ overView3.value5 }}</span>
                            </div>
                        </div>
                        <div class="col2">
                            <div>定制</div>
                            <div>
                                <span>同期</span>
                                <span>{{ overView3.value6 }}</span>
                            </div>
                            <div>
                                <span>同比</span>
                                <span>{{ overView3.value7 }}</span>
                            </div>
                        </div>
                    </div>
                    <span class="bartitle">地区对比</span>
                    <v-chart ref="echart" class="bar" :options="overView1.bar" autoresize></v-chart>
                </div>
            </div>
            <div class="selects">
                <span class="mr10">区域选择</span>
                <a-checkbox-group v-model="area">
                    <a-checkbox :value="item" v-for="item in areaOption" :key="item">
                        {{ item }}
                    </a-checkbox>
                </a-checkbox-group>
                <span></span>
            </div>
            <div class="lineBox">
                <div>客单价趋势</div>
                <div>客户数趋势</div>
                <v-chart v-if="radio === '成品店'" ref="line1" class="line" style="overflow: visible;" :options="line1" autoresize></v-chart>
                <div v-if="radio === '成品店'" style="width: 104px"></div>
                <v-chart v-if="radio === '成品店'" ref="line2" class="line" style="overflow: visible;" :options="line2" autoresize></v-chart>
                <v-chart v-if="radio === '融合店'" ref="echart" class="line" style="overflow: visible;" :options="bar1" autoresize></v-chart>
                <div v-if="radio === '融合店'" style="width: 104px"></div>
                <v-chart v-if="radio === '融合店'" ref="echart" class="line" style="overflow: visible;" :options="bar1" autoresize></v-chart>
            </div>
            <div class="tableBox">
                <Table class="table1" v-bind="table"/>
                <Table class="table2" v-bind="table1"/>
            </div>
        </div>
        <Jump style="display: none"/>
    </div>
</template>

<script>
import Title from '../../components/Title'
import moment from 'moment'
import base from '../../utils/base'
import Table from '../../components/Table'
import Jump from '../../components/Jump'
import _ from 'lodash'
export default {
    name: 'CustomerUnitPrice',
    mixins: [base],
    components: {
        Title,
        Table,
        Jump,
    },
    async created() {
        let that = this
        this.overView1.bar = await this.createDoubleBar()
        this.overView1.bar.yAxis[0].axisLabel.interval = 4
        this.overView1.bar.yAxis[0].min = 0
        this.overView1.bar.grid.bottom = 0
        this.overView1.bar.series[0].data = []
        this.overView1.bar.series[1].data = []
        this.overView1.bar.xAxis[0].data = ['东区', '南区', '西区', '北区']
        this.overView1.bar.tooltip.formatter = function (params) {
            if(Object.prototype.toString.call(params) === '[object Array]') {
                let str = `${params[0].axisValue}<br/>`
                params.forEach((item, index) => {
                    str += `${params[index].marker}${params[index].seriesName}：${that.handleNum('round', params[index].data[1])}<br/>`
                })
                return str
            }else if(Object.prototype.toString.call(params) === '[object Object]') {
                let str = `${params.axisValue}<br/>${params.marker}${params.seriesName}：${that.handleNum('round', params.data[1])}<br/>`
                return str
            }
        }
        this.overView2.bar = _.cloneDeep(this.overView1.bar)

        this.line1 = await this.createLine()
        this.line1.yAxis[0].axisLabel.interval = 5
        this.line1.yAxis[0].min = 0
        this.line1.series[0].name = '客单价'
        this.line1.series[0].data = []
        this.line1.series[1].name = '同期客单价'
        this.line1.series[1].data = []
        this.line1.yAxis[0].axisLabel.formatter = function(val) {
            return (val * 1).toLocaleString()
        }
        this.line1.grid.top = 28
        this.line1.legend = null
        this.line1.tooltip.formatter = function (params) {
            if(Object.prototype.toString.call(params) === '[object Array]') {
                let str = `${params[0].axisValue}<br/>`
                params.forEach((item, index) => {
                    str += `${params[index].marker}${params[index].seriesName}：${that.handleNum('round', params[index].data[1])}<br/>`
                })
                return str
            }else if(Object.prototype.toString.call(params) === '[object Object]') {
                let str = `${params.axisValue}<br/>${params.marker}${params.seriesName}：${that.handleNum('round', params.data[1])}<br/>`
                return str
            }
        }
        this.line2 = _.cloneDeep(this.line1)
        this.line2.yAxis[0].axisLabel.interval = 5
        this.line2.yAxis[0].min = 0
        this.line2.yAxis[0].axisLabel.formatter = function(val) {
            return (val * 1).toLocaleString()
        }
        this.line2.series[0].name = '客户数'
        this.line2.series[1].name = '同期客户数'

        this.overView3.bar = await this.createDoubleBar()
        this.overView3.bar.series[0].data = [100, 200, 100]
        this.overView3.bar.series[1].data = [100, 200, 100]
        this.overView4.bar = this.createDoubleBar()
        this.overView4.bar.series[0].data = [100, 200, 100]
        this.overView4.bar.series[1].data = [100, 200, 100]

        this.bar1 = await this.createDoubleBar()
        this.bar1.series[0].data = [100, 200, 100]
        // this.bar1.series[0].itemStyle.barBorderRadius = 0
        this.bar1.series[1].data = [100, 200, 100]
        // this.bar1.series[1].itemStyle.barBorderRadius = 0
        this.bar1.series[0].name = '成品'
        this.bar1.series[1].name = '定制'
        this.bar1.series[1].itemStyle.color = '#F6BD16'
        this.bar1.legend.data = ['成品', '定制']
        this.bar2 = await this.createDoubleBar()
        this.bar2.series[0].data = [100, 200, 100]
        // this.bar2.series[0].itemStyle.barBorderRadius = 0
        this.bar2.series[1].data = [100, 200, 100]
        // this.bar2.series[1].itemStyle.barBorderRadius = 0
        this.bar2.series[0].name = '成品'
        this.bar2.series[1].name = '定制'
        this.bar2.series[1].itemStyle.color = '#F6BD16'
        this.bar2.legend.data = ['成品', '定制']
        this.getOverView()
        this.getTrend()
    },
    watch: {
        area: {
            handler() {
                this.getTrend()
            }
        },
        month: {
            handler() {
                this.getOverView()
                this.getTrend()
            }
        }
    },
    data() {
        return {
            // month: moment(new Date()).format('YYYYMM'),
            month: moment(new Date()).format('DD') === '01' ? moment(new Date()).subtract(1, 'month').format('YYYYMM') : moment().format('YYYYMM'),
            radio: '成品店',
            overView1: {
                label: '客单价',
                price: null,
                value2: null,
                value3: null,
                bar: null,
            },
            overView2: {
                label: '客户数',
                num: null,
                value2: null,
                value3: null,
                bar: null,
            },
            area: [],
            areaOption: ['东区', '南区', '西区', '北区'],
            line1: null,
            line2: null,
            overView3: {
                label: '客单价',
                price: 1234,
                value2: 1234,
                value3: 1234,
                value4: 1234,
                value5: 1234,
                value6: 1234,
                value7: 1234,
                bar: null,
            },
            overView4: {
                label: '客户数',
                price: 1234,
                value2: 1234,
                value3: 1234,
                value4: 1234,
                value5: 1234,
                value6: 1234,
                value7: 1234,
                bar: null,
            },
            bar1: null,
            bar2: null,
            table: {
                index: 'CustomerUnitPrice',
                labelData: ['指标', '客单价'],
                tableData: [
                    ['年度', null, null, '同比'],
                    ['年累计', null, null, null],
                    ['当期累计', null, null, null]
                ],
            },
            table1: {
                index: 'CustomerUnitPrice',
                labelData: ['指标', '客户数'],
                tableData: [
                    ['年度', null, null, '同比'],
                    ['年累计', null, null, null],
                    ['当期累计', null, null, null]
                ],
            },
        }
    },
    methods: {
        computeColor(index, value) {
            if(value === null || value === undefined) return
            if (value > 0) return 'red'
            else if (value < 0) return 'green'
        },
        comparyNone(arr = [], filterZeroFlag) {
            if (!arr.length) return
            let flag = true
            arr.forEach(item => {
                if (item === null || item === undefined) flag = false
            })
            if (filterZeroFlag && arr[1] === 0) flag = false
            return flag
        },
        async getOverView() {
            let query = {
                MDATE_WID: this.month,
            }
            let res = await this.$fetchSql('new_retail', 'new_retail_unit_price_cp', query)
            res.data = res.data.filter(_ => _.SHOP_TYPE === this.radio)
            this.handleData('overView', res.data)
        },
        async getTrend() {
            let query = {
                MDATE_WID: this.month
            }
            this.area.length ? query.S_OR_N = this.area.toString() : null
            let res = await this.$fetchSql('new_retail', 'new_retail_unit_price_cp_s_or_n', query)
            query.MDATE_WID = query.MDATE_WID - 100 + ''
            let res1 = await this.$fetchSql('new_retail', 'new_retail_unit_price_cp_s_or_n', query)
            // res.data = res.data.filter(_ => _.SHOP_TYPE === this.radio)
            // this.handleData('overView', res.data)
            this.handleData('trend', res.data, res1.data)
            this.handleData('table', res.data, res1.data)
        },
        handleData(type, source, source1) {
            if (type === 'overView') {
                this.overView1.price = null
                this.overView1.value2 = null
                this.overView1.value3 = null
                this.overView1.bar.series[0].data = []
                this.overView1.bar.series[1].data = []
                this.overView2.num = null
                this.overView2.value2 = null
                this.overView2.value3 = null
                this.overView2.bar.series[0].data = []
                this.overView2.bar.series[1].data = []
                this.$refs?.bar1?.$refs?.echarts?.clear()
                this.$refs?.bar2?.$refs?.echarts?.clear()
                let arr = source.filter(_ => moment(_.MDATE).format('YYYYMM') === this.month)
                if (!arr.length) return
                let overView = {
                    PRICE: null,
                    BUYER_CNT: null,
                    YOY_PRICE: null,
                    YOY_BUYER_CNT: null,
                }
                for (let key in overView) {
                    // overView[key] = arr.map(_ => _[key]).filter(_ => _ !== null && _ !== undefined).reduce((a, b) => a + b)
                    let target = arr.map(_ => _[key]).filter(_ => _ !== null && _ !== undefined)
                    if(target.length) overView[key] = target.reduce((a, b) => a + b)
                    else overView[key] = null
                }
                if (!this.comparyNone([overView.PRICE, overView.BUYER_CNT], true)) overView.UNIT_PRICE = null
                else overView.UNIT_PRICE = overView.PRICE / overView.BUYER_CNT
                if (!this.comparyNone([overView.YOY_PRICE, overView.YOY_BUYER_CNT], true)) overView.YOY_UNIT_PRICE = null
                else overView.YOY_UNIT_PRICE = overView.YOY_PRICE / overView.YOY_BUYER_CNT
                if (!this.comparyNone([overView.UNIT_PRICE, overView.YOY_UNIT_PRICE], true)) overView.YOY_DIFF_UNIT_PRICE = null
                else overView.YOY_DIFF_UNIT_PRICE = (overView.UNIT_PRICE - overView.YOY_UNIT_PRICE) / overView.YOY_UNIT_PRICE
                if (!this.comparyNone([overView.BUYER_CNT, overView.YOY_BUYER_CNT], true)) overView.YOY_DIFF_BUYER_CNT = null
                else overView.YOY_DIFF_BUYER_CNT = (overView.BUYER_CNT - overView.YOY_BUYER_CNT) / overView.YOY_BUYER_CNT
                this.overView1.price = overView.UNIT_PRICE
                this.overView1.value2 = overView.YOY_UNIT_PRICE
                this.overView1.value3 = overView.YOY_DIFF_UNIT_PRICE
                this.overView2.num = overView.BUYER_CNT
                this.overView2.value2 = overView.YOY_BUYER_CNT
                this.overView2.value3 = overView.YOY_DIFF_BUYER_CNT

                // arr = [
                //     arr.filter(_ => _.S_OR_N === '东区')[0],
                //     arr.filter(_ => _.S_OR_N === '南区')[0],
                //     arr.filter(_ => _.S_OR_N === '西区')[0],
                //     arr.filter(_ => _.S_OR_N === '北区')[0]
                // ]

                let keys = ['S_OR_N', 'UNIT_PRICE', 'YOY_UNIT_PRICE']
                this.overView1.bar.series[0].data = arr.map(item => {
                    return keys.map(key => {
                        return item[key]
                    })
                })
                this.overView1.bar.series[1].data = arr.map(item => {
                    return [
                        item[keys[0]],
                        item[keys[2]]
                    ]
                })
                this.computeYasisLabel([
                    this.overView1.bar.series[0].data.map(_ => {
                        return _[1]
                    }).filter(_ => _ !== undefined && _ !== null),
                    this.overView1.bar.series[1].data.map(_ => {
                        return _[1]
                    }).filter(_ => _ !== null && _ !== undefined)
                ], 'overView1.bar')
                let keys1 = ['S_OR_N', 'BUYER_CNT', 'YOY_BUYER_CNT']
                this.overView2.bar.series[0].data = arr.map(item => {
                    return keys1.map(key => {
                        return item[key]
                    })
                })
                this.overView2.bar.series[1].data = arr.map(item => {
                    return [
                        item[keys1[0]],
                        item[keys1[2]]
                    ]
                })
                this.computeYasisLabel([
                    this.overView2.bar.series[0].data.map(_ => {
                        return _[1]
                    }).filter(_ => _ !== undefined && _ !== null),
                    this.overView2.bar.series[1].data.map(_ => {
                        return _[1]
                    }).filter(_ => _ !== null && _ !== undefined)
                ], 'overView2.bar')
            }
            else if(type === 'trend') {
                this.line1.xAxis.data = []
                this.line1.series[0].data = []
                this.line1.series[1].data = []
                this.line2.xAxis.data = []
                this.line2.series[0].data = []
                this.line2.series[1].data = []
                let arr = source.filter(_ => moment(_.MDATE).format('YYYY') === moment(this.month).format('YYYY')).concat()
                let arr1 = source1.filter(_ => moment(_.MDATE).format('YYYY') === moment(this.month).format('YYYY') - 1 + '').concat()
                this.$refs?.line1?.$refs?.echarts?.clear()
                this.$refs?.line2?.$refs?.echarts?.clear()
                if(!arr.length && !arr1.length) return;
                let obj = {
                    MDATE: null,
                    PRICE: null,
                    YOY_PRICE: null,
                    BUYER_CNT: null,
                    YOY_BUYER_CNT: null,
                    UNIT_PRICE: null,
                    YOY_UNIT_PRICE: null,
                    YOY_DIFF_UNIT_PRICE: null,
                    YOY_DIFF_BUYER_CNT: null,
                    MDATE_WID: null,
                }
                let newArr = []
                for(let i = 0; i < 12; i++) {
                    newArr.push(JSON.parse(JSON.stringify(obj)))
                    newArr[i].MDATE = (i + 1) + '月'
                }
                newArr.forEach(item => {
                    let keys = ['PRICE', 'BUYER_CNT', 'MDATE_WID']
                    keys.forEach(key => {
                        let filter = arr.filter(_ => moment(_.MDATE).format('M月') === item.MDATE)
                        filter.length ? item[key] = filter[0][key] : item[key] = null
                    })
                })
                newArr.forEach(item => {
                    let keys = [
                        {key1: 'YOY_PRICE', key2: 'PRICE'},
                        {key1: 'YOY_BUYER_CNT', key2: 'BUYER_CNT'}
                    ]
                    keys.forEach(obj => {
                        let filter = arr1.filter(_ => moment(_.MDATE).format('M月') === item.MDATE)
                        filter.length ? item[obj.key1] = filter[0][obj.key2] : item[obj.key1] = null
                    })
                })
                newArr.forEach(item => {
                    if (!this.comparyNone([item.PRICE, item.BUYER_CNT], true)) item.UNIT_PRICE = null
                    else item.UNIT_PRICE = item.PRICE / item.BUYER_CNT
                    if (!this.comparyNone([item.YOY_PRICE, item.YOY_BUYER_CNT], true)) item.YOY_UNIT_PRICE = null
                    else item.YOY_UNIT_PRICE = item.YOY_PRICE / item.YOY_BUYER_CNT
                    if (!this.comparyNone([item.UNIT_PRICE, item.YOY_UNIT_PRICE], true)) item.YOY_DIFF_UNIT_PRICE = null
                    else item.YOY_DIFF_UNIT_PRICE = (item.UNIT_PRICE - item.YOY_UNIT_PRICE) / item.YOY_UNIT_PRICE
                    if (!this.comparyNone([item.BUYER_CNT, item.YOY_BUYER_CNT], true)) item.YOY_DIFF_BUYER_CNT = null
                    else item.YOY_DIFF_BUYER_CNT = (item.BUYER_CNT - item.YOY_BUYER_CNT) / item.YOY_BUYER_CNT
                })
                let keys = ['MDATE', 'UNIT_PRICE', 'YOY_UNIT_PRICE']
                this.line1.xAxis.data = newArr.map(_ => _.MDATE)
                this.line1.series[0].data = newArr.map((item, index) => {
                    if(moment(item.MDATE_WID).format('x') <= moment(this.month).format('x')) {
                        return keys.map((key, index) => {
                            return item[key]
                        })
                    }
                    else return [index]
                })
                this.line1.series[1].data = newArr.map(item => {
                    return [
                        item[keys[0]],
                        item[keys[2]]
                    ]
                })
                this.computeYasisLabel([
                    this.line1.series[0].data.map(_ => {
                        return _[1]
                    }).filter(_ => _ !== undefined && _ !== null),
                    this.line1.series[1].data.map(_ => {
                        return _[1]
                    }).filter(_ => _ !== null && _ !== undefined)
                ], 'line1')
                let keys1 = ['MDATE', 'BUYER_CNT', 'YOY_BUYER_CNT']
                this.line2.xAxis.data = newArr.map(_ => _.MDATE)
                this.line2.series[0].data = newArr.map((item, index) => {
                    if(moment(item.MDATE_WID).format('x') <= moment(this.month).format('x')) {
                        return keys1.map((key, index) => {
                            return item[key]
                        })
                    }
                    else return [index]
                })
                this.line2.series[1].data = newArr.map(item => {
                    return [
                        item[keys1[0]],
                        item[keys1[2]]
                    ]
                })
                this.computeYasisLabel([
                    this.line2.series[0].data.map(_ => {
                        return _[1]
                    }).filter(_ => _ !== undefined && _ !== null),
                    this.line2.series[1].data.map(_ => {
                        return _[1]
                    }).filter(_ => _ !== null && _ !== undefined)
                ], 'line2')
            }
            else if(type === 'table') {
                this.table.tableData.splice(3)
                this.table.tableData[0][1] = moment(this.month).format('YYYY')
                this.table.tableData[0][2] = moment(this.month).format('YYYY') - 1
                this.table.tableData[1] = this.table.tableData[1].map((item, index) => {
                    if(index !== 0) return null
                    else return item
                })
                this.table.tableData[2] = this.table.tableData[2].map((item, index) => {
                    if(index !== 0) return null
                    else return item
                })
                this.table1.tableData.splice(3)
                this.table1.tableData[0][1] = moment(this.month).format('YYYY')
                this.table1.tableData[0][2] = moment(this.month).format('YYYY') - 1
                this.table1.tableData[1] = this.table1.tableData[1].map((item, index) => {
                    if(index !== 0) return null
                    else return item
                })
                this.table1.tableData[2] = this.table1.tableData[2].map((item, index) => {
                    if(index !== 0) return null
                    else return item
                })
                let arr = source.filter(_ => moment(_.MDATE).format('YYYY') === moment(this.month).format('YYYY')).concat()
                let arr1 = source1.filter(_ => moment(_.MDATE).format('YYYY') === moment(this.month).format('YYYY') - 1 + '').concat()
                if(!arr.length && !arr1.length) return
                let obj = {
                    MDATE: null,
                    PRICE: null,
                    YOY_PRICE: null,
                    BUYER_CNT: null,
                    YOY_BUYER_CNT: null,
                    UNIT_PRICE: null,
                    YOY_UNIT_PRICE: null,
                    YOY_DIFF_UNIT_PRICE: null,
                    YOY_DIFF_BUYER_CNT: null,
                }
                let newArr = []
                for(let i = 0; i < 12; i++) {
                    newArr.push(JSON.parse(JSON.stringify(obj)))
                    newArr[i].MDATE = (i + 1) + '月'
                }
                newArr.forEach(item => {
                    let keys = ['PRICE', 'BUYER_CNT']
                    keys.forEach(key => {
                        let filter = arr.filter(_ => moment(_.MDATE).format('M月') === item.MDATE)
                        filter.length ? item[key] = filter[0][key] : item[key] = null
                    })
                })
                newArr.forEach(item => {
                    let keys = [
                        {key1: 'YOY_PRICE', key2: 'PRICE'},
                        {key1: 'YOY_BUYER_CNT', key2: 'BUYER_CNT'}
                    ]
                    keys.forEach(obj => {
                        let filter = arr1.filter(_ => moment(_.MDATE).format('M月') === item.MDATE)
                        filter.length ? item[obj.key1] = filter[0][obj.key2] : item[obj.key1] = null
                    })
                })
                newArr.forEach(item => {
                    if (!this.comparyNone([item.PRICE, item.BUYER_CNT], true)) item.UNIT_PRICE = null
                    else item.UNIT_PRICE = item.PRICE / item.BUYER_CNT
                    if (!this.comparyNone([item.YOY_PRICE, item.YOY_BUYER_CNT], true)) item.YOY_UNIT_PRICE = null
                    else item.YOY_UNIT_PRICE = item.YOY_PRICE / item.YOY_BUYER_CNT
                    if (!this.comparyNone([item.UNIT_PRICE, item.YOY_UNIT_PRICE], true)) item.YOY_DIFF_UNIT_PRICE = null
                    else item.YOY_DIFF_UNIT_PRICE = (item.UNIT_PRICE - item.YOY_UNIT_PRICE) / item.YOY_UNIT_PRICE
                    if (!this.comparyNone([item.BUYER_CNT, item.YOY_BUYER_CNT], true)) item.YOY_DIFF_BUYER_CNT = null
                    else item.YOY_DIFF_BUYER_CNT = (item.BUYER_CNT - item.YOY_BUYER_CNT) / item.YOY_BUYER_CNT
                })
                let keys = ['MDATE', 'UNIT_PRICE', 'YOY_UNIT_PRICE', 'YOY_DIFF_UNIT_PRICE']
                let monthcol = newArr.map(item => {
                    return keys.map(key => {
                        return item[key]
                    })
                })
                this.table.tableData = this.table.tableData.concat(monthcol)
                let keys1 = ['MDATE', 'BUYER_CNT', 'YOY_BUYER_CNT', 'YOY_DIFF_BUYER_CNT']
                let monthcol1 = newArr.map(item => {
                    return keys1.map(key => {
                        return item[key]
                    })
                })
                this.table1.tableData = this.table1.tableData.concat(monthcol1)
                let that = this
                let createSomeMonthCol = function(someArr = []) {
                    if(!someArr.length) return null
                    let obj = {
                        MDATE: null,
                        PRICE: null,
                        YOY_PRICE: null,
                        BUYER_CNT: null,
                        YOY_BUYER_CNT: null,
                        UNIT_PRICE: null,
                        YOY_UNIT_PRICE: null,
                        YOY_DIFF_UNIT_PRICE: null,
                        YOY_DIFF_BUYER_CNT: null
                    }
                    let keys = ['PRICE', 'YOY_PRICE', 'BUYER_CNT', 'YOY_BUYER_CNT']
                    keys.forEach(key => {
                        let keyArr = someArr.map(_ => _[key]).filter(_ => _ !== null)
                        if(keyArr.length) obj[key] = keyArr.reduce((a, b) => a + b)
                    })
                    if (!that.comparyNone([obj.PRICE, obj.BUYER_CNT], true)) obj.UNIT_PRICE = null
                    else obj.UNIT_PRICE = obj.PRICE / obj.BUYER_CNT
                    if (!that.comparyNone([obj.YOY_PRICE, obj.YOY_BUYER_CNT], true)) obj.YOY_UNIT_PRICE = null
                    else obj.YOY_UNIT_PRICE = obj.YOY_PRICE / obj.YOY_BUYER_CNT
                    if (!that.comparyNone([obj.UNIT_PRICE, obj.YOY_UNIT_PRICE], true)) obj.YOY_DIFF_UNIT_PRICE = null
                    else obj.YOY_DIFF_UNIT_PRICE = (obj.UNIT_PRICE - obj.YOY_UNIT_PRICE) / obj.YOY_UNIT_PRICE
                    if (!that.comparyNone([obj.BUYER_CNT, obj.YOY_BUYER_CNT], true)) obj.YOY_DIFF_BUYER_CNT = null
                    else obj.YOY_DIFF_BUYER_CNT = (obj.BUYER_CNT - obj.YOY_BUYER_CNT) / obj.YOY_BUYER_CNT
                    return obj
                }
                let montnCol, yearCol
                // if(moment(this.month).format('YYYY') === moment().format('YYYY')) {
                    montnCol = createSomeMonthCol(newArr.slice(0, moment(this.month).month() + 1))
                    yearCol = createSomeMonthCol(newArr)
                // }
                // else if(this.month < moment().format('YYYY')){
                //     montnCol = createSomeMonthCol(newArr)
                //     yearCol = createSomeMonthCol(newArr)
                // }
                // else if(this.month > moment().format('YYYY')) {
                //     montnCol = {
                //         PROFIT_RATE: null,
                //         LOCK_COST: null,
                //         PRE_DSCNT_ACT_PRC: null,
                //         AGO_PROFIT_RATE: null,
                //         AGO_PRE_DSCNT_ACT_PRC: null,
                //         AGO_LOCK_COST: null,
                //         diff: null,
                //         YearOnYear: null,
                //         PROFIT_RATE_GOAL: null,
                //         Reach: null,
                //     }
                //     yearCol = JSON.parse(JSON.stringify(montnCol))
                // }
                this.table.tableData[1] = [
                    '年累计',
                    ...keys.slice(1).map(key => {
                        return yearCol[key]
                    })
                ]
                this.table.tableData[2] = [
                    '当期累计',
                    ...keys.slice(1).map(key => {
                        return montnCol[key]
                    })
                ]
                this.table1.tableData[1] = [
                    '年累计',
                    ...keys1.slice(1).map(key => {
                        return yearCol[key]
                    })
                ]
                this.table1.tableData[2] = [
                    '当期累计',
                    ...keys1.slice(1).map(key => {
                        return montnCol[key]
                    })
                ]
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.red{
    color: #ff5953!important;
}
.green{
    color: #00a854!important;
}
.CustomerUnitPrice {
    .header {
        height: 38px;
        padding-bottom: 10px;
        border-bottom: 1px solid #f0f0f0;
        display: grid;
        grid-template-columns: auto auto auto 1fr auto;
        justify-content: space-between;
        align-items: center;
        position: relative;

        span:nth-last-child(1) {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #000000;
            line-height: 22px;
        }

        span:nth-child(2) {
            margin-top: 2px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(0, 0, 0, 0.88);
            line-height: 20px;
        }
        span:nth-child(3) {
            margin-top: 0;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(0, 0, 0, 0.25);
            line-height: 20px;
        }
    }

    .main {
        margin-top: 6px;
        height: calc(100% - 48px - 6px);

        .overView {
            height: 98px;
            display: grid;
            gap: 76px;
            grid-template-columns: repeat(2, 1fr);

            .item {
                height: 98px;
                display: grid;
                grid-template-columns: repeat(1, 1fr 4fr);
                gap: 40px;
                position: relative;

                .panel {
                    div:nth-child(1) {
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: rgba(0, 0, 0, 0.64);
                        line-height: 22px;
                        margin-bottom: 6px;
                    }

                    div:nth-child(2) {
                        font-size: 24px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 600;
                        color: #333333;
                        line-height: 24px;
                        margin-bottom: 10px;
                    }

                    div:nth-child(3),
                    div:nth-child(4) {
                        display: grid;
                        grid-template-columns: repeat(2, auto);
                        justify-content: space-between;

                        span {
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            color: #999999;
                            line-height: 18px;
                        }
                    }
                }

                .bar {
                    overflow: visible!important;
                }

                .bartitle {
                    position: absolute;
                    left: calc(20% + 40px);
                    top: 0;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: rgba(0, 0, 0, 0.64);
                    line-height: 22px;
                }
            }
        }

        .overView1 {
            height: 98px;
            display: grid;
            gap: 76px;
            grid-template-columns: repeat(2, 1fr);

            .item {
                height: 98px;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 25px;
                position: relative;

                .panel {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 30px;

                    .col1 {
                        div:nth-child(1) {
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            color: rgba(0, 0, 0, 0.64);
                            line-height: 22px;
                            margin-bottom: 6px;
                        }

                        div:nth-child(2) {
                            font-size: 24px;
                            font-family: PingFangSC-Medium, PingFang SC;
                            font-weight: 600;
                            color: #333333;
                            line-height: 24px;
                            margin-bottom: 10px;
                        }

                        div:nth-child(3),
                        div:nth-child(4) {
                            display: grid;
                            grid-template-columns: repeat(2, auto);
                            justify-content: space-between;

                            span {
                                font-size: 12px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                color: #999999;
                                line-height: 18px;
                            }
                        }
                    }

                    .col2 {
                        div:nth-child(1) {
                            margin-top: 42px;
                            margin-bottom: 2px;
                            font-size: 12px;
                            font-family: PingFangSC-Medium, PingFang SC;
                            font-weight: 600;
                            color: #4e4e4e;
                            line-height: 18px;
                        }

                        div:nth-child(2),
                        div:nth-child(3) {
                            display: grid;
                            grid-template-columns: repeat(2, auto);
                            justify-content: space-between;

                            span {
                                font-size: 12px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                color: #999999;
                                line-height: 18px;
                            }
                        }
                    }
                }

                .bar {
                    width: calc(100%) !important;
                    overflow: visible!important;
                }

                .bartitle {
                    position: absolute;
                    left: calc(50% + 25px);
                    top: 0;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: rgba(0, 0, 0, 0.64);
                    line-height: 22px;
                }
            }
        }

        .selects {
            margin-top: 10px;
            height: 30px;
            display: grid;
            grid-template-columns: auto auto 1fr;
            align-items: center;
            // background: #fafafa;
            display: flex;
            justify-content: flex-end;

            span:nth-child(1) {
                margin-left: 13px;
            }
        }

        .lineBox {
            margin-top: 6px;
            height: calc(100% - 333px);
            width: 100%;
            display: flex;
            //gap: 104px;
            //grid-template-columns: repeat(2, 1fr);
            position: relative;
            .line{
                flex: 1;
                height: calc(100%)!important;
            }
            div:nth-child(1) {
                position: absolute;
                top: 0;
                left: 0;
            }

            div:nth-child(2) {
                position: absolute;
                top: 0;
                left: calc(50% + 52px);
            }

            div:nth-child(1),
            div:nth-child(2) {
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.64);
                line-height: 22px;
            }
        }

        .tableBox {
            margin-top: 10px;

            .table1 {
                /deep/ .col1 {
                    .row:nth-child(1) {
                        text-align: center;
                    }

                    .row:nth-child(2) {
                        height: calc(100% - 25px);
                        text-align: center;
                    }

                    .row:nth-child(2)::before {
                        content: '';
                        display: inline-block;
                        vertical-align: middle;
                        height: 100%;
                    }
                }
            }

            .table2 {
                /deep/ .row:nth-child(1) {
                    display: none;
                }

                /deep/ .row:nth-child(2) {
                    border-top: none;
                }

                /deep/ .col1 {
                    .row:nth-child(2) {
                        height: 100%;
                        text-align: center;
                    }

                    .row:nth-child(2)::before {
                        content: '';
                        display: inline-block;
                        vertical-align: middle;
                        height: 100%;
                    }
                }
            }
        }
    }
}
</style>