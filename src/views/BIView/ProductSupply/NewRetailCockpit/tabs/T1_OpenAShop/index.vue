<!--发货业绩-->
<template>
    <div class="OpenAShop">
        <div class="header">
            <Title class="title" style="z-index: 2" :label="type === 'deliver' ? '发货业绩' : '支付业绩'" :jump="type === 'deliver' ? true : false" :jumpTarget="jumpTarget"/>
            <Select class="select mr10" v-bind="select" :value.sync="select.value"></Select>
            <a-range-picker :disabled-date="disabledDate" style="width: 250px" v-model="date" :allowClear="false"
            @calendarChange="calendarChange"
            @openChange="openChange"
            />
        </div>
        <div class="main">
            <div class="panel">
                <Panel :class="['item', computeClass(item.datas.label1)]" @click.native="clickPanel(item.datas.label1)"
                       v-for="(item, index) in panels" :key="index" v-bind="item"/>
            </div>
            <v-chart ref="echart" class="echarts" style="overflow: visible;" :options="echart" autoresize></v-chart>
            <div class="table">
                <Table v-bind="table1" class="mb10"/>
                <Table v-bind="table2"/>
            </div>
        </div>
    </div>
</template>

<script>
import Title from '../../components/Title'
import Select from '../../components/Select'
import moment from 'moment'
import Panel from '../../components/Panel'
import base from '../../utils/base'
import Table from '../../components/Table'
import _ from 'lodash'
export default {
    name: 'Comp1',
    mixins: [base],
    components: {
        Title,
        Select,
        Panel,
        Table,
    },
    async created() {
        this.echart = await this.createBarAndLineEchart()
        this.echart.yAxis[0].axisLabel.interval = 4
        this.echart.yAxis[0].show = false
        this.echart.yAxis[0].min = 0
        this.echart.grid.top = 20
        let that = this
        this.echart.tooltip.formatter = function (params) {
            let str = ''
            if (that.type === 'deliver') {
                return str = `统计日期：${params[0].data[0]}<br/>发货目标：${that.handleNum('round', params[0].data[2])}<br/>发货业绩：${that.handleNum('round', params[0].data[1])}`
            } else if (that.type === 'pay') {
                return str = `统计日期：${params[0].data[0]}<br/>支付目标：${that.handleNum('round', params[0].data[2])}<br/>支付业绩：${that.handleNum('round', params[0].data[1])}`
            }
            //         str1 = `统计年月：${params[0].data[3]}<br/>发货目标：${that.handleNumV2(1, params[0].data[2])}<br/>发货业绩：${that.handleNumV2(1, params[0].data[1])}`
        }
        this.getOverView()
        this.getLine()
        this.timer = setInterval(() => {
            that.getOverView()
            that.getLine()
        }, 30000)
    },
    beforeDestroy() {
        this.echart === null ? this.echart = null : null
        clearInterval(this.timer)
    },
    watch: {
        condition: {
            handler() {
                this.getOverView()
                this.getLine()
            }
        },
        curPanel: {
            handler(val) {
                this.getLine()
            }
        },
        type: {
            handler() {
                this.curPanel = '线下整体'
                this.select.value = '总体'
                this.date = [
                    moment(new Date()).format('DD') === '01' ? moment(new Date()).subtract(1, 'month').startOf('month') : moment().startOf('month'),
                    moment(new Date()).format('DD') === '01' ? moment(new Date()).subtract(1, 'month').endOf('month') : moment().endOf('month')
                ]
            }
        },
        'select.value': {
            handler(val){
                if(val === '总体') this.panels[0].datas.label1 = '线下整体'
                else if(val !== '总体') this.panels[0].datas.label1 = '线下' + val
                this.curPanel = '线下整体'
            }
        }
    },
    computed: {
        condition() {
            return this.type + JSON.stringify(this.date) + '-' + this.select.value
        },
        jumpTarget() {
            let str = ''
            if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
                str = 'http://test.bi.linshimuye.com:9090/x/612_616_3_4282_5482'
            }
            else {
                str = 'http://bi.linshimuye.com:9090/x/612_616_3_3181_3167'
            }
            return str
        }
    },
    data() {
        return {
            timer: null,
            // deliver发货 pay支付
            type: 'deliver',
            panels: [
                {
                    type: 'type1',
                    comp: 'OpenAShop',
                    echart: {
                        value: '--'
                    },
                    datas: {
                        label1: '线下整体',
                        value1: null,
                        label2: '目标',
                        value2: null,
                        label3: '完成率',
                        value3: null,
                        label4: '同比',
                        value4: null,
                    }
                },
                {
                    comp: 'OpenAShop',
                    datas: {
                        label1: '东区',
                        value1: null,
                        label2: '目标',
                        value2: null,
                        label3: '完成率',
                        value3: null,
                        label4: '同比',
                        value4: null,
                    }
                },
                {
                    comp: 'OpenAShop',
                    datas: {
                        label1: '南区',
                        value1: null,
                        label2: '目标',
                        value2: null,
                        label3: '完成率',
                        value3: null,
                        label4: '同比',
                        value4: null,
                    }
                },
                {
                    comp: 'OpenAShop',
                    datas: {
                        label1: '西区',
                        value1: null,
                        label2: '目标',
                        value2: null,
                        label3: '完成率',
                        value3: null,
                        label4: '同比',
                        value4: null,
                    }
                },
                {
                    comp: 'OpenAShop',
                    datas: {
                        label1: '北区',
                        value1: null,
                        label2: '目标',
                        value2: null,
                        label3: '完成率',
                        value3: null,
                        label4: '同比',
                        value4: null,
                    }
                },
            ],
            curPanel: '线下整体',
            select: {
                label: '主营类目',
                value: '总体',
                options: ['总体', '成品', '定制'],
            },
            table1: {
                index: 'OpenAShop',
                labelData: ['日期', '支付目标', '支付业绩', '完成率'],
                tableData: [],
            },
            table2: {
                index: 'OpenAShop',
                labelData: ['日期', '支付目标', '支付业绩', '完成率'],
                tableData: [],
            },
            echart: null,
            // month: moment(new Date()).format('DD') === '01' ? moment(new Date()).subtract(1, 'month').format('YYYYMM') : moment().format('YYYYMM'),
            date: [
                moment(new Date()).format('DD') === '01' ? moment(new Date()).subtract(1, 'month').startOf('month') : moment().startOf('month'),
                moment(new Date()).format('DD') === '01' ? moment(new Date()).subtract(1, 'month').endOf('month') : moment().endOf('month')
            ],
            defaultState: true,
            hoverDate: null
        }
    },
    methods: {
        openChange(status) {
            if(!status) this.hoverDate = null
        },
        disabledDate(current) {
            if(current.format('HH:ss:mm').indexOf('59') <= -1) {
                return current && 
                (this.hoverDate && (current - moment(this.hoverDate).subtract(31, 'days') < 0 || current - moment(this.hoverDate).add(31, 'days') > 0) || 
                current - moment().endOf('month') > 0)
            }
            else {
                return current && 
                (this.hoverDate && (current - moment(this.hoverDate).subtract(31, 'days') < 0 || current - moment(this.hoverDate).add(31, 'days') > 0) || 
                current - moment().endOf('month').add(1, 'day') > 0)
            }

        },
        // disabledDate(current) {
        //     return current && current - moment() > 0
        // },
        calendarChange(val, str , datestr) {
            this.hoverDate = moment(val[0]).format('YYYYMMDD')
        },
        computeClass(val) {
            if (this.curPanel === val && this.defaultState) return 'active'
            else return
        },
        clickPanel(val) {
            this.defaultState = true
            if(['线下整体', '线下成品', '线下定制'].includes(val)) this.curPanel = '线下整体'
            else this.curPanel = val
        },
        async getOverView() {
            let query = {
                START_TIME: this.date[0].format('YYYYMMDD'),
                END_TIME: this.date[1].format('YYYYMMDD')
            }
            this.select.value === '总体' ? null : query.PRODUCT_CATE = this.select.value
            let api = this.type === 'deliver' ? 'new_retail_dlvr_sum' : 'new_retail_pay_sum'
            let res = await this.$fetchSql('new_retail', api, query)
            this.handleData('overView', res.data)
        },
        async getLine() {
            let query = {
                START_TIME: this.date[0].format('YYYYMMDD'),
                END_TIME: this.date[1].format('YYYYMMDD'),
                S_OR_N: this.curPanel
            }
            this.select.value === '总体' ? null : query.PRODUCT_CATE = this.select.value
            // this.curPanel === '线下整体' ? null : query.S_OR_N = this.curPanel
            let api = this.type === 'deliver' ? 'new_retail_dlvr' : 'new_retail_pay'
            let res = await this.$fetchSql('new_retail', api, query)
            this.handleData('line', res.data)
            this.handleData('table', res.data)
        },
        handleData(type, source) {
            if (type === 'overView') {
                this.panels.forEach(item => {
                    if (item.echart) item.echart.value = 0
                    item.datas.value1 = '--'
                    item.datas.value2 = '--'
                    item.datas.value3 = '--'
                    item.datas.value4 = '--'
                })
                if (!source.length) return
                let S_OR_Nkeys = this.panels.map(item => {
                    if(['线下整体', '线下成品', '线下定制'].includes(item.datas.label1)) return '线下整体'
                    return item.datas.label1
                })
                // let keys = ['线下整体', '东区', '南区', '西区', '北区']
                let arr = S_OR_Nkeys.map(key => {
                    return source.filter(_ => _.S_OR_N === key)[0]
                })
                let keyIndex = this.type === 'deliver' ? 0 : 1
                let keys = [
                    ['PTD_DLVR_RATE', 'PTD_DLVR_AMT', 'PTD_DLVR_TGT', 'PTD_DLVR_RATE', 'YOY_DLVR_RATE'],
                    ['PTD_PAY_RATE', 'PTD_PAY_AMT', 'PTD_PAY_TGT', 'PTD_PAY_RATE', 'YOY_PAY_RATE']
                ]
                this.panels.forEach((item, index) => {
                    if (item.echart) item.echart.value = arr[index][keys[keyIndex][0]]
                    item.datas.value1 = arr[index][keys[keyIndex][1]]
                    item.datas.value2 = arr[index][keys[keyIndex][2]]
                    item.datas.value3 = arr[index][keys[keyIndex][3]]
                    item.datas.value4 = arr[index][keys[keyIndex][4]]
                })
            }
            else if (type === 'line') {
                let arr = source.concat()
                this.echart.xAxis[0].data = []
                this.echart.series[0].data = []
                this.echart.series[1].data = []
                this.$refs?.echart?.$refs?.echarts?.clear()
                if (!arr.length) return
                let keys = this.type === 'deliver' ? ['YYYYMMDD', 'PTD_DLVR_AMT', 'PTD_DLVR_TGT'] : ['YYYYMMDD', 'PTD_PAY_AMT', 'PTD_PAY_TGT']
                arr.sort((a, b) => a[keys[0]] - b[keys[0]])
                this.echart.xAxis[0].data = Object.freeze(Array.from(new Set(arr.map(_ => moment(_[keys[0]] + '').format('M月DD日')))))
                this.echart.series[0].data = arr.map(item => {
                    return keys.map(key => {
                        if(key === 'YYYYMMDD') return moment(item[key] + '').format('M月DD日')
                        return item[key]
                    })
                })
                this.echart.series[1].data = arr.map(item => {
                    return [
                        moment(item[keys[0]] + '').format('M月DD日'),
                        item[keys[2]]
                    ]
                })
                this.computeYasisLabel([
                    this.echart.series[0].data.map(_ => {
                        return _[1]
                    }).filter(_ => _ !== undefined && _ !== null),
                    this.echart.series[1].data.map(_ => {
                        return _[1]
                    }).filter(_ => _ !== null && _ !== undefined)
                ], 'echart')
            }
            else if (type === 'table') {
                let arr = source.concat()
                arr.sort((a, b) => a.YYYYMMDD - b.YYYYMMDD)
                let labels = [
                    ['日期', '发货目标', '发货业绩', '完成率'],
                    ['日期', '支付目标', '支付业绩', '完成率'],
                ]
                let keysIndex = this.type === 'deliver' ? 0 : 1
                this.table1.labelData = labels[keysIndex]
                this.table2.labelData = labels[keysIndex]
                this.table1.tableData = []
                this.table2.tableData = []
                if (!arr.length) return
                let keys = [
                    ['YYYYMMDD', 'PTD_DLVR_TGT', 'PTD_DLVR_AMT', 'PTD_DLVR_RATE'],
                    ['YYYYMMDD', 'PTD_PAY_TGT', 'PTD_PAY_AMT', 'PTD_PAY_RATE'],
                ]
                let daysOnMonth = arr.length
                let colNumber = 0
                if (daysOnMonth >= 30) colNumber = 16
                else colNumber = 15
                this.table1.tableData = arr.slice(0, colNumber).map(item => {
                    return keys[keysIndex].map((key, index) => {
                        if(index === 0) return moment(item[key] + '').format('M月DD日')
                        if (index === 2 || index === 3 ) {
                            let date = item[keys[keysIndex][0]]
                            if (moment(date + '').format('x') <= moment(new Date()).format('x')) return item[key]
                            else return '--'
                        }
                        return item[key]
                    })
                })
                if (arr.length <= colNumber) {
                    for (let i = 0; i < colNumber - arr.length; i++) {
                        this.table1.tableData.push(this.table1.labelData.map(_ => '/'))
                    }
                    for (let i = 0; i < colNumber; i++) {
                        this.table2.tableData.push(this.table2.labelData.map(_ => '/'))
                    }
                } else {
                    this.table2.tableData = arr.slice(colNumber).map(item => {
                        return keys[keysIndex].map((key, index) => {
                            if(index === 0) return moment(item[key] + '').format('M月DD日')
                            if (index === 2 || index === 3 || index === 4) {
                                let date = item[keys[keysIndex][0]]
                                if (moment(date + '').format('x') <= moment(new Date()).format('x')) return item[key]
                                else return '--'
                            }
                            return item[key]
                        })
                    })
                    for (let i = 0; i < 2 * colNumber - arr.length; i++) {
                        this.table2.tableData.push(this.table2.labelData.map(_ => '/'))
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles.scss';
.OpenAShop {
    .header {
        height: 38px;
        padding-bottom: 10px;
        border-bottom: 1px solid #F0F0F0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        position: relative;

        .title {
            position: absolute;
            left: 0px;
        }

        .monthPicker {
            height: 28px;
            width: 120px;
        }

        /deep/ .ant-input {
            height: 28px;
        }
        // /deep/ .Jump {
        //     color: #4C89FF;
            
        // }
    }

    .main {
        height: calc(100% - 38px);

        .panel {
            margin-top: 10px;
            height: 136px;
            display: grid;
            grid-template-columns: 366px repeat(4, 1fr);
            // gap: 3px;
            cursor: pointer;
            .item {
                transition: background 0.3s;
                border-radius: 5px;
            }

            .item:hover {
                background: $panelsHoverColor;
                // border-top: 5px solid #46bca0
            }

            .active {
                background: $panelsHoverColor;
                // border-top: 5px solid #46bca0
            }
        }

        .echarts {
            height: calc(100% - 364px) !important;
        }

        .table {
            height: 218px;
        }
    }
}
</style>